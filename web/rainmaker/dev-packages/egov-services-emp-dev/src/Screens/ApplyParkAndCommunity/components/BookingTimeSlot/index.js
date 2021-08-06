import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import get from "lodash/get";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import moment from 'moment';
import {
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertDateInYMD } from "../../../../modules/commonFunction"
class CustomTimeSlots extends Component {
  constructor() {
    super();
    let currentDateObj = new Date();
    let month = ("0" + (currentDateObj.getMonth() + 1)).slice(-2);
    let day = ("0" + currentDateObj.getDate()).slice(-2);
    let year = currentDateObj.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    let currentDateForLimit = new Date();
    currentDateForLimit.setDate(currentDateForLimit.getDate() + 179);
    let limitMonth = ("0" + (currentDateForLimit.getMonth() + 1)).slice(-2);
    let limitDay = ("0" + currentDateForLimit.getDate()).slice(-2);
    let limitYear = currentDateForLimit.getFullYear();
    let currentLimitDate = `${limitYear}-${limitMonth}-${limitDay}`;

    let dateInputProps = {
      min: currentDate,
      max: currentLimitDate,
    };

    this.state = {
      currentSlide: 0,
      selectedDate: "",
      currentDate: currentDate,
      dateInputProps: dateInputProps,
    };}

