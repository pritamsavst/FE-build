import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPayment from "../../modules/SuccessMessageForPayment";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication,downloadReceiptForPCC } from "../../redux/bookings/actions";
import jp from "jsonpath";
import "./index.css";
import get from "lodash.get";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp,updatePACCApplication
} from "egov-ui-kit/redux/bookings/actions";
import {
	downloadRoomPaymentRecipt,downloadRoomPermissionLetter
} from "egov-ui-kit/redux/bookings/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI} from '../../modules/commonFunction'
import { httpRequest } from "egov-ui-kit/utils/api";
 
class CreateWBTApplicationSuccess extends Component {

	constructor(props) {
		super(props);
		this.state = {
			RoomCreateTime : '',
	operatorCode : "",
  Address : "",
  hsnCode : "",
  name : "",
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

	Submit = async () => {
		this.props.history.push(`/egov-services/all-applications`);
		window.location.reload(); 
	}
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
		console.log(payloadRes, "hsncodeAndAll");
	 
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
	  console.log(payloadResTwo, "MCGSTnumberDetail");
	
	let pdfDetails = payloadResTwo.MdmsRes.Booking.PDF_BOOKING_DETAILS	
	console.log("pdfDetails-",pdfDetails)   //stateCode  placeOfService  mcGSTN
	
	
	  this.setState({
		stateCode : pdfDetails[0].stateCode,
		placeOfService : pdfDetails[0].placeOfService,
		mcGSTN : pdfDetails[0].mcGSTN
	  },console.log("thisStatestateCode",this.state.stateCode,this.state.placeOfService,this.state.mcGSTN))
	   
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
  }

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
		const { downloadRoomPermissionLetter, state,userInfo,createPACCApplicationData,documentMap,CreateRoomApplication,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four} = this.props;
	console.log("PropsInPLfunction",this.props,CreateRoomApplication)
	console.log("CreateRoomApplication.data.roomsModel-In-Pl-fun",CreateRoomApplication.data.roomsModel)
		
		let pdfCardNum = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].cardNumber",
			"NotFound"
		  );
console.log("pdfCardNum---",pdfCardNum)
		  let pdfBankName = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].bankName",
			"NotFound"
		  );
