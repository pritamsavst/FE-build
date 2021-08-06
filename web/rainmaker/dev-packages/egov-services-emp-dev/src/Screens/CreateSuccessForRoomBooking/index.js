import React, { Component } from "react";
import { Button, Icon } from "components"; 
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForRoomBooking from "../../modules/SuccessMessageForRoomBooking";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication,fetchDataAfterPayment } from "../../redux/bookings/actions";
import jp from "jsonpath";
// import { getDurationDate, getFileUrlFromAPI} from '../../modules/commonFunction'
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp,downloadRoomPaymentRecipt,downloadRoomPermissionLetter
} from "egov-ui-kit/redux/bookings/actions";
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI } from '../../modules/commonFunction'
import { httpRequest } from "egov-ui-kit/utils/api";

class CreateWBTApplicationSuccess extends Component {
  constructor(props) {
		super(props);
	this.state = { 
operatorCode : "",
Address: "",
hsnCode : "",
name: "",
stateCode :"" ,
			placeOfService : "",
			 mcGSTN : ""
  }  
  }
  NumInWords = (number) => {
		const first = [
			"",
			"One ",
			"Two ",
			"Three ",
			"Four ",
			"Five ",
			"Six ",
			"Seven ",
			"Eight ",
			"Nine ",
			"Ten ",
			"Eleven ",
			"Twelve ",
			"Thirteen ",
			"Fourteen ",
			"Fifteen ",
			"Sixteen ",
			"Seventeen ",
			"Eighteen ",
			"Nineteen ",
		];
		const tens = [
			"",
			"",
			"Twenty",
			"Thirty",
			"Forty",
			"Fifty",
			"Sixty",
			"Seventy",
			"Eighty",
			"Ninety",
		];
		const mad = ["", "Thousand", "Million", "Billion", "Trillion"];
		let word = "";

		for (let i = 0; i < mad.length; i++) {
			let tempNumber = number % (100 * Math.pow(1000, i));
			if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
				if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
					word =
						first[Math.floor(tempNumber / Math.pow(1000, i))] +
						mad[i] +
						" " +
						word;
				} else {
					word =
						tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] +
						first[Math.floor(tempNumber / Math.pow(1000, i)) % 10] +
						mad[i] +
						" " +
						word;
				}
			}
 
			tempNumber = number % Math.pow(1000, i + 1);
			if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0)
				word =
					first[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] +
					"Hunderd " +
					word;
		}
		return word + "Rupees Only";
	};



  continueComplaintSubmit = () => {
    // let { createPACCApplicationData,userInfo,fetchSuccess } = this.props;
    // createPACCApplicationData={}
    // fetchSuccess=false;
  
    this.props.history.push(`/egov-services/all-applications`);
    window.location.reload(); 
  };
  componentDidMount = async () => {  
let {userInfo} = this.props
	let mdmsBody = {
		MdmsCriteria: {
			tenantId: userInfo.tenantId,
			moduleDetails: [

				{
					moduleName: "Booking",
					masterDetails: [
						{
							name: "E_SAMPARK_BOOKING",
						}
					],
				},

			],
		},
	};

	let payloadRes = null;
	payloadRes = await httpRequest( 
		"egov-mdms-service/v1/_search",
		"_search",[],
		mdmsBody
	);
	
 
	let mdmsBodyTwo = {
    MdmsCriteria: {
      tenantId: userInfo.tenantId,
      moduleDetails: [

        {
          moduleName: "Booking",
          masterDetails: [
            {
              name: "PDF_BOOKING_DETAILS",
            }
          ],
        },

      ],
    },
  }; 

  let payloadResTwo = null;
  payloadResTwo = await httpRequest(
    "egov-mdms-service/v1/_search",
    "_search",[],
    mdmsBodyTwo
  );
 

let pdfDetails = payloadResTwo.MdmsRes.Booking.PDF_BOOKING_DETAILS	



  this.setState({
    stateCode : pdfDetails[0].stateCode,
    placeOfService : pdfDetails[0].placeOfService,
    mcGSTN : pdfDetails[0].mcGSTN
  })
   
let samparkDetail = payloadRes.MdmsRes.Booking.E_SAMPARK_BOOKING

let operatorCode;
let Address;
let hsnCode;
let name;

for(let i = 0; i < samparkDetail.length; i++){
  if(samparkDetail[i].id == userInfo.fatherOrHusbandName){
	operatorCode = samparkDetail[i].operatorCode
	hsnCode = samparkDetail[i].hsnCode
	name = samparkDetail[i].name
	Address = samparkDetail[i].centreAddres
	}
}
this.setState({
	operatorCode:operatorCode,
	Address:Address,  
	hsnCode:hsnCode,
	name:name
})

    fetchDataAfterPayment(
			[{ key: "consumerCodes", value: this.props.AppNum }, { key: "tenantId", value: userInfo.tenantId }
			])


  }





  
  downloadPaymentReceipt = async (e) => {
    await this.downloadPaymentFunction();
     const {DownloadBWTApplicationDetails,userInfo,RoomPaymentReceipt}=this.props;
 
     var documentsPreview = [];
     let documentsPreviewData;
     if (RoomPaymentReceipt && RoomPaymentReceipt.filestoreIds.length > 0) {	
       documentsPreviewData = RoomPaymentReceipt.filestoreIds[0];
         documentsPreview.push({
           title: "DOC_DOC_PICTURE",
           fileStoreId: documentsPreviewData,
           linkText: "View",
         });
         let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
         let fileUrls =
           fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
         
   
         documentsPreview = documentsPreview.map(function (doc, index) {
           doc["link"] =
             (fileUrls &&
               fileUrls[doc.fileStoreId] &&
               fileUrls[doc.fileStoreId].split(",")[0]) ||
             "";
           
           doc["name"] =
             (fileUrls[doc.fileStoreId] &&
               decodeURIComponent(
                 fileUrls[doc.fileStoreId]
                   .split(",")[0]
                   .split("?")[0]
                   .split("/")
                   .pop()
                   .slice(13)
               )) ||
             `Document - ${index + 1}`;
           return doc;
         });
     
         setTimeout(() => {
           window.open(documentsPreview[0].link);
         }, 100);
         
       }
       }
  downloadPaymentFunction = async (e) => {
    const { downloadRoomPaymentRecipt, userInfo,createPACCApplicationData,documentMap,CreateRoomApplication,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four} = this.props;
 

    let totalACRoom = 0;
    let totalNonAcRoom = 0;
    let FromDate;
    let ToDate;
    let CreatedDate;
    let ApplicationNumber;
    let discountForRoom;
    let bookedrooms;
    for(let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++){
    if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC"){
      totalACRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms
      FromDate = CreateRoomApplication.data.roomsModel[i].fromDate
      ToDate = CreateRoomApplication.data.roomsModel[i].toDate
      CreatedDate = CreateRoomApplication.data.roomsModel[i].createdDate
      ApplicationNumber = CreateRoomApplication.data.roomsModel[i].roomApplicationNumber
      discountForRoom = CreateRoomApplication.data.roomsModel[i].discount
    }
    if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC"){
      totalNonAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms	//{"ResponseInfo":{"apiId":"Rainmaker","ver":".01","ts":"","action":"_search","did":"1","key":"","msgId":"20170310130900|en_IN","userInfo":{"id":182,"uuid":"28df855b-d5ff-43ff-bd13-fdf28875106b","userName":"e_sampark","name":"e_sampark Kumar","type":"EMPLOYEE","mobileNumber":"9811658211","emailId":"e_sampark@gmail.com","tenantId":"ch.chandigarh","roles":[{"id":null,"name":"Parks and Community Centre Offline Applier","code":"BK_E-SAMPARK-CENTER","tenantId":"ch.chandigarh"},{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"ch.chandigarh"}]},"correlationId":"925ccbbe-b800-44af-a459-d8887ffba86c"},"message":"Success","filestoreIds":["3906bd13-e235-47b8-853e-8fb1cbe4ff60"],"jobid":"bk-room-booking-pl-emp1616087147289","createdtime":1616087147204,"endtime":1616087147715,"tenantid":"ch.chandigarh","totalcount":1}
    }
    }


    if(totalACRoom !== 0 && totalNonAcRoom == 0){ 
      bookedrooms = `${totalACRoom} AC` 
    }
    if(totalACRoom == 0 && totalNonAcRoom !== 0){
      bookedrooms = `${totalNonAcRoom} Non AC` 
    }
    if(totalACRoom !== 0 && totalNonAcRoom !== 0){
      bookedrooms = `${totalACRoom} AC and ${totalNonAcRoom} Non AC` 
    }

