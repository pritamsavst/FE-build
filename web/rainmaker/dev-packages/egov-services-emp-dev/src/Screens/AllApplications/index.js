import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button } from "components";
import { getFileUrlFromAPI } from '../../modules/commonFunction'
import get from "lodash/get";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { SortDialog, Screen } from "modules/common";
import { fetchApplications, fetchApplicationType,clearBookingData } from "egov-ui-kit/redux/bookings/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { transformComplaintForComponent } from "egov-ui-kit/utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";
import { connect } from "react-redux";
import orderby from "lodash/orderBy";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import CountDetails from "./components/CountDetails";
import "./index.css";
import ShowField from "./showField";
import CustomComplaints from "./components/ApplicationListComponent";
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class AllRequests extends Component {
  state = {
    complaintNo: "",
    fromDate: '',
    toDate: '',
    mobileNo: "",
    bookingType: '',
    applicationStatus: '',
    complaints: [],
    search: false,
    proofOfResDocName: '',
    value: 0,
    sortPopOpen: false,
    errorText: "",
    currency: '',
    open: false, setOpen: false, applicationList: [],appStatusArray:[],
  };
  style = {
    iconStyle: {
      height: "30px",
      width: "30px"
    }
  };
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
  };
  // const compainsData=[];
  componentDidMount = async () => {

    let {
      role,
      userInfo, fetchApplicationType,
    } = this.props;

    fetchApplicationType();
    let rawRole =
      userInfo && userInfo.roles && userInfo.roles[0].code.toUpperCase();
    let { fetchApplications } = this.props;
    fetchApplications(
      {
        "uuid": userInfo.uuid, "applicationNumber": "",
        "applicationStatus": "",
        "mobileNumber": "", "bookingType": "",
        "tenantId": userInfo.tenantId
      },
      true,
      true
    );
  };

  componentWillReceiveProps = nextProps => {
    const { role, renderCustomTitle } = this.props;
    if (
      !isEqual(
        this.props.transformedComplaints,
        nextProps.transformedComplaints
      )
    ) {
      const numberOfComplaints =
        role === "employee"
          ? 0
          : role === "csr"
            ? nextProps.numCSRComplaint
            : 0;
      renderCustomTitle(numberOfComplaints);
    }
  };

  closeSortDialog = () => {
    this.setState({
      sortPopOpen: false
    });
  };

  onSortClick = () => {
    this.setState({ 
      sortPopOpen: true
    });
  }; 
  gotoPArkAndCommunityTanker = () => {
    let {PreviousBookingData ,oldBookingData,prepareFinalObject,clearAvailable,discountOldDoc,UploadedDocType,previousResidenceProof,state} = this.props
    let ApplicationData = this.props.bookings;
    let CheckData = this.props.bookings ? (this.props.bookings.applicationData ?(this.props.bookings.applicationData.bookingsModelList.length > 0 ? (this.props.bookings.applicationData.bookingsModelList): 'NA'): 'NA'): "NA"

let clearVenueData = get(
  state,"screenConfiguration.preparedFinalObject.bkBookingData",
  "NotFound"
);

if(clearVenueData !== "NotFound"){
  delete state.screenConfiguration.preparedFinalObject.bkBookingData
}

let applicationData = get(
  state,
  "bookings.applicationData",
  "NotFound"
);


let findDocument;
findDocument = state.bookings.hasOwnProperty('applicationData')


if(applicationData !== "NotFound" || findDocument == true){

  this.props.clearBookingData(null,true,true)
  delete state.bookings.applicationData
}

let lastBookingData = get(
  state,
  "screenConfiguration.preparedFinalObject.PreviousBookingData",
  "NotFound"
);


let documentMap = get(
  state,
  "screenConfiguration.preparedFinalObject.documentMap",
  "NotFound"
);



let lastCreatedPaccAppData = get(
  state,
  "screenConfiguration.preparedFinalObject.CreatePaccAppData",
  "NotFound"
);

let checkDateVenueChange = get(
  state,
  "screenConfiguration.preparedFinalObject.EmployeeDateVenueChange",
  "NotFound"
);
if(checkDateVenueChange !== "NotFound"){
  prepareFinalObject("EmployeeDateVenueChange","NotFound")
}

let lastCreateAppData = get(
  state,
  "screenConfiguration.preparedFinalObject.createAppData",
  "NotFound"
);

if(documentMap !== "NotFound"){

  delete state.screenConfiguration.preparedFinalObject.documentMap
}

if(lastBookingData !== "NotFound"){
 
  delete state.screenConfiguration.preparedFinalObject.PreviousBookingData
}

if(lastCreatedPaccAppData !== "NotFound"){
 
  delete state.screenConfiguration.preparedFinalObject.CreatePaccAppData
}

if(lastCreateAppData !== "NotFound"){
  
  delete state.screenConfiguration.preparedFinalObject.createAppData
}

    if(PreviousBookingData !== "NotFound"){
      prepareFinalObject("PreviousBookingData",null)
    }
    if(discountOldDoc !== "NotFound"){
      prepareFinalObject("discountDocumentsUploadRedux",{})
    }
    if(previousResidenceProof !== "NotFound"){
      prepareFinalObject("documentsUploadRedux",{})
    }
    if(UploadedDocType !== "NotFound"){
      prepareFinalObject("UploadedDocType",null)
    }     
    
    //screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
    if(oldBookingData !== "NotFound"){
      prepareFinalObject("oldAvailabilityCheckData",null)
    }
    if(clearAvailable !== "NotFound"){
      prepareFinalObject("availabilityCheckData",null)
    }
    if(CheckData !== 'NA'){
    this.props.clearBookingData(null,true,true)
      }
    this.props.history.push(`/egov-services/checkavailability_pcc`);
  };
  gotoMcc = () => {
    this.props.history.push(`/egov-services/all-MccApplications`);
  };

 