console.log("pdfBankName-pl",pdfBankName)
		  let paymentCollectionType = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].paymentCollectionType",
			"NotFound"
		  );
	console.log("paymentCollectionType-pl",paymentCollectionType)

	       let cheDdNum = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].chequeNumber",
			"NotFound"
		  );

		  let cheDaDate = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].paymentDate",
			"NotFound"
		  );
	let totalACRoom = 0;
	let totalNonAcRoom = 0;
	let FromDate;
	let ToDate;
	let CreatedDate;
	let ApplicationNumber;
	let discountForRoom;
	let bookedrooms;
	let RoomCreateTime;
	let getCardNum
	let getBankName
	let displayBankName
	let chequeNo = "Not Applicable"
	let chequeDate = "Not Applicable"
	let demandDraftNo = "Not Applicable"
	let demandDraftDate = "Not Applicable"

	for(let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++){
		if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC"){
		  totalACRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms  
		  FromDate = CreateRoomApplication.data.roomsModel[i].fromDate
		  ToDate = CreateRoomApplication.data.roomsModel[i].toDate
		  CreatedDate = CreateRoomApplication.data.roomsModel[i].createdDate
		  ApplicationNumber = CreateRoomApplication.data.roomsModel[i].roomApplicationNumber
		  discountForRoom = CreateRoomApplication.data.roomsModel[i].discount
		  RoomCreateTime = CreateRoomApplication.data.roomsModel[i].roomCreatedDate
		}
		if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC"){
		  totalNonAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms	//{"ResponseInfo":{"apiId":"Rainmaker","ver":".01","ts":"","action":"_search","did":"1","key":"","msgId":"20170310130900|en_IN","userInfo":{"id":182,"uuid":"28df855b-d5ff-43ff-bd13-fdf28875106b","userName":"e_sampark","name":"e_sampark Kumar","type":"EMPLOYEE","mobileNumber":"9811658211","emailId":"e_sampark@gmail.com","tenantId":"ch.chandigarh","roles":[{"id":null,"name":"Parks and Community Centre Offline Applier","code":"BK_E-SAMPARK-CENTER","tenantId":"ch.chandigarh"},{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"ch.chandigarh"}]},"correlationId":"925ccbbe-b800-44af-a459-d8887ffba86c"},"message":"Success","filestoreIds":["3906bd13-e235-47b8-853e-8fb1cbe4ff60"],"jobid":"bk-room-booking-pl-emp1616087147289","createdtime":1616087147204,"endtime":1616087147715,"tenantid":"ch.chandigarh","totalcount":1}
		  RoomCreateTime = CreateRoomApplication.data.roomsModel[i].roomCreatedDate
		  FromDate = CreateRoomApplication.data.roomsModel[i].fromDate
		  ToDate = CreateRoomApplication.data.roomsModel[i].toDate
		  CreatedDate = CreateRoomApplication.data.roomsModel[i].createdDate
		  ApplicationNumber = CreateRoomApplication.data.roomsModel[i].roomApplicationNumber
		  discountForRoom = CreateRoomApplication.data.roomsModel[i].discount
		}
		}

		if(paymentCollectionType == "CARD" || paymentCollectionType == "Card"){
			displayBankName = `**** **** **** ${pdfCardNum}`
			getCardNum = displayBankName
		  }else{
			getCardNum = "Not Applicable"  
		  }
		  if(paymentCollectionType == "DD" || paymentCollectionType == "CHEQUE" || paymentCollectionType == "Cheque"){
			getBankName = pdfBankName
		  }else{
			getBankName = "Not Applicable"
		  }
		if(paymentCollectionType == "DD"){
			demandDraftNo = cheDdNum
			console.log("demandDraftNo000",demandDraftNo)
			demandDraftDate = cheDaDate
			console.log("demandDraftDate000",demandDraftDate)
		}
		if(paymentCollectionType == "CHEQUE" || paymentCollectionType == "Cheque"){
			chequeNo = cheDdNum
			console.log("chequeNo--8989",chequeNo)
			chequeDate = cheDaDate
			console.log("chequeDate000",chequeDate)
		}
  console.log("findNotApplicable",chequeNo,chequeDate,demandDraftNo,demandDraftDate)
  
    let strfromDate = FromDate.toString(); 
	let numFromDate = Number(strfromDate)
	let strtoDate = ToDate.toString();
	let numToDate = Number(strtoDate) 
	
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
	console.log("find50Per--",find50Per)		
	let findNumOrNot = Number.isInteger(find50Per);
	console.log("findNumOrNot--",findNumOrNot)
	if(findNumOrNot == true){
	  Newugst = find50Per
	  console.log("trueCondition")
	}
	else{
	  Newugst = find50Per.toFixed(2);
	  console.log("second-Newugst-",Newugst)
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
					strfromDate,
					strtoDate 
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
			  "totalPayment": this.props.totalAmountPaid,
			//   "paymentDate": convertEpochToDate(this.props.transactionDate,"dayend"), 
			  "paymentDate": RoomCreateTime, 
			  "receiptNo": this.props.ReceiptNumber,
			  "currentDate": convertEpochToDate(toDayDate,"dayend"),
			  "paymentType": this.props.paymentMode,
			  "facilitationCharge": four,
			  "custGSTN": applicationDetails.bkCustomerGstNo,
			  "mcGSTN": "",
			  "bankName": getBankName,
			  "transactionId": this.props.transactionNumber,
			  "totalPaymentInWords": this.NumInWords(
				this.props.totalAmountPaid
			  ),
			  "discType": applicationDetails.bkPlotSketch,
			  "cardNumberLast4": getCardNum,
			  "dateVenueChangeCharges": "Not Applicable",
			  chequeNo:chequeNo,
	chequeDate : chequeDate,
	demandDraftNo : demandDraftNo,
	demandDraftDate : demandDraftDate
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
			  "rIFSCCode": applicationDetails.bkIfscCode,
			  nomName: applicationDetails.bkNomineeName,
		  }
		}
	]
	
	console.log("RequestBodyOfPl",BookingInfo)

	let permissionletterResponse = await httpRequest(
	  "pdf-service/v1/_create?key=bk-room-booking-pl-emp",
	  "_search",
	  [],
	  { BookingInfo: BookingInfo }
	);
	console.log("permissionletterResponse",permissionletterResponse)

	let EmpPaccPermissionLetter = permissionletterResponse.filestoreIds
	console.log("EmpPaccPermissionLetter",EmpPaccPermissionLetter)
	
	var documentsPreview = [];
	let documentsPreviewData;
	if (EmpPaccPermissionLetter && EmpPaccPermissionLetter.length > 0) {	
		console.log("recheckidforPl",EmpPaccPermissionLetter)
	  documentsPreviewData = EmpPaccPermissionLetter[0];
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
	
	  downloadPaymentReceipt = async (e) => {  
		await this.downloadPaymentFunction();
		 const {DownloadBWTApplicationDetails,userInfo,RoomPaymentReceipt}=this.props;
	 console.log("downloadPaymentReceipt--props",this.props)
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
		const {state, downloadRoomPaymentRecipt, userInfo,createPACCApplicationData,documentMap,CreateRoomApplication,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four} = this.props;
	
		let paymentCollectionType = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].paymentCollectionType",
			"NotFound"
		  );
	console.log("paymentCollectionType-receipt",paymentCollectionType)
		
		let pdfCardNum = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].cardNumber",
			"NotFound"
		  );