  componentDidMount() {
    if (this.props.initiatedBookingFromDate) {

      let initiatedBookingFromDateYmdFormat= convertDateInYMD(this.props.initiatedBookingFromDate)

      var [goYear, goMonth, goDay] = initiatedBookingFromDateYmdFormat.split(
        "-"
      );
      let goDate = `${goDay}-${goMonth}-${goYear}`;
      let i = 0;
      
      for (i; i < this.props.rows.length; i++) {
        if (this.props.rows[i].date == goDate) {
          break;
        }
      }
      
      this.setState((state) => ({
        currentSlide: i,
      }));
    }
  }
  componentWillReceiveProps(nextProps) {
  }
  selectTimeSlot = (e) => {
   
   
    var cbarray = document.getElementsByName("time-slot");
   
    var [from, to] = e.target.getAttribute("data-timeslot").split("-");
    if (e.target.getAttribute("data-date") == this.props.isSameDate && from === this.props.firstToTime) {
      this.props.prepareFinalObject(
        "perDayBookedSlotCount",
        this.props.perDayBookedSlotCount + 1
      );
      let perDayBookedSlotCount = this.props.perDayBookedSlotCount;
      if(e.target.getAttribute("data-timeslot") === "9AM-9PM"){
        
         for (var i = 0; i < cbarray.length; i++) {
            cbarray[i].checked = false;
          }
    
          document.getElementById(
            e.target.getAttribute("data-date") +
              ":" +
              e.target.getAttribute("data-timeslot")
          ).checked = true;

         var [apiDay, apiMonth, apiYear] = e.target
         .getAttribute("data-date")
         .split("-");
       let apiDate = `${apiYear}-${apiMonth}-${apiDay}`;

       let changefromDate = moment(apiDate).format("YYYY-MM-DD");
       
       let changeToDate = moment(apiDate).format("YYYY-MM-DD");
       

this.props.prepareFinalObject("Booking.wholeDay",apiDate)
this.props.prepareFinalObject("Booking.wholeDay.slotOne","9AM - 1PM")
this.props.prepareFinalObject("Booking.wholeDay.slotTwo","1PM - 5PM")
this.props.prepareFinalObject("Booking.wholeDay.slotThree","5PM - 9PM")
this.props.prepareFinalObject("Booking.wholeDay.FromDate",changefromDate + "," +"9AM")
this.props.prepareFinalObject("Booking.wholeDay.ToDate",changeToDate + "," +"9PM")
      }
      var [from, to] = e.target.getAttribute("data-timeslot").split("-");
      var [apiDay, apiMonth, apiYear] = e.target
        .getAttribute("data-date")
        .split("-");
      let apiDate = `${apiYear}-${apiMonth}-${apiDay}`;
      this.props.prepareFinalObject("Booking.bkToDate", apiDate);
      this.props.prepareFinalObject("Booking.bkFromDate", apiDate);
      this.props.prepareFinalObject("Booking.bkFromTimeTwo", from);
      this.props.prepareFinalObject("Booking.bkToTimeTwo", to);

      this.props.prepareFinalObject("availabilityCheckData.bkToDate", apiDate);
      this.props.prepareFinalObject(
        "availabilityCheckData.bkFromDate",
        apiDate
      );
      this.props.prepareFinalObject(
        "availabilityCheckData.bkFromTimeTwo",
        from
      );
      this.props.prepareFinalObject("availabilityCheckData.bkToTimeTwo", to);
      var selectedTimeSlots = [];
      selectedTimeSlots[0]=this.props.initiatedBookingTimeSlot[0]
      //this.setState({ selectedTimeSlots: { slot: `${from}-${to}` } },
      selectedTimeSlots.push({ slot: `${from}-${to}` });
      this.props.prepareFinalObject("Booking.timeslotsTwo", selectedTimeSlots[1]);
      this.props.prepareFinalObject("Booking.timeslots", selectedTimeSlots);
      this.props.prepareFinalObject(
        "availabilityCheckData.timeslotsTwo",
        selectedTimeSlots
      );
      this.props.prepareFinalObject(
        "availabilityCheckData.timeslots",
        selectedTimeSlots
    );
      // this.props.prepareFinalObject(
      //     "DisplayPacc.bkDisplayFromDateTime",
      //     e.target.getAttribute("data-date") + ", " + from
      // );
      this.props.prepareFinalObject(
        "DisplayPacc.bkDisplayToDateTime",
        e.target.getAttribute("data-date") + ", " + to
      );
    } else {
      this.props.prepareFinalObject("perDayBookedSlotCount", 1);

      this.props.prepareFinalObject(
        "isSameDate",
        e.target.getAttribute("data-date")
      );

      for (var i = 0; i < cbarray.length; i++) {
        cbarray[i].checked = false;
      }

      document.getElementById(
        e.target.getAttribute("data-date") +
          ":" +
          e.target.getAttribute("data-timeslot")
      ).checked = true;
   
      var [from, to] = e.target.getAttribute("data-timeslot").split("-");
      var [apiDay, apiMonth, apiYear] = e.target
        .getAttribute("data-date")
        .split("-");
      let apiDate = `${apiYear}-${apiMonth}-${apiDay}`;
      this.props.prepareFinalObject("Booking.bkToDate", apiDate);
      this.props.prepareFinalObject("Booking.bkFromDate", apiDate);
      this.props.prepareFinalObject("Booking.bkFromTime", from);
      this.props.prepareFinalObject("Booking.bkToTime", to);

      this.props.prepareFinalObject("availabilityCheckData.bkToDate", apiDate);
      this.props.prepareFinalObject(
        "availabilityCheckData.bkFromDate",
        apiDate
      );
      this.props.prepareFinalObject("availabilityCheckData.bkFromTime", from);
      this.props.prepareFinalObject("availabilityCheckData.bkToTime", to);
      var selectedTimeSlots = [];
      //this.setState({ selectedTimeSlots: { slot: `${from}-${to}` } },
      selectedTimeSlots.push({ slot: `${from}-${to}` });
      this.props.prepareFinalObject("Booking.timeslots", selectedTimeSlots);
      this.props.prepareFinalObject(
        "availabilityCheckData.timeslots",
        selectedTimeSlots
      );
      this.props.prepareFinalObject(
        "DisplayPacc.bkDisplayFromDateTime",
        e.target.getAttribute("data-date") + ", " + from
      );
      this.props.prepareFinalObject(
        "DisplayPacc.bkDisplayToDateTime",
        e.target.getAttribute("data-date") + ", " + to
      );
      //)
    }
  };