let RoomFromDate = CreateRoomApplication.data.roomsModel[0].fromDate
let RoomToDate = CreateRoomApplication.data.roomsModel[0].toDate
let createdDate = CreateRoomApplication.data.roomsModel[0].createdDate
let typeOfRoom = CreateRoomApplication.data.roomsModel[0].typeOfRoom
let totalNumber = CreateRoomApplication.data.roomsModel[0].totalNoOfRooms

//typeOfRoom
    let AC = "";
    let NonAC = "";
    if(typeOfRoom == "AC"){
       AC = totalNumber
      }
    else(typeOfRoom == "NON-AC")
    {
      NonAC = totalNumber
    }


let Newugst;
let perFind = 50;
let ugst = this.props.BKROOM_TAX 
let find50Per = (perFind/100) * ugst

let findNumOrNot = Number.isInteger(find50Per);

if(findNumOrNot == true){
  Newugst = find50Per

}
else{
  Newugst = find50Per.toFixed(2);

}


    let applicationDetails = CreateRoomApplication.data
    let toDayDate = new Date()
  let approverName;
  for(let i = 0; i < userInfo.roles.length ; i++ ){
    if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
      approverName = userInfo.roles[i].name
    }
  } 

  let BookingInfo = [
    {
        "applicantDetails": {
            "name": applicationDetails.bkApplicantName,
        },
        "booking": {
            "bkLocation":  applicationDetails.bkLocation,
            "bkDept":  applicationDetails.bkBookingType,
            "bookedRooms": bookedrooms,
            "bookingPurpose": applicationDetails.bkBookingPurpose,
            "bkStartDate":RoomFromDate,
            "bkEndDate":  RoomToDate,
            "placeOfService": this.state.placeOfService,
            "applicationNumber":this.props.AppNum
        },
        "generatedBy":{
          "generatedBy": userInfo.name,
          "generatedDateTime": userInfo.createdDate
      },
        "approvedBy": {
            "approvedBy": userInfo.name,
            "role": approverName
        },
        "emp": {
            "OpCode": this.state.operatorCode,
            "samparkAdd": this.state.Address,
        },
        "paymentInfo": {
            "cleaningCharges": "Not Applicable",
            "baseCharge": BKROOM,
            "cgst": Newugst,
            "utgst": Newugst,
            "totalgst": BKROOM_TAX,
            "refundableCharges": applicationDetails.bkRefundAmount,
            "totalPayment": this.props.totalAmount,
            "paymentDate": convertEpochToDate(this.props.transactionDate,"dayend"),
            "receiptNo": this.props.ReceiptNumber,
            "currentDate": convertEpochToDate(toDayDate,"dayend"),
            "paymentType": this.props.paymentMode,
            "facilitationCharge": "100",
            "custGSTN": applicationDetails.bkCustomerGstNo == "NA" ? "Not Applicable": applicationDetails.bkCustomerGstNo,
            "mcGSTN": this.state.mcGSTN,
            "bankName": "",
            "transactionId": this.props.transactionNumber,
            "totalPaymentInWords": this.NumInWords(
              this.props.totalAmount
            ),
            "discType": applicationDetails.bkPlotSketch,
            "cardNumberLast4": "Not Applicable",
            "dateVenueChangeCharges": "Not Applicable" 
        },
        "tenantInfo": {
            "municipalityName": "Municipal Corporation Chandigarh",
            "address": "New Deluxe Building, Sector 17, Chandigarh",
            "contactNumber": "+91-172-2541002, 0172-2541003",
            "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
            "webSite": "http://mcchandigarh.gov.in",
            "mcGSTN": this.state.mcGSTN,
            "statecode": this.state.stateCode,
            "hsncode": this.state.hsnCode
        },
        "bankInfo": {
            "accountholderName": applicationDetails.bkBankAccountHolder,
            "rBankName": applicationDetails.bkBankName,
            "rBankACNo": applicationDetails.bkBankAccountNumber,
            "rIFSCCode": applicationDetails.bkIfscCode
        }
    }
]