console.log("pdfCardNumreceipt",pdfCardNum)
		  let pdfBankName = get(
			state,
			"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].bankName",
			"NotFound"
		  );
	console.log("pdfBankName",pdfBankName)

	let cheDdNum = get(
		state,
		"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].chequeNumber",
		"NotFound"
	  );

	  let cheDaDate = get(
		state,
		"screenConfiguration.preparedFinalObject.ApplicationCreateForRoom.data.roomsModel[0].paymentDate",
		"NotFound"
	  );
		let totalACRoom = 0;
		let totalNonAcRoom = 0;
		let FromDate;
		let ToDate;
		let CreatedDate;
		let ApplicationNumber;
		let discountForRoom;
		let bookedrooms;
		let RoomCreateTime;
		let displayBankName
	
		let getCardNum
		let getBankName
		let NumberCDD
	let CDDdate;
	let chequeNo = "Not Applicable"
	let chequeDate = "Not Applicable"
	let demandDraftNo = "Not Applicable"
	let demandDraftDate = "Not Applicable"
		for(let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++){
		if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC"){
		  totalACRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms  
		  FromDate = CreateRoomApplication.data.roomsModel[i].fromDate
		  ToDate = CreateRoomApplication.data.roomsModel[i].toDate
		  CreatedDate = CreateRoomApplication.data.roomsModel[i].createdDate
		  ApplicationNumber = CreateRoomApplication.data.roomsModel[i].roomApplicationNumber
		  discountForRoom = CreateRoomApplication.data.roomsModel[i].discount
		  RoomCreateTime = CreateRoomApplication.data.roomsModel[i].roomCreatedDate
		}
		if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC"){
		  totalNonAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms	//{"ResponseInfo":{"apiId":"Rainmaker","ver":".01","ts":"","action":"_search","did":"1","key":"","msgId":"20170310130900|en_IN","userInfo":{"id":182,"uuid":"28df855b-d5ff-43ff-bd13-fdf28875106b","userName":"e_sampark","name":"e_sampark Kumar","type":"EMPLOYEE","mobileNumber":"9811658211","emailId":"e_sampark@gmail.com","tenantId":"ch.chandigarh","roles":[{"id":null,"name":"Parks and Community Centre Offline Applier","code":"BK_E-SAMPARK-CENTER","tenantId":"ch.chandigarh"},{"id":null,"name":"Employee","code":"EMPLOYEE","tenantId":"ch.chandigarh"}]},"correlationId":"925ccbbe-b800-44af-a459-d8887ffba86c"},"message":"Success","filestoreIds":["3906bd13-e235-47b8-853e-8fb1cbe4ff60"],"jobid":"bk-room-booking-pl-emp1616087147289","createdtime":1616087147204,"endtime":1616087147715,"tenantid":"ch.chandigarh","totalcount":1}
		  RoomCreateTime = CreateRoomApplication.data.roomsModel[i].roomCreatedDate
		  FromDate = CreateRoomApplication.data.roomsModel[i].fromDate
		  ToDate = CreateRoomApplication.data.roomsModel[i].toDate
		  CreatedDate = CreateRoomApplication.data.roomsModel[i].createdDate
		  ApplicationNumber = CreateRoomApplication.data.roomsModel[i].roomApplicationNumber
		  discountForRoom = CreateRoomApplication.data.roomsModel[i].discount
		}
		}
	
		if(paymentCollectionType == "CARD" || paymentCollectionType == "Card"){
		  displayBankName = `**** **** **** ${pdfCardNum}`
		  getCardNum = displayBankName
		}else{
		  getCardNum = "Not Applicable"  
		}
		if(paymentCollectionType == "DD" || paymentCollectionType == "CHEQUE" ||paymentCollectionType =="Cheque"){
		  getBankName = pdfBankName
		}else{
		  getBankName = "Not Applicable"
		}

		if(paymentCollectionType == "DD"){
			demandDraftNo = cheDdNum
			demandDraftDate = cheDaDate
		}
		if(paymentCollectionType == "CHEQUE" || paymentCollectionType == "Cheque"){
			chequeNo = cheDdNum
			chequeDate = cheDaDate
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
	console.log("find50Per--",find50Per)		
	let findNumOrNot = Number.isInteger(find50Per);
	console.log("findNumOrNot--",findNumOrNot)
	if(findNumOrNot == true){
	  Newugst = find50Per
	  console.log("trueCondition")
	}
	else{
	  Newugst = find50Per.toFixed(2);
	  console.log("second-Newugst-",Newugst)
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
				"totalPayment": this.props.totalAmountPaid,
				// "paymentDate": convertEpochToDate(this.props.transactionDate,"dayend"),
				"paymentDate": RoomCreateTime, 
				"receiptNo": this.props.ReceiptNumber,
				"currentDate": convertEpochToDate(toDayDate,"dayend"),
				"paymentType": this.props.paymentMode,
				"facilitationCharge": "100",
				"custGSTN": applicationDetails.bkCustomerGstNo == "NA" ? "Not Applicable": applicationDetails.bkCustomerGstNo,
				"mcGSTN": this.state.mcGSTN,
				"bankName": getBankName,
				"transactionId": this.props.transactionNumber,
				"totalPaymentInWords": this.NumInWords(
					this.props.totalAmountPaid
				),
				"discType": applicationDetails.bkPlotSketch,
				"cardNumberLast4": getCardNum,
				"dateVenueChangeCharges": "Not Applicable",
				chequeNo:chequeNo,
				chequeDate : chequeDate,
				demandDraftNo : demandDraftNo,
				demandDraftDate : demandDraftDate 
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
				"rIFSCCode": applicationDetails.bkIfscCode,
				nomName: applicationDetails.bkNomineeName,
			}
		}
	]

	let ReceiptResponse = await httpRequest(
		"pdf-service/v1/_create?key=room-payment-receipt-emp",
		"_search",
		[],
		{ BookingInfo: BookingInfo }
	  );
	  console.log("ReceiptOfRequestBody",ReceiptResponse)

	  let PaymentReceiptByESamp = ReceiptResponse.filestoreIds
      console.log("PaymentReceiptByESamp",PaymentReceiptByESamp)

	  var documentsPreview = [];
	  let documentsPreviewData;
	  if (PaymentReceiptByESamp && PaymentReceiptByESamp.length > 0) {	
		  console.log("checkFileStoreId",PaymentReceiptByESamp)
		documentsPreviewData = PaymentReceiptByESamp[0];
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
	 };     

  render() {
  const { RecNumber,createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData,AppNum} = this.props;
	console.log("this.props-in-paymentSuccessForEmp-",this.props)
	console.log(RecNumber?RecNumber:"notfound","RecNumber")
	console.log("AppNum--",AppNum?AppNum:"non")
   
    console.log("InSuccessPage--",
    { labelName: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER-Value", labelKey: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER" },
    { labelName: "BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE--", labelKey: "BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE" },
    { labelName: "BK_CS_COMMON_SEND_MESSAGE--", labelKey: "BK_CS_COMMON_SEND_MESSAGE" },
)

    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessageForPayment
		  headermessage={`Rooms Booking`}
          successmessage="Payment has been collected successfully!"
          secondaryLabel="A notification regarding Payment Collection has been sent to property owner at registered Mobile No."
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={AppNum}
          ReceiptNumber={RecNumber}
        />
        <div className="responsive-action-button-cont">
<Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_ROOM_DOWNLOAD_PAYMENT_BUTTON" />}
            fullWidth={true}
            onClick={this.downloadPaymentFunction}
			style={{ marginRight: "1.5%" }}
          />
          <Button
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_ROOM_DOWNLOAD_PERMISSION_LETTER_BUTTON" />}
            // fullWidth={true}
            onClick={this.downloadPermissionLetterFunction}
			style={{ marginRight: "1.5%",width: "19%" }} 
          />
 
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_PACC_EMP_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.Submit}
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
  const { updatePACCApplicationData,fetchSuccess, Downloadesamparkdetails, applicationData,DownloadReceiptDetailsforPCC} = bookings;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,categoriesById } = complaints;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : ""; 