  goHandler = () => {
    var [goYear, goMonth, goDay] = this.state.selectedDate.split("-");
    let goDate = `${goDay}-${goMonth}-${goYear}`;
    let i = 0;

    for (i; i < this.props.rows.length; i++) {
      if (this.props.rows[i].date == goDate) {
        break;
      }
    }
    this.setState((state) => ({
      currentSlide: i,
    }));
  };
  updateCurrentSlide = (index) => {
    const { currentSlide } = this.state;

    if (currentSlide !== index) {
      this.setState({
        currentSlide: index,
      });
    }
  };
  render() {
    const classes = withStyles();
    let { rows, currentDate, currentSelectedTimeSlot } = this.props;

    const arrowStyles = {
      position: "absolute",
      zIndex: 2,
      top: "16px",
      width: 30,
      height: 30,
      cursor: "pointer",
    };

    return (
      <div>
        <Grid container={true} justify="flex-end">
          <Grid item={true} xs={2}>
            <TextField
              id="date"
              label="Select Date"
              type="date"
              defaultValue={this.state.currentDate}
              onChange={(event) => {
                this.setState({
                  selectedDate: event.target.value,
                });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={this.state.dateInputProps}
              style={{ marginLeft: "50px" }}
            />
          </Grid>
          <Grid item={true} xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.goHandler}
              style={{
                minWidth: "100px",
                height: "40px",
                marginTop: "15px",
                float: "right",
              }}
            >
              GO
            </Button>
          </Grid>
        </Grid>
        <Carousel
          selectedItem={this.state.currentSlide}
          onChange={this.updateCurrentSlide}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...arrowStyles, left: 15 }}
              >
                {"<"}
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                style={{ ...arrowStyles, right: 15 }}
              >
                {">"}
              </button>
            )
          }
        >
          {rows &&
            rows.map((item) => {
            //   console.log("itemInTimeSlot--", item);
              return (
                <div>
                  <Paper className={classes.root}>
                    <Table className={classes.table}>
                      <TableHead
                        className={`timeslot-table-head ${classes.head}`}
                      >
                        <TableRow>
                          <TableCell
                            className={"header-date"}
                            colSpan={4}
                            align={"center"}
                          >
                            {item.date}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {item.timeSlots.map((item1, id) => {
                            // console.log("itemTimeSlot1--", item1);
                            let availabilityClass = "";
                            let timeSlotExpired = "";
                            if (item1.indexOf(":booked") !== -1) {
                            //   console.log(
                            //     " item1 = item1.split(--",
                            //     (item1 = item1.split(":")[0])
                            //   );
                              item1 = item1.split(":")[0];
                              availabilityClass = "booked-time-slot";
                            } else if (item1.indexOf(":initiated") !== -1) {
                              item1 = item1.split(":")[0];
                            //   console.log("itemInElse-if--", item1);
                              availabilityClass = "initiated-time-slot";
                            } else {
                              availabilityClass = "available-time-slot";
                            }

                            //let currentDate = this.state.currentDate;
                            let currentTime = parseFloat(
                              `${currentDate.getHours()}.${currentDate.getMinutes()}`
                            );
                            // console.log("currentTime-currentTime", currentTime);
                            let currentMonth = (
                              "0" +
                              (currentDate.getMonth() + 1)
                            ).slice(-2);
                            // console.log(
                            //   "currentMonth--currentMonth",
                            //   currentMonth
                            // );
                            let currentDay = (
                              "0" + currentDate.getDate()
                            ).slice(-2);
                            // console.log("currentDay--", currentDay);
                            let currentYear = currentDate.getFullYear();
                            // console.log(
                            //   "currentYear--currentYear",
                            //   currentYear
                            // );
                            let compareDate = `${currentDay}-${currentMonth}-${currentYear}`;
                            // console.log(
                            //   "compareDate--compareDate",
                            //   compareDate
                            // );
                            // console.log("item.dateitem.date--", item.date);
                            // console.log("item1BeforeIfCondition--", item1);
                            let slot = "";
                            if (item.date === compareDate) {
                              if (item1.includes("AM")) {
                                // console.log("item1--item1AM", item1);
                                let check = item1.substring(0, 2);
                                // console.log("check--", check);
                                slot = item1.substring(0, 2);
                                // console.log("slotInAMBlock-", slot);
                              } else {
                                // console.log("item1-in-item1", item1);

                                let singleTimeDigit = item1.substring(0, 1);
                                // console.log(
                                //   "singleTimeDigit-singleTimeDigit",
                                //   singleTimeDigit
                                // );
                                if (singleTimeDigit === "1") {
                                  slot = 13;
                                } else if (singleTimeDigit === "5") {
                                  slot = 17;
                                }
                              }
                              if (currentTime > parseFloat(slot)) {
                                timeSlotExpired = "expired-time-slot";
                              }
                            }
                            //item1 = item1.split(":")[0];

                            if (timeSlotExpired === "expired-time-slot") {
                              return (
                                <TableCell
                                  className={`date-timeslot ${timeSlotExpired}`}
                                  data-date={item.date}
                                  data-timeslot={item1}
                                  align={"center"}
                                >
                                  {item1}
                                </TableCell>
                              );
                            } else if (
                              availabilityClass === "booked-time-slot"
                            ) {
                              return (
                                <TableCell
                                  className={`date-timeslot ${timeSlotExpired} ${availabilityClass}`}
                                  data-date={item.date}
                                  data-timeslot={item1}
                                  align={"center"}
                                >
                                  {item1}
                                </TableCell>
                              );
                            } else if (
                              availabilityClass === "initiated-time-slot"
                            ) {
                              return (
                                <TableCell
                                  className={`date-timeslot ${timeSlotExpired} ${availabilityClass}`}
                                  data-date={item.date}
                                  data-timeslot={item1}
                                  align={"center"}
                                  onClick={this.selectTimeSlot}
                                >
                                  {item1}
                                  <input
                                    className="book-timeslot"
                                    name="time-slot"
                                    type="checkbox"
                                    checked={true}
                                    id={item.date + ":" + item1}
                                    data-date={item.date}
                                    data-timeslot={item1}
                                    onClick={this.selectTimeSlot}
                                  />
                                </TableCell>
                              );
                            }
                            else if(item1 === "Whole Day"){
                                // console.log("comeInReturnOfWholeDay")
                                return (
                                  <TableCell
                                    className={`date-timeslot ${timeSlotExpired} ${availabilityClass}`}
                                    data-date={item.date}
                                    data-timeslot={"9AM-9PM"}
                                    align={"center"}
                                    onClick={this.selectTimeSlot}
                                  >
                                    {item1}
                                    <input
                                      className="book-timeslot"
                                      name="time-slot"
                                      type="checkbox"          
                                      id={item.date + ":" + "9AM-9PM"}
                                      data-date={item.date}
                                      data-timeslot={"9AM-9PM"}
                                      onClick={this.selectTimeSlot}
                                    />
                                  </TableCell>
                                );
                              }
                            else { //when we do nothing
                              return (
                                <TableCell
                                  className={`date-timeslot ${timeSlotExpired} ${availabilityClass}`}
                                  data-date={item.date}
                                  data-timeslot={item1}
                                  align={"center"}
                                  onClick={this.selectTimeSlot}
                                >
                                  {item1}
                                  <input
                                    className="book-timeslot"
                                    name="time-slot"
                                    type="checkbox"
                                    id={item.date + ":" + item1}
                                    data-date={item.date}
                                    data-timeslot={item1}
                                    onClick={this.selectTimeSlot}
                                  />
                                </TableCell>
                              );
                            }
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Paper>
                </div>
              );
            })}

          <style>
            {`
                    .header-date{font-weight: bold;font-size:18px;}
                    .date-timeslot{border-right: 1px solid white;color:white;font-weight:bold;text-align:center;}
                    p.carousel-status, .control-dots{display:none;}
                    .available-time-slot, .initiated-time-slot{background-color:green;}
                    .booked-time-slot{background-color:red}
                    .available-time-slot:hover, .initiated-time-slot:hover {opacity: 0.5;}
                    .date-timeslot.expired-time-slot{background-color: gray;}
                    .book-timeslot{position: absolute;top: 65px;width: 21px;height: 21px;margin-left:9px !important;}
                    thead.timeslot-table-head{border: 1px solid gray;}
                    thead.timeslot-table-head tr th{text-align: center;}
                    .carousel.carousel-slider ul li.slide{border: none !important;}
                    `}
          </style>
        </Carousel>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

const mapStateToProps = (state) => {
  const availabilityCheckData = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData"
  );

  //const currentSelectedTimeSlot = `${availabilityCheckData.bkFromDate}:${availabilityCheckData.timeslots[0].slot}`;

  const reservedTimeSlotsData = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData.reservedTimeSlotsData"
  );

  let isSameDate = get(
    state,
    "screenConfiguration.preparedFinalObject.isSameDate"
  );

  let perDayBookedSlotCount = get(
    state,
    "screenConfiguration.preparedFinalObject.perDayBookedSlotCount",
    1
  );

  let timeSlotArray = [];
  let bookedSlotArray = [];
  var date = new Date();
  if (reservedTimeSlotsData && reservedTimeSlotsData.length > 0) {
    for (let i = 0; i < reservedTimeSlotsData.length; i++) {
        const [year, month, day] = reservedTimeSlotsData[i].fromDate.split(
            "-"
        );
        let date = `${day}-${month}-${year}`;
        if (
            reservedTimeSlotsData[i].timeslots &&
            reservedTimeSlotsData[i].timeslots.length > 0
        ) {
            
            for (
                let j = 0;
                j < reservedTimeSlotsData[i].timeslots.length;
                j++
            ) {
                if(reservedTimeSlotsData[i].timeslots[j].slot=== "9:00 AM - 8:59 AM"){

                    bookedSlotArray.push({
                        date: date,
                        timeSlots: ["9AM-1PM"],
                    });
                    bookedSlotArray.push({
                        date: date,
                        timeSlots: ["1PM-5PM"],
                    });
                    bookedSlotArray.push({
                        date: date,
                        timeSlots: ["5PM-9PM"],
                    });
                    
                }else{
                    bookedSlotArray.push({
                        date: date,
                        timeSlots: [reservedTimeSlotsData[i].timeslots[j].slot],
                    });
                }
               
            }
        }else if(   
            reservedTimeSlotsData[i].timeslots &&
            reservedTimeSlotsData[i].timeslots.length === 0 )
            {
               
                    bookedSlotArray.push({
                        date: date,
                        timeSlots: ["9AM-1PM"],
                    });
                    bookedSlotArray.push({
                        date: date,
                        timeSlots: ["1PM-5PM"],
                    });
                    bookedSlotArray.push({
                        date: date,
                        timeSlots: ["5PM-9PM"],
                    });
                
        }
    }
}

  //Edit Case Coverd To show Checkbox Checked
  const initiatedBookingTimeSlot = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData.timeslots",
    ""
  );

  const initiatedBookingTimeSlotTwo = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData.timeslotsTwo",
    ""
  );

  const initiatedBookingFromDate = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData.bkFromDate",
    ""
  );

  const firstToTime = get(
    state,
    "screenConfiguration.preparedFinalObject.Booking.bkToTime"
)

  //******************************** */

  for (let i = 0; i < 180; i++) {
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);
    let year = date.getFullYear();
    timeSlotArray.push({
      date: `${day}-${month}-${year}`,
      timeSlots: ["9AM-1PM", "1PM-5PM", "5PM-9PM"],
      // timeSlots: ["9AM-1PM", "1PM-5PM", "5PM-9PM", "Whole Day"],
    });
    date.setDate(date.getDate() + 1);
  }

  let finalBookedTimeSlots = [];
  for (let j = 0; j < timeSlotArray.length; j++) {
    // console.log("yoyo");
    let tempObj = {};
    tempObj.date = timeSlotArray[j].date;
    tempObj.timeSlots = timeSlotArray[j].timeSlots;

    if (bookedSlotArray && bookedSlotArray.length > 0) {
      for (let k = 0; k < bookedSlotArray.length; k++) {
        if (timeSlotArray[j].date === bookedSlotArray[k].date) {
          for (let l = 0; l < timeSlotArray[j].timeSlots.length; l++) {
            if (
              bookedSlotArray[k].timeSlots.includes(
                timeSlotArray[j].timeSlots[l]
              )
            ) {
              timeSlotArray[j].timeSlots.splice(
                l,
                1,
                `${timeSlotArray[j].timeSlots[l]}:booked`
              );
            }
          }
        } 
      }
    }
    if (initiatedBookingFromDate) {

      let initiatedBookingFromDateYmdFormat= convertDateInYMD(initiatedBookingFromDate)

      var [goYear, goMonth, goDay] = initiatedBookingFromDateYmdFormat.split(
        "-"
      );

      // initiatedBookingFromDate= convertDateInYMD(initiatedBookingFromDate)
        
            // var [goYear, goMonth, goDay] = initiatedBookingFromDate.split("-");

      let goDate = `${goDay}-${goMonth}-${goYear}`;
 
      if (timeSlotArray[j].date === goDate && initiatedBookingTimeSlot) {
        for (let l = 0; l < timeSlotArray[j].timeSlots.length; l++) {
         
          if (
            initiatedBookingTimeSlot[0].slot === timeSlotArray[j].timeSlots[l]
          ) {
         
                   
            timeSlotArray[j].timeSlots.splice(
              l,
              1,
              `${timeSlotArray[j].timeSlots[l]}:initiated`
            );
         
          }

          if(perDayBookedSlotCount !== 1 || initiatedBookingTimeSlot.length > 1 ){

            if (initiatedBookingTimeSlot[1].slot === timeSlotArray[j].timeSlots[l]) {

                timeSlotArray[j].timeSlots.splice(l, 1, `${timeSlotArray[j].timeSlots[l]}:initiated`);

                
            }
        }
      }
    }
}
finalBookedTimeSlots.push(tempObj);

};
return {
  rows: finalBookedTimeSlots,
  currentDate: new Date(),
  initiatedBookingFromDate: initiatedBookingFromDate,
  isSameDate: isSameDate,
  perDayBookedSlotCount: perDayBookedSlotCount,
  firstToTime: firstToTime, 
  initiatedBookingTimeSlot:initiatedBookingTimeSlot
};
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomTimeSlots);