getApplicationStatus = (applicationNumber) => { 
  let applicationsArray = this.props.csrComplaints
  
  let application = applicationsArray.filter((applicationDetail) => {
    return applicationDetail.bkApplicationNumber == applicationNumber
  })
  return application[0].bkApplicationStatus == "OFFLINE_INITIATED"
}

  onComplaintClick = async(complaintNo, bookingType) => {
   let {userInfo} = this.props
    if (bookingType && bookingType == "WATER_TANKERS") {
      this.props.history.push(`/egov-services/bwt-application-details/${complaintNo}`);
    }
    if (bookingType && bookingType == "OSBM" || bookingType == "Open Space to Store Building Material") {
      this.props.history.push(`/egov-services/application-details/${complaintNo}`);
    }
    if (bookingType && bookingType == "GROUND_FOR_COMMERCIAL_PURPOSE") {

      this.props.history.push(`/egov-services/cg-application-details/${complaintNo}`);
    }
    if (bookingType && bookingType == "OSUJM") {

      this.props.history.push(`/egov-services/osmcc-application-details/${complaintNo}`);
    }
    if (bookingType && bookingType == "JURISDICTION") {

      this.props.history.push(`/egov-services/osmcc-application-details/${complaintNo}`);
    }

    if (bookingType && (bookingType == "Parks" || bookingType == "Community Center")) {
    if(this.getApplicationStatus(complaintNo)){ 
    

   this.props.fetchApplications(
			{
				"applicationNumber": complaintNo, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "",
        "tenantId":userInfo.tenantId
			}
		);


    let RequestBodyForInitiateApplication =
		{
			"applicationNumber": complaintNo, 'uuid': userInfo.uuid,
			"applicationStatus": "",
			"mobileNumber": "", "bookingType": "", "tenantId": userInfo.tenantId
		}
    

    let dataforSectorAndCategory = await httpRequest(
			"bookings/api/employee/_search",
			"_search", [],
			RequestBodyForInitiateApplication
		);


let bkLocation = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkLocation : 'NA'
		let bkFromDate = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkFromDate : 'NA'
		let bkToDate = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkToDate : 'NA'
		let AppStatus = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkApplicationStatus : 'NA'
		let bkBookingType = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkBookingType : 'NA'
		let Sector = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkSector : 'NA'
		let bkBookingVenue = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkBookingVenue : 'NA'
		let AppNo = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkApplicationNumber : 'NA'	
		let bookingRent = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.bookingsModelList[0].bkRent : 'NA'

    let allDocumentList = dataforSectorAndCategory && dataforSectorAndCategory.bookingsModelList ? dataforSectorAndCategory.documentList : [];

    let proofOfResDocs
		if(allDocumentList && allDocumentList.length > 0){
			 proofOfResDocs = allDocumentList.filter( (item) => {
				return item.documentType != "BK_PCC_DISCOUNT_DOCUMENT";
			})
			this.setState({proofOfResDocName: proofOfResDocs[0].fileName,
				proofOfResDocumentType: proofOfResDocs[0].documentType,
				allDocumentList: allDocumentList
			})
		}
	  if (dataforSectorAndCategory.bookingsModelList[0].timeslots.length > 0) {
      let arr2 = [];
      for(let i = 0; i < dataforSectorAndCategory.bookingsModelList[0].timeslots.length; i++){
        arr2.push(dataforSectorAndCategory.bookingsModelList[0].timeslots[i].slot)
      }
      

      if(arr2.length == 1){
      
      let timeSlot =
        dataforSectorAndCategory.bookingsModelList[0].timeslots[0].slot;
      prepareFinalObject("oldAvailabilityCheckData.TimeSlot", timeSlot);

      let res = timeSlot.split("-");
  
      let fromTime = res[0];
      

      prepareFinalObject("oldAvailabilityCheckData.TimeSlotfromTime", fromTime);

      let ToTime = res[1];
      

      prepareFinalObject("oldAvailabilityCheckData.TimeSlotToTime", ToTime);

      let strMid = ",";

      let ConcatFromDateTime = bkFromDate.concat(strMid).concat(fromTime);
      

      prepareFinalObject(
        "oldAvailabilityCheckData.ConcatFromDateTime",
        ConcatFromDateTime
      );

      let ConcatToDateTime = bkToDate.concat(strMid).concat(ToTime);
      

      prepareFinalObject(
        "oldAvailabilityCheckData.ConcatToDateTime",
        ConcatToDateTime
      );

      //let bkDisplayFromDateTime =

      let timeSlotId =
        dataforSectorAndCategory.bookingsModelList[0].timeslots[0].id;
     

      prepareFinalObject("oldAvailabilityCheckData.timeSlotId", timeSlotId);
      }
       else{
        let a = arr2[0]
        let b = arr2[1]
        
        
        let fromfirst = a.split("-")
        
       let fromsecond = b.split("-")
      
      
      let first = fromfirst[0]
      let second = fromsecond[1]
      
      

      let comfirstsecond = first + "-" + second
      

      let timeSlot = comfirstsecond
      prepareFinalObject("oldAvailabilityCheckData.TimeSlot", timeSlot);


      let res = timeSlot.split("-");
      

      let fromTime = res[0];
      

      prepareFinalObject("oldAvailabilityCheckData.TimeSlotfromTime", fromTime);

      let ToTime = res[1];
      

      prepareFinalObject("oldAvailabilityCheckData.TimeSlotToTime", ToTime);

      let strMid = ",";

      let ConcatFromDateTime = bkFromDate.concat(strMid).concat(fromTime);
      

      prepareFinalObject(
        "oldAvailabilityCheckData.ConcatFromDateTime",
        ConcatFromDateTime
      );

      let ConcatToDateTime = bkToDate.concat(strMid).concat(ToTime);
      

      prepareFinalObject(
        "oldAvailabilityCheckData.ConcatToDateTime",
        ConcatToDateTime
      );

      //let bkDisplayFromDateTime =

      let timeSlotId =
        dataforSectorAndCategory.bookingsModelList[0].timeslots[0].id;
      

      prepareFinalObject("oldAvailabilityCheckData.timeSlotId", timeSlotId);

      let timeSlotIdTwo =
      dataforSectorAndCategory.bookingsModelList[0].timeslots[1].id;
    

    prepareFinalObject("oldAvailabilityCheckData.timeSlotIdTwo", timeSlotIdTwo);  
       }
    }

    allDocumentList.map(async (doc) => {
			
			// doc.docmentType
			// doc.fileName
			// doc.fileStoreId
			let fileLink = await getFileUrlFromAPI(doc.fileStoreId, "ch");
			
			if (doc.documentType === "BK_PCC_DISCOUNT_DOCUMENT") {
			  
			  let dicscountDoc = [
				{
				  documentCode: doc.documentType,
				  documentType: "DOC",
				  documents: [
					{
					  fileName: doc.fileName,
					  fileStoreId: doc.fileStoreId,
					  fileUrl: fileLink[doc.fileStoreId],
					  mendatoryDoc: true,
					},
				  ],
				  isDocumentRequired: true,
				  isDocumentTypeRequired: true,
				  mydocstate: true,
				},
			  ];
			 this.props.prepareFinalObject("discountDocumentsUploadRedux", dicscountDoc);
			  return;
			} else {
			  
			  let Doc = [
				{
				  documentCode: doc.documentType,
				  documentType: "DOC",
				  documents: [
					{
					  fileName: doc.fileName,
					  fileStoreId: doc.fileStoreId,
					  fileUrl: fileLink[doc.fileStoreId],
					  mendatoryDoc: true,
					},
				  ],
				  isDocumentRequired: true,
				  isDocumentTypeRequired: true,
				  mydocstate: true,
				},
			  ];
			 this.props.prepareFinalObject("documentsUploadRedux", Doc);
			  return;
			}
		  });

    this.props.prepareFinalObject("oldAvailabilityCheckData.BookingRent", bookingRent);

		this.props.prepareFinalObject("oldAvailabilityCheckData.bkBookingType", bkBookingType);

		this.props.prepareFinalObject("oldAvailabilityCheckData.Sector", Sector);

		this.props.prepareFinalObject("oldAvailabilityCheckData.bkBookingVenue", bkLocation);

		this.props.prepareFinalObject("oldAvailabilityCheckData.FromDate", bkFromDate);

		this.props.prepareFinalObject("oldAvailabilityCheckData.bkFromDate", bkFromDate);

		this.props.prepareFinalObject("oldAvailabilityCheckData.bkToDate", bkToDate);

		this.props.prepareFinalObject("oldAvailabilityCheckData.bkBookingVenueID", bkBookingVenue);

		this.props.prepareFinalObject("PreviousBookingData.ToDate", bkToDate);

		this.props.prepareFinalObject("PreviousBookingData.FromDate", bkFromDate);

		this.props.prepareFinalObject("PreviousBookingData.bkBookingVenue", bkLocation);

		this.props.prepareFinalObject("PreviousBookingData.ApplicationStatus", AppStatus);
    // this.props.prepareFinalObject("oldAvailabilityCheckData.bkBookingType", bkBookingType);

this.props.history.push(`/egov-services/checkavailability_pcc`)
}
else{
  this.props.history.push(`/egov-services/park-and-community-center-appDetails-details/${complaintNo}`);
}  
    }

    // if (bookingType && bookingType == "Community Center") {

    //   this.props.history.push(`/egov-services/park-and-community-center-appDetails-details/${complaintNo}`);
    // }
  };

  onComplaintChange = e => {
    const complaintNo = e.target.value;
    this.setState({ complaintNo });
    if (complaintNo.length < 6) {
      this.setState({
        errorText: "BK_ERR_APPLICATION_NUMBER_SEARCH"
      });
    } else {
      this.setState({ errorText: "" });
    }
  };


  onFromDateChange = e => {
    const fromDate = e.target.value;
    this.setState({
      fromDate
    })
  }

  onToDateChange = e => {
    const toDate = e.target.value;
    this.setState({
      toDate: toDate
    })
  }


  onMobileChange = e => {
    const inputValue = e.target.value;
    this.setState({ mobileNo: inputValue });
  };

  onbookingChange = e => {
    let {applicationType}=this.props;
    let appStats;
    const inputValue = e.target.value;
    this.setState({ bookingType: inputValue });
      applicationType&&applicationType.Status.forEach((item)=>{
    if(e.target.value==item.code){
        appStats=item.status}
      })
    
      this.setState({ appStatusArray: appStats });

  };
  onApplicationStatusChange = e => {
    const inputValue = e.target.value;
    this.setState({ applicationStatus: inputValue });
  };

  onSearch = () => {
   
    const { complaintNo, mobileNo, bookingType, applicationStatus, fromDate, toDate } = this.state;
    const { fetchApplications, searchForm, userInfo, toggleSnackbarAndSetText } = this.props;
    let queryObj = {};
    queryObj.uuid = userInfo.uuid;

    if (complaintNo) {
      queryObj.applicationNumber = complaintNo;
      queryObj.applicationStatus =applicationStatus?applicationStatus:"";
      queryObj.mobileNumber =  mobileNo?mobileNo:"";
      queryObj.bookingType =  bookingType?bookingType:"";
      queryObj.tenantId = userInfo.tenantId;

    }

    if (applicationStatus) {
      queryObj.applicationStatus = applicationStatus
      queryObj.applicationNumber =  applicationStatus?applicationStatus:"";
      queryObj.mobileNumber = mobileNo?mobileNo:"";
      queryObj.bookingType = bookingType?bookingType:"";
      queryObj.tenantId = userInfo.tenantId;

    }

    if (mobileNo) {
      queryObj.mobileNumber = mobileNo;
      queryObj.applicationNumber = complaintNo?complaintNo:"";
      queryObj.applicationStatus = applicationStatus?applicationStatus:"";
      queryObj.bookingType = bookingType?bookingType:"";
      queryObj.tenantId = userInfo.tenantId;

    }
    if (bookingType) {
      queryObj.bookingType = bookingType;
      queryObj.mobileNumber =  mobileNo?mobileNo:"";
      queryObj.applicationNumber = complaintNo?complaintNo:"";
      queryObj.applicationStatus =applicationStatus?applicationStatus:"";
      queryObj.tenantId = userInfo.tenantId;
    }

    if (bookingType&&applicationStatus) {
      queryObj.bookingType = bookingType;
      queryObj.mobileNumber = mobileNo?mobileNo:"";
      queryObj.applicationNumber = complaintNo?complaintNo:"";
      queryObj.applicationStatus =applicationStatus;
      queryObj.tenantId = userInfo.tenantId;
    }

    if (fromDate) {
    queryObj.bookingType = bookingType?bookingType:"";
     queryObj.mobileNumber = mobileNo?mobileNo:"";
      queryObj.applicationNumber = complaintNo?complaintNo:"";
      queryObj.applicationStatus = applicationStatus?applicationStatus:"";
      queryObj.fromDate = fromDate;
      queryObj.tenantId = userInfo.tenantId;


    }
    if (toDate) {
      queryObj.bookingType = bookingType?bookingType:"";
      queryObj.mobileNumber = mobileNo?mobileNo:"";
      queryObj.applicationNumber = complaintNo?complaintNo:"";
      queryObj.applicationStatus = applicationStatus?applicationStatus:"";
      queryObj.toDate = toDate;
      queryObj.tenantId = userInfo.tenantId;


    }



    // bookingType
    if (searchForm && searchForm.fromDate) {
      queryObj.fromDate = searchForm.fromDate;
      queryObj.mobileNumber = "";
      queryObj.applicationNumber = "";
      queryObj.applicationStatus = "";
      queryObj.bookingType = "";
      queryObj.tenantId = userInfo.tenantId;

    }

    if (searchForm && searchForm.toDate) {
      queryObj.toDate = searchForm.toDate;
      queryObj.mobileNumber = "";
      queryObj.applicationNumber = "";
      queryObj.applicationStatus = "";
      queryObj.bookingType = "";
      queryObj.tenantId = userInfo.tenantId;

    }

    // if (complaintNo || mobileNo) {
    //   fetchApplications(queryObj, true, true);
    // }

    if (complaintNo) {
     
      if (complaintNo.length >= 23) {
        fetchApplications(queryObj, true, true);
      } else {
        toggleSnackbarAndSetText(
          true,
          {
            labelName: "Entered value is less than 6 characters in length.",
            labelKey: `BK_ERR_VALUE_LESS_THAN_SIX_CHARACTERS`
          },
          "error"
        );
      }
    } else if (bookingType) {
      fetchApplications(queryObj, true, true);
    }
    else if (applicationStatus) {
      fetchApplications(queryObj, true, true);
    }
    else if (mobileNo) {
      fetchApplications(queryObj, true, true);
    } else if (searchForm && searchForm.fromDate) {
      fetchApplications(queryObj, true, true);
    } else if (searchForm && searchForm.toDate) {
      fetchApplications(queryObj, true, true);
    }

    else if (fromDate, toDate) {
      if (fromDate > this.state.toDate) {
        toggleSnackbarAndSetText(
          true,
          {
            labelName: "From_Date_Is_Greater_Than_To_Date",
            labelKey: `From_Date_Is_Greater_Than_To_Date`
          },
          "warning"
        );
      }
      else {
        fetchApplications(queryObj, true, true);
      }
    } else if (toDate) {
      fetchApplications(queryObj, true, true);
    }
    this.setState({ search: true });
  };


  handleChange = (e, property, isRequired, pattern) => {
    const { metaData, setMetaData, handleChange, searchForm } = this.props;
    const selectedValue = e.target.value;
    //const selectedValue = e.target.value;

    if (property === "fromDate" || property === "toDate") {
      // this.handleDateSelect(metaData, e, property);
      // this.checkDate(selectedValue, property, isRequired, pattern);
    } else {
      handleChange(e, property, isRequired, pattern);
    }

    if (metaData.hasOwnProperty("reportDetails") && metaData.reportDetails.searchParams.length > 0) {
      if (!selectedValue) {
        for (var l = 0; l < metaData.reportDetails.searchParams.length; l++) {
          if (metaData.reportDetails.searchParams[l].type == "url" && metaData.reportDetails.searchParams[l].pattern.search(property) > -1) {
            metaData.reportDetails.searchParams[l].defaultValue = {};
          }
        }

        setMetaData(metaData);
      } else {
        for (var i = 0; i < metaData.reportDetails.searchParams.length; i++) {
          const field = metaData.reportDetails.searchParams[i];
          const defaultValue = field.defaultValue;
          const fieldType = field.type;
          const dependantProperty = field.name;

          if (dependantProperty === property) {
            continue;
          }

          if (typeof defaultValue != "object" || field.hasOwnProperty("pattern")) {
            if (!field.hasOwnProperty("pattern")) {
              field["pattern"] = defaultValue;
            }

            const fieldPattern = field.pattern;

            if (fieldPattern.indexOf("{" + property + "}") == -1) continue;

            if (fieldPattern && fieldPattern.search("{" + property + "}") > -1) {
              this.checkForDependentSource(i, field, selectedValue);
            }
          }
        }
      }
    }
  };

  checkDate = (value, name, required, pattern) => {
    let e = {
      target: {
        value: value,
      },
    };

    if (name == "fromDate") {
      let startDate = value;
      if (this.props.searchForm) {
        try {
          let endDate = this.props.searchForm.toDate;
          this.props.handleChange(e, name, required, pattern);
          // this.validateDate(startDate, endDate, required, "fromDate"); //3rd param to denote whether field fails
        } catch (e) {
          console.log(e);
        }
      } else {
        this.props.handleChange(e, name, required, pattern);
      }
    } else {
      let endDate = value;
      if (this.props.searchForm) {
        try {
          let startDate = this.props.searchForm.fromDate;
          this.props.handleChange(e, name, required, pattern);
          // this.validateDate(startDate, endDate, required, "toDate"); //3rd param to denote whether field fails
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  validateDate = (startDate, endDate, required, field) => {
    if (startDate && endDate) {
      let sD = new Date(startDate);
      sD.setHours(0, 0, 0, 0);
      let eD = new Date(endDate);
      eD.setHours(0, 0, 0, 0);
      if (eD >= sD) {
        this.setState({ datefield: "" });
        this.setState({ dateError: "" });
      } else {
        let e = {
          target: {
            value: "",
          },
        };
        this.props.handleChange(e, field, required, "");
        this.setState({ datefield: field });
        this.setState({
          dateError:
            field === "toDate" ? (
              <Label labelStyle={{ color: "rgb(244, 67, 54)" }} label="REPORT_SEARCHFORM_DATE_GREATER" />
            ) : (
                <Label labelStyle={{ color: "rgb(244, 67, 54)" }} label="REPORT_SEARCHFORM_DATE_LESSER" />
              ),
        });
      }
    }
  };

  clearSearch = () => {
    const { metaData, resetForm, searchForm, setSearchParams, userInfo } = this.props;
    if (!searchForm) {
      return;
    } else {
      if (get(metaData, "reportDetails.searchParams")) {
        let searchParams = metaData.reportDetails.searchParams;
        var i;
        let fromDateIndex, toDateIndex;
        for (i = 0; i < searchParams.length; i++) {
          if (searchParams[i].name === "fromDate") {
            fromDateIndex = i;
          } else if (searchParams[i].name === "toDate") {
            toDateIndex = i;
          }
        }
        if (fromDateIndex !== undefined) searchParams[fromDateIndex].maxValue = new Date();
        if (toDateIndex !== undefined) {
          searchParams[toDateIndex].minValue = undefined;
          searchParams[toDateIndex].maxValue = undefined;
        }
        setSearchParams(searchParams);
      }
      this.setState({ getResults: false, dateError: "" }, () => {
        resetForm();

      });
    }
    const { fetchApplications } = this.props;
    fetchApplications(
      {
        "uuid": userInfo.uuid, "applicationNumber": "",
        "applicationStatus": "",
        "mobileNumber": "", "bookingType": "",
        "tenantId": userInfo.tenantId
      },
    );
    this.setState({ mobileNo: "", complaintNo: "", bookingType: "", applicationStatus: "", fromDate: "", toDate: "", search: false });
  };

  onChange = value => {
    this.setState({ value });
  };

  handleSelectChange = (event) => {
    this.setState({
      currency: event.target.value
    })
  };

  gotoWaterTanker = (e) => {

    this.props.history.push(`/egov-services/applywatertanker`);
  }

  render() {
    const dropbordernone = {
      border: "none",
      boxShadow: "none",
      borderBottom: "solid 1px #cccccc",
      position: "relative",
      top: "30px"

    };

    const { loading, histor, userInfo, applicationType,roles } = this.props;
    
    let oneRole = roles[0]
    let RoleOneCode = oneRole.code
    let twoRole = roles[1]
    let RoleTwoCode = twoRole.code
    if(RoleOneCode == "BK_MCC_APPROVER" && RoleTwoCode == "BK_OSBM_APPROVER"){
      console.log("yes roles Found")
    }else{
      "wrong Condition"
    }
      const {
      mobileNo,
      bookingType,
      complaintNo,
      applicationStatus,
      search,
      sortPopOpen,
      errorText,
      fromDate,
      toDate,appStatusArray
    } = this.state;
    const tabStyle = {
      letterSpacing: "0.6px"
    };


    const { onComplaintClick, onSortClick, closeSortDialog, style } = this;
    const {
      assignedComplaints,
      unassignedComplaints,
      csrComplaints,
      employeeComplaints,
      role,
      searchFilterEmployeeComplaints,
      assignedTotalComplaints,
      unassignedTotalComplaints,
      employeeTotalComplaints
    } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    const a = [{ displayName: "open space" }, { displayName: 'water tanker' }];

    const downloadMenu = a.map((obj, index) => {

      return {
        labelName: obj.displayName,
        labelKey: `ACTION_TEST_${obj.displayName.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,
      }
    })


    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "INBOX_QUICK_ACTION" },
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" } },
      menu: downloadMenu
    }
    const foundWaterTanker = userInfo && userInfo.roles.some(el => el.code === 'BK_MCC_HELPDESK_USER');
    const foundFirstLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_MCC_APPROVER');
    const foundSecondLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_OSD_APPROVER');
    const foundthirdLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_ADMIN_APPROVER');
    const foundfourthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_E-SAMPARK-CENTER');
    const foundfifthLavel = userInfo && userInfo.roles.some(el => el.code === 'BK_MCC_USER');

    return role === "employee" ? ( <Screen loading={loading}>
         <style>
      {`
  @media screen and (min-width: 320px) and (max-width: 568px) {
    .btn-sampark{margin-top:20px !important; margin-right:0 !important}
    }
  `}
  </style>
         {/* {foundWaterTanker ?   // Apply for water tanker hide for temporary
          <Button
            className="responsive-action-button"
            label={<Label buttonLabel={true} label="BK_MYBK_WATER_TANKER_APPLY" />}
            fullWidth={true}
            primary={true}
            style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
            onClick={() => this.gotoWaterTanker()
            } /> : ''
        }  */}
        {foundFirstLavel || foundSecondLavel || foundthirdLavel ?
          <Button
          className="responsive-action-button btn-sampark"
          label={<Label buttonLabel={true} label="BK_NEW_LOCATION_LIST" />}
            style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
            backgroundColor="#fe7a51"
            // labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fff" }}
            // buttonStyle={{ border: 0 }}
            fullWidth={true}
            primary={true}
            onClick={() => this.gotoMcc()}
          /> : ''
        }
      {foundfourthLavel ? //foundfourthLavel || foundfifthLavel ? 
      <Button
            className="responsive-action-button btn-sampark"
            label={<Label buttonLabel={true} label="Apply E-Sampark" />}
            fullWidth={true}
            primary={true}
            style={{ float: 'right', marginRight: '50px', marginTop: '40px' }}
            onClick={() => this.gotoPArkAndCommunityTanker()
            } /> : '' }
        <div className="form-without-button-cont-generic">
          {/* <Grid container spacing={8}>{this.handleFormFields()}</Grid> */}
          <Card
            id="complaint-search-card"
            className="complaint-search-main-card"
            textChildren={
              <div className="complaint-search-cont clearfix">
                  {RoleOneCode === 'BK_MCC_APPROVER' && RoleTwoCode === 'BK_OSBM_APPROVER' ? 
                    <div className="col-xs-12" style={{ paddingLeft: 8, marginTop: "-4%" }}>
                    <Label
                      label="BK_MYBK_SEARCH_APPLICATIONS"
                      fontSize={16}
                      dark={true}
                      bold={true}
                    />
                  </div>
                  :<div className="col-xs-12" style={{ paddingLeft: 8, marginTop: "1%" }}>
                  <Label
                    label="BK_MYBK_SEARCH_APPLICATIONS"
                    fontSize={16}
                    dark={true}
                    bold={true}
                  />
                  </div>
                }
                <div
                  className="col-sm-4 col-xs-12"
                  style={{ paddingLeft: 8 }}
                >
                  <TextField
                    id="mobile-no"
                    name="mobile-no"
                    type="number"
                    value={mobileNo}
                    hintText={
                      <Label
                        label="BK_MYBK_MOBILE_NUMBER_PLACEHOLDER"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    floatingLabelText={
                      <Label
                        key={0}
                        label="BK_MYBK_CREATE_APPLICATION_MOBILE_NUMBER"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onMobileChange(e)}
                    underlineStyle={{ bottom: 7 }}
                    underlineFocusStyle={{ bottom: 7 }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-4 col-xs-12" style={{ paddingLeft: 12 }}>
                  <TextField
                    id="complaint-no"
                    name="complaint-no"
                    value={complaintNo}
                    hintText={
                      <Label
                        label="BK_MYBK_APPLICATION_NO"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    // errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="BK_MYBK_APPLICATION_NO_PLACEHOLDER"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onComplaintChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-4 col-xs-12" style={{ minHeight: '72px', marginTop: '10px' }}>
                <FormControl style={{ width: '100%' }}>
                    <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Booking Type</InputLabel>
                    <Select
                      maxWidth={false}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={this.state.SetOpen}
                      displayEmpty
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                      value={bookingType}
                      onChange={(e, value) => this.onbookingChange(e)}
                    >
                      <MenuItem value=""disabled>Booking Type</MenuItem>
                      {applicationType && applicationType.Status.map((item, index) => (
                        <MenuItem value={item.code}>{item.name}</MenuItem>
                      ))}
                      {/* <MenuItem value="" disabled>Booking Type</MenuItem>
                      <MenuItem value='OSBM'>Open Space To Store Building Material</MenuItem>
                      <MenuItem value='WATER_TANKERS'>Water Tankers</MenuItem>
                      <MenuItem value='GROUND_FOR_COMMERCIAL_PURPOSE'>Commercial Ground</MenuItem>
                      <MenuItem value='OSUJM'>Open Space WithIn MCC</MenuItem> */}
                    </Select>
                  </FormControl>
               
                
                </div>
                <div className="col-sm-4 col-xs-12" style={{ minHeight: '72px', paddingTop: "18px", paddingLeft: "8px" }}>
                <FormControl style={{ width: '100%' }}>
                    <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label">Application Status</InputLabel>
                    <Select
                      maxWidth={false}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={this.state.SetOpen}
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                      value={this.state.applicationStatus}
                      displayEmpty
                      onChange={(e, value) => this.onApplicationStatusChange(e)}
                    > 
                    <MenuItem value="" disabled>Application Status</MenuItem>
                    {appStatusArray && appStatusArray.map((item, index) => (
                        <MenuItem value={item.code}>{item.name}</MenuItem>
                      ))}
                      {/* <MenuItem value="" disabled>Application Status</MenuItem>
                      <MenuItem value='PENDINGAPPROVAL'>Pending Approval</MenuItem>
                      <MenuItem value='PENDINGPAYMENT'>Pending Payment</MenuItem>
                      <MenuItem value='PENDINGUPDATE'>Pending Update</MenuItem>
                      <MenuItem value='PENDINGASSIGNMENTDRIVER'>Pending Assignment Driver</MenuItem> */}
                    </Select>
                  </FormControl>                           
               
                </div>
    
    
    
                <div className="col-sm-4 col-xs-12" style={{ minHeight: '72px', paddingTop: "10px" }}>
                  <TextField
                    id="from-Date"
                    name="from-Date"
                    value={fromDate}
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    // errorText={<Labe label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="From Date"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onFromDateChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    hintStyle={{ width: "100%" }}

                    type="date"
                    defaultValue="2017-05-24"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="col-sm-4 col-xs-12" style={{ minHeight: '72px', paddingTop: "10px" }}>
                  <TextField
                    id="to-date"
                    name="to-date"
                    value={toDate}
                    hintText={
                      <Label
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    // errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="To Date"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onToDateChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0"
                    }}
                    hintStyle={{ width: "100%" }}

                    type="date"
                    defaultValue="2017-05-24"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div
                  className="col-sm-12 col-xs-12"
                  style={{ marginTop: 10, paddingRight: 8, marginLeft: "16%" }}
                >
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        label="BK_MYBK_APPLICATIONS_SEARCH_BUTTON"
                      />
                    }
                    style={{ marginRight: 28, width: "30%" }}
                    backgroundColor="#fe7a51"
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fff"
                    }}
                    buttonStyle={{ border: 0 }}
                    onClick={() => this.onSearch()}
                  />
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        color="#fe7a51"
                        label="BK_MYBK_APPLICATION_CLEAR_SEARCH_BUTTON"
                      />
                    }
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fe7a51"
                    }}
                    buttonStyle={{ border: "1px solid #fe7a51" }}
                    style={{ width: "30%" }}
                    onClick={() => this.clearSearch()}
                  />

                </div>
              </div>
            }
          />
        </div>
        <div className="form-without-button-cont-generic">
          <CustomComplaints
            noComplaintMessage={
              search
                ? "No Search Results Found"
                : "BK_MYBK_NO_APPLICATION_ASSIGNED"
            }
            onComplaintClick={onComplaintClick}
            complaints={csrComplaints}
            role={role}
            complaintLocation={true}
          />
        </div>
      </Screen>
    ) : (
          <Screen loading={loading}>
            <div className="form-without-button-cont-generic">
              <Card
                id="complaint-search-card"
                className="complaint-search-main-card"
                textChildren={
                  <div className="complaint-search-cont clearfix">
                    <div className="col-xs-12" style={{ paddingLeft: 8 }}>
                      <Label
                        label="CORE_COMMON_SEARCH_COMPLAINT123"
                        fontSize={16}
                        dark={true}
                        bold={true}
                      />
                    </div>
                    <div
                      className="col-sm-3 col-xs-12"
                      style={{ paddingLeft: 8, paddingRight: 40 }}
                    >
                      <TextField
                        id="mobile-no"
                        name="mobile-no"
                        type="number"
                        value={mobileNo}
                        hintText={
                          <Label
                            label="BK_CORE_COMMON_MOBILE_NUMBER_PLACEHOLDER345"
                            color="rgba(0, 0, 0, 0.3799999952316284)"
                            fontSize={16}
                            labelStyle={hintTextStyle}
                          />
                        }
                        floatingLabelText={
                          <Label
                            key={0}
                            label="ES_CREATECOMPLAINT_MOBILE_NUMBER678"
                            color="rgba(0,0,0,0.60)"
                            fontSize="12px"
                          />
                        }
                        onChange={(e, value) => this.onMobileChange(e)}
                        underlineStyle={{ bottom: 7 }}
                        underlineFocusStyle={{ bottom: 7 }}
                        hintStyle={{ width: "100%" }}
                      />
                    </div>
                    <div className="col-sm-4 col-xs-12" style={{ paddingLeft: 8 }}>
                      <TextField
                        id="complaint-no"
                        name="complaint-no"
                        value={complaintNo}
                        hintText={
                          <Label
                            label="ES_MYCOMPLAINTS_COMPLAINT_NO01"
                            color="rgba(0, 0, 0, 0.3799999952316284)"
                            fontSize={16}
                            labelStyle={hintTextStyle}
                          />
                        }
                        errorText={<Label label={errorText} color="red" />}
                        floatingLabelText={
                          <Label
                            key={1}
                            label="CS_COMPLAINT_SUBMITTED_COMPLAINT_NO02"
                            color="rgba(0,0,0,0.60)"
                            fontSize="12px"
                          />
                        }
                        onChange={(e, value) => this.onComplaintChange(e)}
                        underlineStyle={{
                          bottom: 7,
                          borderBottom: "1px solid #e0e0e0"
                        }}
                        underlineFocusStyle={{
                          bottom: 7,
                          borderBottom: "1px solid #e0e0e0"
                        }}
                        hintStyle={{ width: "100%" }}
                      />
                    </div>
                    <div
                      className="col-sm-6 col-xs-12 csr-action-buttons"
                      style={{ marginTop: 10, paddingRight: 8 }}
                    >

                      <Button
                        label={
                          <Label
                            buttonLabel={true}
                            color="#fe7a51"
                            label="ES_MYCOMPLAINTS_CLEAR_SEARCH_BUTTON"
                          />
                        }
                        labelStyle={{
                          letterSpacing: 0.7,
                          padding: 0,
                          color: "#fe7a51"
                        }}
                        buttonStyle={{ border: "1px solid #fe7a51" }}
                        style={{ width: "36%" }}
                        onClick={() => this.clearSearch()}
                      />
                      <Button
                        label={
                          <Label
                            buttonLabel={true}
                            label="ES_MYCOMPLAINTS_SEARCH_BUTTON"
                          />
                        }
                        style={{ marginRight: 28, width: "36%" }}
                        backgroundColor="#fe7a51"
                        labelStyle={{
                          letterSpacing: 0.7,
                          padding: 0,
                          color: "#fff"
                        }}
                        buttonStyle={{ border: 0 }}
                        onClick={() => this.onSearch()}
                      />
                    </div>
                  </div>
                }
              />
            </div>
            <div className="form-without-button-cont-generic" style={{ fontWeight: "bold" }}>
              <CountDetails
                count={
                  search
                    ? searchFilterEmployeeComplaints.length
                    : employeeComplaints.length
                }
                total={employeeTotalComplaints}
                status="open"
              />
              <CustomComplaints
                //noComplaintMessage={"ES_MYCOMPLAINTS_NO_COMPLAINTS_ASSIGNED"}
                noComplaintMessage={
                  search
                    ? "No Search Results Found"
                    : "BK_MYBK_NO_APPLICATION_ASSIGNED"
                }
                onComplaintClick={onComplaintClick} 
                complaints={
                  search ? searchFilterEmployeeComplaints : employeeComplaints
                }
                role={role}
                complaintLocation={true}
              />
            </div>

          </Screen>
        );
  }
}

const roleFromUserInfo = (roles = [], role) => {
  const roleCodes = roles.map(role => {
    return role.code;
  });
  return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
    ? true
    : false;
};

const mapStateToProps = state => {
  const { bookings, common, screenConfiguration = {} } = state || {};
  const { fetchSuccess, applicationData,applicationType } = bookings;
  const loading = false;
  const { userInfo } = state.auth;
  const roles = userInfo.roles
let PreviousBookingData  = get(
    state,
    "screenConfiguration.preparedFinalObject.oldAvailabilityCheckData",
    "NotFound"
); 
let clearAvailable = get(
  state,
  "screenConfiguration.preparedFinalObject.availabilityCheckData",
  "NotFound"
)
let oldBookingData  = get(
  state,
  "screenConfiguration.preparedFinalObject.PreviousBookingData",
  "NotFound"
);

let discountOldDoc  = get(
  state,
  "screenConfiguration.preparedFinalObject.discountDocumentsUploadRedux",
  "NotFound"
);
let previousResidenceProof  = get(
  state,
  "screenConfiguration.preparedFinalObject.documentsUploadRedux",
  "NotFound"
);
let UploadedDocType  = get(
  state,
  "screenConfiguration.preparedFinalObject.UploadedDocType",
  "NotFound"
);
  
  const role = "employee";
  let assignedComplaints = [],
    unassignedComplaints = [],
    employeeComplaints = [],
    csrComplaints = [],
    numCSRComplaint,
    transformedComplaints;


  if (applicationData != null || applicationData != undefined) {
    transformedComplaints = applicationData.bookingsModelList;
    csrComplaints = transformedComplaints;
  }

  return {
    searchForm: state && state.formtemp && state.formtemp.form ? state.formtemp.form : '',
    assignedComplaints,PreviousBookingData ,oldBookingData,clearAvailable,
    unassignedComplaints,
    csrComplaints,
    applicationType,
    employeeComplaints,
    role,
    loading,
    transformedComplaints,
    roles,
    bookings,userInfo,discountOldDoc,previousResidenceProof,state
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetForm: () => {
      dispatch({ type: "RESET_FORM" });
    },
    setMetaData: (metaData) => {
      dispatch({ type: "SET_META_DATA", metaData });
    },
    handleChange: (e, property, isRequired, pattern) => {
      dispatch({
        type: "HANDLE_CHANGES",
        property,
        value: e.target.value,
        isRequired,
        pattern,
      });
    },
    setSearchParams: (searchParams) => {
      dispatch({ type: "SET_SEARCH_PARAMS", searchParams });
    },
    fetchApplications: (criteria, hasUsers, overWrite) =>
      dispatch(fetchApplications(criteria, hasUsers, overWrite)),  // clearBookingData:() 
    clearBookingData: (criteria, hasUsers, overWrite) =>
      dispatch(clearBookingData(criteria, hasUsers, overWrite)),
    fetchApplicationType: () =>
      dispatch(fetchApplicationType()),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllRequests);