//   let createPACCApplicationData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreatePaccAppData : "NotAnyMore"; 
  let RecNumber = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CollectionReceiptNum : "NotAnyMore";
  console.log("RecNumber--",RecNumber)
 //RecNumber,offlinePayment,offlineTransactionNum,offlineTransactionDate,
 //offlinePayementMode,offlinePayementMode,totalAmountPaid,totalAmount
let offlinePayment = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment:"notFound"
console.log("offlinePayment--",offlinePayment)

let RoomBookingData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
console.log("-RoomBookingData-",RoomBookingData)  

let DataForRoomBooking = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
console.log("DataForRoomBooking-",DataForRoomBooking)
let CreateRoomApplication = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreateRoomApplication : "NA"
console.log("CreateRoomApplication-",CreateRoomApplication)
let AppNum = CreateRoomApplication.data.roomsModel[0].roomApplicationNumber
console.log("AppNum--AppNum",AppNum)

let acRoomId;  //acRoomId,nonAcRoomId
let nonAcRoomId;
let updateNumOfAcRoom; //updateNumOfAcRoom,updateNumOfNonAcRoom

let updateNumOfNonAcRoom;
//data.roomsModel
for(let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++){
console.log("CreateRoomApplication.data.roomsModel",CreateRoomApplication.data.roomsModel)
if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC"){
	console.log("CreateRoomApplication.TypeOfAcRoom",CreateRoomApplication.data.roomsModel[i])
	updateNumOfAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms   
	acRoomId = CreateRoomApplication.data.roomsModel[i].id
}
if(CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC"){
	nonAcRoomId = CreateRoomApplication.data.roomsModel[i].id
	updateNumOfNonAcRoom = CreateRoomApplication.data.roomsModel[i].totalNoOfRooms
}
}
console.log("acRoomId--",acRoomId)
console.log("nonAcRoomId--",nonAcRoomId)
console.log("updateNumOfAcRoom--",updateNumOfAcRoom)
console.log("updateNumOfNonAcRoom--",updateNumOfNonAcRoom)
let totalRoom = CreateRoomApplication.data.roomsModel[0].totalNoOfRooms
console.log("totalRoom--",totalRoom)