downloadRoomPaymentRecipt({ BookingInfo: BookingInfo })
  };

  downloadPermissionLetter = async (e) => {
    await this.downloadPermissionLetterFunction();
    const {DownloadBWTApplicationDetails,userInfo,RoomPermissionLetter}=this.props;

    var documentsPreview = [];
    let documentsPreviewData;
    if (RoomPermissionLetter && RoomPermissionLetter.filestoreIds.length > 0) {	
      documentsPreviewData = RoomPermissionLetter.filestoreIds[0];
        documentsPreview.push({
          title: "DOC_DOC_PICTURE",
          fileStoreId: documentsPreviewData,
          linkText: "View",
        });
        let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
        let fileUrls =
          fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
        
  
        documentsPreview = documentsPreview.map(function (doc, index) {
          doc["link"] =
            (fileUrls &&
              fileUrls[doc.fileStoreId] &&
              fileUrls[doc.fileStoreId].split(",")[0]) ||
            "";
          
          doc["name"] =
            (fileUrls[doc.fileStoreId] &&
              decodeURIComponent(
                fileUrls[doc.fileStoreId]
                  .split(",")[0]
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`;
          return doc;
        });
    
        setTimeout(() => {
          window.open(documentsPreview[0].link);
        }, 100);
        
      }
  }

  downloadPermissionLetterFunction = async (e) => {
    const { downloadRoomPermissionLetter, userInfo,createPACCApplicationData,documentMap,CreateRoomApplication,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four} = this.props;


    let totalACRoom = 0;
    let totalNonAcRoom = 0;
    let FromDate;
    let ToDate;
    let CreatedDate;
    let ApplicationNumber;
    let discountForRoom;
    let bookedrooms;  
    for(let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++){
    if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC"){
      totalACRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms
      FromDate = CreateRoomApplication.data.roomsModel[i].fromDate
      ToDate = CreateRoomApplication.data.roomsModel[i].toDate
      CreatedDate = CreateRoomApplication.data.roomsModel[i].createdDate
      ApplicationNumber = CreateRoomApplication.data.roomsModel[i].roomApplicationNumber
      discountForRoom = CreateRoomApplication.data.roomsModel[i].discount
    }
    if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC"){
      totalNonAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms	
    }
    }

if(totalACRoom !== 0 && totalNonAcRoom == 0){
  bookedrooms = `${totalACRoom} AC Room(s)` 
}
if(totalACRoom == 0 && totalNonAcRoom !== 0){
  bookedrooms = `${totalNonAcRoom} Non AC Room(s)` 
}
if(totalACRoom !== 0 && totalNonAcRoom !== 0){
  bookedrooms = `${totalACRoom} AC and ${totalNonAcRoom} Non AC Room(s)` 
}

let RoomFromDate = CreateRoomApplication.data.roomsModel[0].fromDate
let RoomToDate = CreateRoomApplication.data.roomsModel[0].toDate
let createdDate = CreateRoomApplication.data.roomsModel[0].createdDate
let typeOfRoom = CreateRoomApplication.data.roomsModel[0].typeOfRoom
let totalNumber = CreateRoomApplication.data.roomsModel[0].totalNoOfRooms

//typeOfRoom
    let AC = "";
    let NonAC = "";
    if(typeOfRoom == "AC"){
       AC = totalNumber
      }
    else(typeOfRoom == "NON-AC")
    {
      NonAC = totalNumber
    }

   

let Newugst;
let perFind = 50;
let ugst = this.props.BKROOM_TAX 
let find50Per = (perFind/100) * ugst
	
let findNumOrNot = Number.isInteger(find50Per);

if(findNumOrNot == true){
  Newugst = find50Per

}
else{
  Newugst = find50Per.toFixed(2);
 
}


    let applicationDetails = CreateRoomApplication.data
    let toDayDate = new Date()
  let approverName;
  for(let i = 0; i < userInfo.roles.length ; i++ ){
    if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
      approverName = userInfo.roles[i].name
    }
  }

 let BookingInfo = [
    {
        "applicantDetails": {
            "name": applicationDetails.bkApplicantName,
            "permanentAddress": applicationDetails.bkSector,
            "permanentCity": "chandigarh",
            "placeOfService": this.state.placeOfService,
        },
        "bookingDetails": {
            "bkLocation": applicationDetails.bkLocation,
            "bkDept": applicationDetails.bkBookingType,
            "bookedRooms": bookedrooms,
            "bookingPurpose": applicationDetails.bkBookingPurpose,
            "bkStartDate": RoomFromDate,
            "bkEndDate": RoomToDate,
            "placeOfService": this.state.placeOfService,
            "venueName": applicationDetails.bkLocation,
            "sector": applicationDetails.bkSector,
            "bookingType":applicationDetails.bkBookingType,
             "applicationDate":createdDate,
            "bookingPeriod": getDurationDate(
              applicationDetails.bkFromDate,
              applicationDetails.bkToDate
            ),
            "applicationNumber":this.props.AppNum
        },
        "generated": {
          "generatedBy": userInfo.name,
          "generatedDateTime": userInfo.createdDate
        },
        "approvedBy": {
          "approvedBy": userInfo.name,
          "role": approverName
      },
        "emp": {
            "samparkName": this.state.name,
            "samparkaddress": this.state.Address
        },
        "paymentInfo": {
          "cleaningCharges": "Not Applicable",
          "baseCharge": BKROOM,
          "cgst": Newugst,
          "utgst": Newugst,
          "totalgst": BKROOM_TAX,
          "refundableCharges": "",
          "totalPayment": this.props.totalAmount,
          "paymentDate": convertEpochToDate(this.props.transactionDate,"dayend"),
          "receiptNo": this.props.ReceiptNumber,
          "currentDate": convertEpochToDate(toDayDate,"dayend"),
          "paymentType": this.props.paymentMode,
          "facilitationCharge": four,
          "custGSTN": applicationDetails.bkCustomerGstNo,
          "mcGSTN": "",
          "bankName": "",
          "transactionId": this.props.transactionNumber,
          "totalPaymentInWords": this.NumInWords(
            this.props.totalAmount
          ),
          "discType": applicationDetails.bkPlotSketch,
          "cardNumberLast4": "Not Applicable",
          "dateVenueChangeCharges": "Not Applicable" 
      },
        "tenantInfo": {
            "municipalityName": "Municipal Corporation Chandigarh",
            "address": "New Deluxe Building, Sector 17, Chandigarh",
            "contactNumber": "+91-172-2541002, 0172-2541003",
            "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
            "webSite": "http://mcchandigarh.gov.in",
            "mcGSTN": this.state.mcGSTN,
            "statecode": this.state.stateCode,
            "hsncode": this.state.hsnCode
        },
        "bankInfo": {
          "accountholderName": applicationDetails.bkBankAccountHolder,
          "rBankName": applicationDetails.bkBankName,
          "rBankACNo": applicationDetails.bkBankAccountNumber,
          "rIFSCCode": applicationDetails.bkIfscCode
      }
    }
]

downloadRoomPermissionLetter({ BookingInfo: BookingInfo })
  };


  render() {
    const { AppNum,userInfo,CreateRoomApplication,createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData } = this.props;
    //BK_MYBK_PCC_CREATE_APPLICATION_HEADER
    // Park And Community Centre
    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessageForRoomBooking
         headermessage="BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER" 
          successmessage="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
          secondaryLabel="BK_CS_COMMON_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }} 
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={AppNum} 
        />
        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_ROOM_DOWNLOAD_PAYMENT_BUTTON" />}
            fullWidth={true}
            onClick={this.downloadPaymentReceipt}
            style={{ marginRight: 18 }}
          />
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_ROOM_DOWNLOAD_PERMISSION_LETTER_BUTTON" />}
            fullWidth={true}
            onClick={this.downloadPermissionLetter}
            style={{ marginRight: 18 }}
          />
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_PACC_EMP_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
            className="responsive-action-button"
          />
        </div>
      </div>
      </Screen>
    );
  }
}


const mapStateToProps = state => {
  const { complaints, bookings,common, auth, form } = state;
  const { userInfo } = auth;
const {RoomPaymentReceipt,RoomPermissionLetter} = bookings
  let CreateRoomApplication = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreateRoomApplication : "NA"

let AppNum = CreateRoomApplication.data.roomsModel[0].roomApplicationNumber


const { fetchPaymentAfterPayment } = bookings;


let ReceiptNumber = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].receiptNumber

let CashPaymentInfo = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0]


let ArrayForPayment = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails



let BKROOM_TAX = 0;
let BKROOM = 0;
let BKROOM_ROUND_OFF = 0;   
let four = 0;
//BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four

for(let i = 0; i < ArrayForPayment.length ; i++ ){

if(ArrayForPayment[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
BKROOM_TAX = ArrayForPayment[i].amount
}
else if(ArrayForPayment[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
BKROOM = ArrayForPayment[i].amount
}
else if(ArrayForPayment[i].taxHeadCode == "BKROOM_ROUND_OFF"){
BKROOM_ROUND_OFF = ArrayForPayment[i].amount
}
else if(ArrayForPayment[i].taxHeadCode == "ROOM_FACILITATION_CHARGE"){
four = ArrayForPayment[i].amount
}
} 

let paymentMode = state.screenConfiguration.preparedFinalObject.paymentMode;

let totalAmount = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].totalAmountPaid
 
let transactionDate = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionDate

let transactionNumber = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionNumber

  const loading = false;

  
  return {BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four,
    RoomPaymentReceipt,RoomPermissionLetter,AppNum,userInfo,CreateRoomApplication,paymentMode,ReceiptNumber,totalAmount,transactionDate,transactionNumber
  }
}

const mapDispatchToProps = dispatch => {
  return {
    downloadRoomPermissionLetter: criteria => dispatch(downloadRoomPermissionLetter(criteria)),
    downloadRoomPaymentRecipt: criteria => dispatch(downloadRoomPaymentRecipt(criteria)),
    createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
      fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);