let discountForRoom = CreateRoomApplication.data.roomsModel[0].discount
console.log("discountForRoom--",discountForRoom)
//GlobalNonAccRoomToBook,GlobalAccRoomToBook
let GlobalNonAccRoomToBook = state.screenConfiguration.preparedFinalObject ? 
(state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook != undefined && state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook != null ? (state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook) : 'NA') : "NA"
console.log("GlobalNonAccRoomToBook--",GlobalNonAccRoomToBook)
let GlobalAccRoomToBook = state.screenConfiguration.preparedFinalObject ? 
(state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook != undefined && state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook != null ? (state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook) : 'NA') : "NA"
console.log("GlobalAccRoomToBook-",GlobalAccRoomToBook)

let typeOfRoom = CreateRoomApplication.data.roomsModel[0].typeOfRoom
console.log("totalRoom--",typeOfRoom)

let roomFromDate = CreateRoomApplication.data.roomsModel[0].fromDate
console.log("roomFromDate--roomFromDate",roomFromDate)

let roomToDate = CreateRoomApplication.data.roomsModel[0].toDate
console.log("roomToDate--roomToDate",roomToDate)   //roomFromDate,roomToDatep  

let RoomId = CreateRoomApplication.data.roomsModel[0].id
console.log("RoomId--",RoomId)

let bothRoom = state.screenConfiguration.preparedFinalObject ?
(state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== undefined && state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== null ?state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom : 'NA'): "NA"
console.log("bothRoom--",bothRoom)

//transactionNum
let offlineTransactionNum = offlinePayment ? offlinePayment.Payments[0].transactionNumber : "NotFound"
console.log("offlineTransactionNum--",offlineTransactionNum)  

//transactionDate
let offlineTransactionDate = offlinePayment ? offlinePayment.Payments[0].transactionDate : "NotFound"
console.log("offlineTransactionDate--",offlineTransactionDate) 

//paymentMode
let offlinePayementMode = offlinePayment ? offlinePayment.Payments[0].paymentMode : "NotFound"
console.log("offlinePayementMode--",offlinePayementMode)

//totalAmountPaid
let totalAmountPaid = offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill.totalAmount : "NotFound"
console.log("totalAmountPaid--",totalAmountPaid)

//base charges
let totalAmount =  offlinePayment ? offlinePayment.Payments[0].paymentDetails[0].bill : "NotFound" // till here

const { fetchPaymentAfterPayment } = bookings;
console.log("fetchPaymentAfterPayment--for-roomSuccess--",fetchPaymentAfterPayment)

let ReceiptNumber = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].receiptNumber
console.log("ReceiptNumber",ReceiptNumber)
let CashPaymentInfo = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0]
console.log("CashPaymentInfo--",CashPaymentInfo)

let ArrayForPayment = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails
console.log("ArrayForPayment--",ArrayForPayment)


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

let transactionDate = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionDate

let transactionNumber = state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment.Payments[0].transactionNumber

const {RoomPaymentReceipt,RoomPermissionLetter} = bookings

return {typeOfRoom,totalRoom,GlobalNonAccRoomToBook,GlobalAccRoomToBook,discountForRoom,acRoomId,nonAcRoomId,updateNumOfAcRoom,updateNumOfNonAcRoom,
	RecNumber,offlinePayment,offlineTransactionNum,offlineTransactionDate,AppNum,roomFromDate,roomToDate,state,
	offlinePayementMode,totalAmountPaid,totalAmount,RoomBookingData,RoomId,DataForRoomBooking,userInfo,bothRoom,CreateRoomApplication,
	RoomPaymentReceipt,RoomPermissionLetter,
	ReceiptNumber,CashPaymentInfo,ArrayForPayment,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,four,paymentMode,transactionDate,transactionNumber
}

//surcharges
// let firstrent = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData: "";
// console.log("firstrent--",firstrent)

// let cleanOne =  firstrent?firstrent.cleaningCharges:""; 
// console.log("cleanOne--",cleanOne)

// let Summarysurcharge = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.Summarysurcharge: "NotFound";
// console.log("Summarysurcharge-2-",Summarysurcharge)

// let SummarycGST = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SummarycGST: "NotFound";
// console.log("SummarycGST-2-",SummarycGST)

//   return {first,second,firstToTimeSlot, firstTimeSlotValue,SecondTimeSlotValue,conJsonSecond,conJsonfirst,
//     createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,selectedComplaint,
//     updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap,AppNum,DownloadReceiptDetailsforPCC,RecNumber,createAppData
//  ,venueType,vanueData,bookingData,bookingData,offlinePayment,offlineTransactionNum,offlineTransactionDate,
//  offlinePayementMode,location,totalAmountPaid,six,one,Summarysurcharge,cleanOne,SummarycGST,SecTimeSlotFromTime,SecTimeSlotToTime,
// }
}

const mapDispatchToProps = dispatch => {
  return {
    downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
    downloadReceiptForPCC: criteria => dispatch(downloadReceiptForPCC(criteria)),
    downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),
	createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
	updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
	  dispatch(toggleSnackbarAndSetText(open, message, error)),
	  prepareFinalObject: (jsonPath, value) =>
	  dispatch(prepareFinalObject(jsonPath, value)),
	downloadRoomPermissionLetter: criteria => dispatch(downloadRoomPermissionLetter(criteria)),
	downloadRoomPaymentRecipt: criteria => dispatch(downloadRoomPaymentRecipt(criteria)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);