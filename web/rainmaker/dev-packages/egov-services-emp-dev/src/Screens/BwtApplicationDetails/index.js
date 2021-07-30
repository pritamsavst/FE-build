import React, { Component } from "react";
import axios from "axios";
import { Details } from "modules/common";
import { ComplaintTimeLine } from "modules/common";
import { Comments } from "modules/common";
import { ActionButton } from "modules/common";
import { Icon, MapLocation, ShareButton } from "components";
import CommonShare from "egov-ui-kit/components/CommonShare";
import { Screen } from "modules/common";
import pinIcon from "egov-ui-kit/assets/Location_pin.svg";
import { resetFiles } from "egov-ui-kit/redux/form/actions";
import Button from "@material-ui/core/Button"; 
import ShareIcon from "@material-ui/icons/Share";
import get from "lodash/get";
import isEqual from "lodash/isEqual";  
import { prepareFormData } from "egov-ui-kit/redux/common/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import OSMCCBookingDetails from "../AllApplications/components/OSMCCBookingDetails"
import BwtApplicantDetails from "../AllApplications/components/BwtApplicantDetails"
import BookingDetails from "../AllApplications/components/BookingDetails"
import DocumentPreview from "../AllApplications/components/DocumentPreview"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import DialogContainer from "../../modules/DialogContainer"
import BWTPaymentDetails from "../AllApplications/components/BWTPaymentDetails"
import Footer from "../../modules/footer"
import ActionButtonDropdown from '../../modules/ActionButtonDropdown'
import BwtApplicationDriverDetailsfrom from "../AllApplications/components/BwtApplicationDriverDetails"
  

import jp from "jsonpath";
// import {
// 	getFileUrlFromAPI,
	
// } from "egov-ui-framework/ui-utils/commons";
import {
	getDateFromEpoch,
	mapCompIDToName,
	isImage,
	fetchImages,
	returnSLAStatus,
	getPropertyFromObj,
	findLatestAssignee,
	getTranslatedLabel
} from "egov-ui-kit/utils/commons";
import {
	fetchApplications, fetchPayment, fetchHistory, fetchDataAfterPayment,
	sendMessage,
	sendMessageMedia,downloadReceiptforCG,downloadBWTApplication,downloadWaterTankerReceipt
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";

import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import AssignTODriver from "../AssignToDriver";
import RejectBWTBooking from "../RejectBWTBooking";
import DeliveredBWTBooking from "../DeliveredBWTBooking";
import { convertEpochToDate, getDurationDate,getFileUrlFromAPI} from '../../modules/commonFunction'

import { httpRequest } from "egov-ui-kit/utils/api";
const styles = (theme) => ({

});

const DialogTitle = withStyles(styles)((props) => {
	const { children, classes, onClose, ...other } = props;
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant="h6">{children}</Typography>
			{onClose ? (
				<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	);
});


class BwtApplicationDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openMap: false,
			docFileData: [],
			bookingType: '',
			open: false,
			setOpen: false,
			togglepopup: false,
			actionOnApplication: '',
			actionTittle: '',
			tentantData:'',
			BankName: ''
		};
	};
	componentDidMount = async () => {
		let {
			fetchApplications,
			fetchHistory, fetchDataAfterPayment,
			fetchPayment,
			match,
			resetFiles,
			transformedComplaint,
			prepareFormData,
			userInfo,
			documentMap,
			prepareFinalObject,
			downloadReceiptforCG,downloadBWTApplication,downloadWaterTankerReceipt
		} = this.props;

		prepareFormData("complaints", transformedComplaint);

		const { complaint } = transformedComplaint;
		fetchApplications(
			{
				"applicationNumber": match.params.applicationId, 'uuid': userInfo.uuid,
				"applicationStatus": "",
				"mobileNumber": "", "bookingType": "",
      			"tenantId":userInfo.tenantId
			}
		);
		fetchHistory([
			{ key: "businessIds", value: match.params.applicationId }, { key: "history", value: true }, { key: "tenantId", value: userInfo.tenantId }])

		fetchPayment(
			[{ key: "consumerCode", value: match.params.applicationId }, { key: "businessService", value: "BOOKING_BRANCH_SERVICES.WATER_TANKAR_CHARGES" }, { key: "tenantId", value: userInfo.tenantId }
			])

		fetchDataAfterPayment(
			[{ key: "consumerCodes", value: match.params.applicationId }, { key: "tenantId", value: userInfo.tenantId }
			])

        let  RequestGateWay = [
			{ key: "consumerCode", value: match.params.applicationId },
			{ key: "tenantId", value: userInfo.tenantId }
			];
		  let payloadGateWay = await httpRequest(
			"pg-service/transaction/v1/_search",
			"_search",
			RequestGateWay
			);
		  //Transaction[0].gateway
		 
		 if(payloadGateWay.Transaction.length > 0){
	
let gateWay = payloadGateWay.Transaction[0].gateway; 



prepareFinalObject('GateWayName', gateWay)

this.setState({
   BankName: gateWay
})

}
		
		
		  let mdmsData =  await this.getMdmsTenantsData();
		  this.setState({
		tentantData :mdmsData  
		  })

		let { details } = this.state;

	}

	componentWillReceiveProps = async (nextProps) => {
		
		const { transformedComplaint, prepareFormData } = this.props;
		if (!isEqual(transformedComplaint, nextProps.transformedComplaint)) {
			prepareFormData("complaints", nextProps.transformedComplaint);
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

	downloadReceiptButton = async (mode) => {
	
		await this.downloadReceiptFunction();
	
		
		let documentsPreviewData;
		const {waterTankerPaymentReceipt,userInfo } = this.props;
		
		var documentsPreview = [];
		if (waterTankerPaymentReceipt && waterTankerPaymentReceipt.filestoreIds.length > 0) {
	
			
			 documentsPreviewData=waterTankerPaymentReceipt.filestoreIds[0];
			
			
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
				//doc["name"] = doc.fileStoreId;
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
			
			if(mode==='print'){
	
				var response = await axios.get(documentsPreview[0].link, {
					//responseType: "blob",
					responseType: "arraybuffer",
					
					
					headers: {
						"Content-Type": "application/json",
						Accept: "application/pdf",
					},
				});
			
				const file = new Blob([response.data], { type: "application/pdf" });
				const fileURL = URL.createObjectURL(file);
				var myWindow = window.open(fileURL);
				if (myWindow != undefined) {
					myWindow.addEventListener("load", (event) => {
						myWindow.focus();
						myWindow.print();
					});
				}
	
			}
	
	
			else{
	
				setTimeout(() => {
				
					window.open(documentsPreview[0].link);
				}, 100);
			}
			
			prepareFinalObject('documentsPreview', documentsPreview)
		}
	}
//Payment Receipt
// 
// downloadReceiptButton = async (mode) => {
	
// 	let responseOfPaymentReceipt = await this.downloadReceiptFunction();
// console.log("responseOfPaymentReceipt--",responseOfPaymentReceipt)

// 	setTimeout(async()=>{
// 	let documentsPreviewData;
// 	const { downloadWaterTankerReceipt,userInfo } = this.props;
	
// 	var documentsPreview = [];
// 	if (downloadWaterTankerReceipt && downloadWaterTankerReceipt.filestoreIds.length > 0) {

		
// 		 documentsPreviewData=downloadWaterTankerReceipt.filestoreIds[0];
		
		
// 		documentsPreview.push({
// 			title: "DOC_DOC_PICTURE",
// 			fileStoreId: documentsPreviewData,
// 			linkText: "View",
// 		});
// 		let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
// 		let fileUrls =
// 			fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
		

// 		documentsPreview = documentsPreview.map(function (doc, index) {
// 			doc["link"] =
// 				(fileUrls &&
// 					fileUrls[doc.fileStoreId] &&
// 					fileUrls[doc.fileStoreId].split(",")[0]) ||
// 				"";
// 			//doc["name"] = doc.fileStoreId;
// 			doc["name"] =
// 				(fileUrls[doc.fileStoreId] &&
// 					decodeURIComponent(
// 						fileUrls[doc.fileStoreId]
// 							.split(",")[0]
// 							.split("?")[0]
// 							.split("/")
// 							.pop()
// 							.slice(13)
// 					)) ||
// 				`Document - ${index + 1}`;
// 			return doc;
// 		});
		
// 		if(mode==='print'){

// 			var response = await axios.get(documentsPreview[0].link, {
// 				//responseType: "blob",
// 				responseType: "arraybuffer",
				
				
// 				headers: {
// 					"Content-Type": "application/json",
// 					Accept: "application/pdf",
// 				},
// 			});
// 			console.log("responseData---", response);
// 			const file = new Blob([response.data], { type: "application/pdf" });
// 			const fileURL = URL.createObjectURL(file);
// 			var myWindow = window.open(fileURL);
// 			if (myWindow != undefined) {
// 				myWindow.addEventListener("load", (event) => {
// 					myWindow.focus();
// 					myWindow.print();
// 				});
// 			}

// 		}


// 		else{

// 			setTimeout(() => {
			
// 				window.open(documentsPreview[0].link);
// 			}, 100);
// 		}
		
// 		prepareFinalObject('documentsPreview', documentsPreview)
// 	}
// },1500)
// }

downloadReceiptFunction = async (e) => {
	const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG,downloadReceiptforCG,downloadWaterTankerReceipt, userInfo, paymentDetails,bkDate,
		pdfBankName,bkTime } = this.props;
	const { complaint } = transformedComplaint;

	let quantityAmount = paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails[0].amount;

	let baseAmount = (paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails[0].amount/complaint.quantity)

	var date2 = new Date();

	var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;


	let BookingInfo = [{
		"applicantDetail": {
			"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
			"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
			"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
			"permanentAddress": complaint && complaint.address ? complaint.address : '',
			"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
			"sector": complaint && complaint.sector ? complaint.sector : ''
		},
		"booking": {
			"bkApplicationNumber": complaint && complaint.applicationNo ? complaint.applicationNo : ''
		},
		"paymentInfo": {
			"paymentDate": paymentDetailsForReceipt && convertEpochToDate(paymentDetailsForReceipt.Payments[0].transactionDate, "dayend"),
			"transactionId": paymentDetailsForReceipt && paymentDetailsForReceipt.Payments[0].transactionNumber,
			"bookingPeriod": `${bkDate} , ${bkTime} `,
			"bookingItem": "Online Payment Against Booking of Water Tanker",
			"amount": baseAmount,
			"tax": "0",
			"grandTotal": quantityAmount,
			"wtQuantity":complaint && complaint.quantity ? complaint.quantity : '',
			"wtTotalPayment":quantityAmount,
			"amountInWords": this.NumInWords(
				quantityAmount
			),
			"paymentItemExtraColumnLabel": "Date & Time",
			paymentMode:
				paymentDetailsForReceipt.Payments[0].paymentMode,
			bankName: pdfBankName ? pdfBankName : this.state.BankName,
			receiptNo:
				paymentDetailsForReceipt.Payments[0].paymentDetails[0]
					.receiptNumber,
		},
		payerInfo: {
			payerName: paymentDetailsForReceipt.Payments[0].payerName,
			payerMobile:
				paymentDetailsForReceipt.Payments[0].mobileNumber,
		},
		"generatedBy": {
			"generatedBy": userInfo.name,
			"generatedDateTime":generatedDateTime
		  }
	}
	]
	// downloadReceiptforCG({BookingInfo: BookingInfo})

	downloadWaterTankerReceipt({BookingInfo: BookingInfo})
}


// downloadReceiptFunction = async (e) => {
// 	const { transformedComplaint, paymentDetailsForReceipt, downloadPaymentReceiptforCG,downloadReceiptforCG,downloadWaterTankerReceipt, userInfo, paymentDetails,bkDate,
// 		pdfBankName,bkTime } = this.props;
// 		console.log("propsofPdfPayment--",this.props)
// 		console.log("stateBankName--",this.state.BankName ? this.state.BankName : "NotFound")
// 	const { complaint } = transformedComplaint;
// 	console.log("complaintPayemnet--",complaint)

// 	var date2 = new Date();

// 	var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;


// 	let BookingInfo = [{
// 		"applicantDetail": {
// 			"name": complaint && complaint.applicantName ? complaint.applicantName : 'NA',
// 			"mobileNumber": complaint && complaint.bkMobileNumber ? complaint.bkMobileNumber : '',
// 			"houseNo": complaint && complaint.houseNo ? complaint.houseNo : '',
// 			"permanentAddress": complaint && complaint.address ? complaint.address : '',
// 			"permanentCity": complaint && complaint.villageCity ? complaint.villageCity : '',
// 			"sector": complaint && complaint.sector ? complaint.sector : ''
// 		},
// 		"booking": {
// 			"bkApplicationNumber": complaint && complaint.applicationNo ? complaint.applicationNo : ''
// 		},
// 		"paymentInfo": {
// 			"paymentDate": paymentDetailsForReceipt && convertEpochToDate(paymentDetailsForReceipt.Payments[0].transactionDate, "dayend"),
// 			"transactionId": paymentDetailsForReceipt && paymentDetailsForReceipt.Payments[0].transactionNumber,
// 			"bookingPeriod": `${bkDate} , ${bkTime} `,
// 			"bookingItem": "Online Payment Against Booking of Water Tanker",
// 			"amount": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails[0].amount,
// 			// "tax": paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails.filter(
// 			// 	(el) => el.taxHeadCode.includes("TAX")
// 			// )[0].amount,
// 			"grandTotal": paymentDetailsForReceipt.Payments[0].totalAmountPaid,
// 			"amountInWords": this.NumInWords(
// 				paymentDetailsForReceipt.Payments[0].totalAmountPaid
// 			),
// 			"paymentItemExtraColumnLabel": "Date & Time",
// 			paymentMode:
// 				paymentDetailsForReceipt.Payments[0].paymentMode,
// 			bankName: pdfBankName ? pdfBankName : this.state.BankName,
// 			receiptNo:
// 				paymentDetailsForReceipt.Payments[0].paymentDetails[0]
// 					.receiptNumber,
// 		},
// 		payerInfo: {
// 			payerName: paymentDetailsForReceipt.Payments[0].payerName,
// 			payerMobile:
// 				paymentDetailsForReceipt.Payments[0].mobileNumber,
// 		},
// 		"generatedBy": {
// 			"generatedBy": userInfo.name,
// 			"generatedDateTime":generatedDateTime
// 		  }
// 	}
// 	]
// 	// downloadReceiptforCG({BookingInfo: BookingInfo})
// 	console.log("requestBodyOfPayment--",BookingInfo)
// 	downloadWaterTankerReceipt({BookingInfo: BookingInfo})
// }
//Payment Receipt

//ApplicationDownload
// 

downloadApplicationMCCButton = async (mode) => {

	await this.downloadApplicationFunction();
	setTimeout(async()=>{
	
	 const {DownloadBWTApplicationDetails,userInfo}=this.props;
   //  let fileStoreId=DownloadBWTApplicationDetails&&DownloadBWTApplicationDetails.filestoreIds[0];
	
		 var documentsPreview = [];
		 let documentsPreviewData;
		 if (DownloadBWTApplicationDetails && DownloadBWTApplicationDetails.filestoreIds.length > 0) {	
			 documentsPreviewData = DownloadBWTApplicationDetails.filestoreIds[0];
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
					 //doc["name"] = doc.fileStoreId;
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
				 
				 if(mode==='print'){

					var response = await axios.get(documentsPreview[0].link, {
						//responseType: "blob",
						responseType: "arraybuffer",
						
						
						headers: {
							"Content-Type": "application/json",
							Accept: "application/pdf",
						},
					});
			
					const file = new Blob([response.data], { type: "application/pdf" });
					const fileURL = URL.createObjectURL(file);
					var myWindow = window.open(fileURL);
					if (myWindow != undefined) {
						myWindow.addEventListener("load", (event) => {
							myWindow.focus();
							myWindow.print();
						});
					}

				}


				else{

					setTimeout(() => {
					
						window.open(documentsPreview[0].link);
					}, 100);
				}
				
				prepareFinalObject('documentsPreview', documentsPreview)
			}
		},1500)
   }
   
downloadApplicationFunction = async (e) => {    
	const { transformedComplaint,paymentDetails,downloadApplicationforCG,paymentDetailsForReceipt,userInfo,bkDate,
		bkTime,bookingForDate,
		bookingForTime } = this.props;
	const {complaint} = transformedComplaint;

	let PdfStatus;
if(complaint.status){
	if(complaint.status == "PENDINGASSIGNMENTDRIVER"){
		PdfStatus = "Pending Assign to Driver"
	}
	if(complaint.status == "PENDINGUPDATE"){
		PdfStatus = "Pending for Update"
	}
	if(complaint.status == "DELIVERED"){
		PdfStatus = "Processed"
	}
}
	const { createWaterTankerApplicationData,downloadBWTApplication } = this.props;
    let applicationDetails = createWaterTankerApplicationData ? createWaterTankerApplicationData.data : '';
	let paymentData = paymentDetails;

	let quantityAmount = paymentDetailsForReceipt.Payments[0].paymentDetails[0].bill.billDetails[0].billAccountDetails[0].amount;

	let baseAmount = (paymentData.billDetails[0].billAccountDetails.filter(
		(el) => el.taxHeadCode.includes("WATER_TANKAR_CHARGES_BOOKING_BRANCH")
	)[0].amount/complaint.quantity)


	var date2 = new Date();

	var generatedDateTime = `${date2.getDate()}-${date2.getMonth() + 1}-${date2.getFullYear()}, ${date2.getHours()}:${date2.getMinutes() < 10 ? "0" : ""}${date2.getMinutes()}`;
	
    let BookingInfo = [
      {
        applicantDetail: {
			name: complaint.applicantName,
			mobileNumber: complaint.bkMobileNumber,
			houseNo: complaint.houseNo,
			permanentAddress: complaint.address,
			permanentCity: this.state.tentantData,
			sector: complaint.sector,
			email: complaint.bkEmail,
			fatherName: complaint.bkFatherName ?complaint.bkFatherName:'NA',
			DOB: null,
		},
        "bookingDetail": {
          "applicationNumber": complaint.applicationNo,
          "name": complaint.applicantName,
          "mobileNumber":complaint.bkMobileNumber,
          "email": complaint.bkEmail,
          "houseNo":complaint.houseNo,
          "locality": complaint.sector,
          "completeAddress": complaint.address,
          "applicationDate": complaint.dateCreated,
          "propertyType": complaint.residentialCommercial,
          "date": bookingForDate,
          "time": bkTime,
          "applicationStatus": PdfStatus,
          "applicationType": complaint.bkStatus
        },
        // feeDetail: {
		// 	baseCharge:
		// 		paymentData === undefined
		// 			? null
		// 			: paymentData.billDetails[0].billAccountDetails.filter(
		// 				(el) => el.taxHeadCode.includes("WATER_TANKAR_CHARGES_BOOKING_BRANCH")
		// 			)[0].amount,
		// 	totalAmount: grandTotal,
		// 			"wtQuantity":complaint.quantity,
		// 			"wtTotalPayment":grandTotal			
		// },
		feeDetail: {
			baseCharge: baseAmount,
			totalAmount: quantityAmount,
			"wtQuantity":complaint.quantity,
			"wtTotalPayment":quantityAmount
		},
        "generatedBy": {
		  "generatedBy": userInfo.name,
		  "generatedDateTime":generatedDateTime
        }
      }
    ]

    downloadBWTApplication({ BookingInfo: BookingInfo })
    
  };
//ApplicationDownload

	btnOneOnClick = (value, complaintNo) => {
		
		if (value == 'APPROVED') {
			this.setState({
				actionTittle: "Assign To Driver"
			})
		} else if (value == 'REJECTED') {
			this.setState({
				actionTittle: "Reject Application"
			})
		} else if (value == 'DELIVERED') {
			this.setState({
				actionTittle: "Deliver Application"
			})
		}
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: value
		})
	};
	btnTwoOnClick = (complaintNo, label) => {
		//Action for second button
		let { history } = this.props;
		switch (label) {
			case "ES_COMMON_ASSIGN":
				history.push(`/assign-complaint/${complaintNo}`);
				break;
			case "ES_COMMON_REASSIGN":
				history.push(`/reassign-complaint/${complaintNo}`);
				break;
			case "BK_MYBK_RESOLVE_MARK_RESOLVED":
				history.push(`/booking-resolved/${complaintNo}`);
				break;
		}
	};



	handleClickOpen = () => {
		this.setState({
			open: true
		})

	};
	handleClose = () => {
		this.setState({
			open: false
		})
	};

	assignToDiver = (value) => {
		this.setState({
			togglepopup: !this.state.togglepopup,
			actionOnApplication: value
		})
		let { history } = this.props;
		// history.push(`/egov-services/assignto-driver/${complaintNo}`);
	}
	callApiDorData = async (e) => {
		const { documentMap,userInfo } = this.props;
		var documentsPreview = [];
		// const {documentMap}=this.props;
		if (documentMap && Object.keys(documentMap).length > 0) {
			let keys = Object.keys(documentMap);
			let values = Object.values(documentMap);
			let id = keys[0],
				fileName = values[0];

			documentsPreview.push({
				title: "DOC_DOC_PICTURE",
				fileStoreId: id,
				linkText: "View",
			});
			let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
			let fileUrls =
				fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
			


			//  window.open(response.file);
			

			documentsPreview = documentsPreview.map(function (doc, index) {
				doc["link"] =
					(fileUrls &&
						fileUrls[doc.fileStoreId] &&
						fileUrls[doc.fileStoreId].split(",")[0]) ||
					"";
				//doc["name"] = doc.fileStoreId;
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
			
			prepareFinalObject('documentsPreview', documentsPreview)
		}



	}

 getMdmsTenantsData = async () => {
		let tenantId = getTenantId().split(".")[0];
		let mdmsBody = {
			MdmsCriteria: {
				tenantId: tenantId,
				moduleDetails: [
					{
						moduleName: "tenant",
						masterDetails: [
							{
								name: "tenants",
							},
						],
					}
				],
			},
		};
		try {
			let payload = await httpRequest(
				"post",
				"/egov-mdms-service/v1/_search",
				"_search",
				[],
				mdmsBody
			);
			return payload.MdmsRes.tenant 
		} catch (e) {
			console.log(e);
		}
	};

	render() {
		const dropbordernone = {
			float: "right",
			paddingRight: "20px"

		};
		let { shareCallback } = this;
		let { comments, openMap } = this.state;
		let { complaint, timeLine } = this.props.transformedComplaint;
		let { documentMap } = this.props;
		let { historyApiData, paymentDetails, match, userInfo,
			bookingForTime,bookingForDate} = this.props;
		let {
			role,
			serviceRequestId,
			history,
			isAssignedToEmployee,
			reopenValidChecker
		} = this.props;
		let btnOneLabel = "";
		let btnTwoLabel = "";
		let action;
		let complaintLoc = {};
		if (complaint) {
			if (role === "employee") {
				btnOneLabel = "BK_MYBK_REJECT_BUTTON";
				btnTwoLabel = "BK_MYBK_RESOLVE_MARK_RESOLVED";	
			}
		}
		if (timeLine && timeLine[0]) {
			action = timeLine[0].action;
		}
		return (
			<div>
				<Screen>
					{complaint && !openMap && (
						<div>
							<div className="form-without-button-cont-generic">

							<div className="container" >
									<div className="row">
										<div className="col-12 col-md-6" style={{ fontSize: 'x-large' }}>
											Application Details
										</div>
										<div className="col-12 col-md-6 row">
											<div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Download ", labelKey: "BK_COMMON_DOWNLOAD_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "cloud_download",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
													menu:(complaint.bkStatus=="Normal Request(Paid Booking)")?[{
														label: {
															labelName: "Receipt",
															labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
														},
														leftIcon: "receipt",

														link: () => this.downloadReceiptButton('Receipt'),
				
													},
													{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]:
													[{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('state', "dispatch", 'REJECT'),
														leftIcon: "assignment"
													}]
												}} />
											</div>
											<div class="col-12 col-md-6 col-sm-3" >
												<ActionButtonDropdown data={{
													label: { labelName: "Print", labelKey: "BK_COMMON_PRINT_ACTION" },
													rightIcon: "arrow_drop_down",
													leftIcon: "print",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, color: "#FE7A51", height: "60px" }, className: "tl-download-button"
													},
													menu: (complaint.bkStatus=="Normal Request(Paid Booking)")?[{
														label: {
															labelName: "Receipt",
															labelKey: "BK_MYBK_DOWNLOAD_RECEIPT"
														},
														leftIcon: "receipt",

														link: () => this.downloadReceiptButton('print'),
				
													},
													{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('print'),
														leftIcon: "assignment"
													}]:
													[{
														label: {
															labelName: "Application",
															labelKey: "BK_MYBK_PRINT_APPLICATION"
														},
														link: () => this.downloadApplicationMCCButton('print'),
														leftIcon: "assignment"
													}]
												}} />

											</div>
										</div>
									</div>
								</div>


							<OSMCCBookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
								/>

                                <BwtApplicantDetails
									{...complaint}
								/>

								<BookingDetails
									{...complaint}
									historyApiData={historyApiData && historyApiData}
									bookingForDate={bookingForDate && bookingForDate}
                                    bookingForTime={bookingForTime && bookingForTime}
								/>
								{complaint.bkStatus && (complaint.bkStatus).includes("Paid") &&
									<BWTPaymentDetails
									{...complaint}
										paymentDetails={paymentDetails && paymentDetails}
									/>

								}
								{complaint && (complaint.status != 'PENDINGASSIGNMENTDRIVER' || complaint.status != 'REJECTED') &&
									<BwtApplicationDriverDetailsfrom
										{...complaint}

									/>
								}
								<Comments
									comments={comments}
									role={role}
									isAssignedToEmployee={isAssignedToEmployee}
								/>
							</div>
							<div style={{
								paddingTop: "30px",
								paddingRight: "30px"
							}}>
								{
									(role === "employee" &&
										(
											(complaint.status == "PENDINGASSIGNMENTDRIVER" &&

												<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
													label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
													rightIcon: "arrow_drop_down",
													props: {
														variant: "outlined",
														style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "48px", width: "250px" }
													},

													menu: !(complaint.bkStatus=="Normal Request(Paid Booking)")? [{
														label: {
															labelName: "Approve",
															labelKey: "BK_MYBK_ASSIGN_TO_DRIVER_ACTION_BUTTON"
														},

														link: () => this.btnOneOnClick('APPROVED', serviceRequestId)
													},
													{
														label: {
															labelName: "REJECT",
															labelKey: "BK_MYBK_REJECT_ACTION_BUTTON"
														},

														link: () => this.btnOneOnClick('REJECTED', serviceRequestId)
													}] : [{
														label: {
															labelName: "Approve",
															labelKey: "BK_MYBK_ASSIGN_TO_DRIVER_ACTION_BUTTON"
														},

														link: () => this.btnOneOnClick('APPROVED', serviceRequestId)
													}]
												}} />}></Footer>


											)
										)
									)}

								{(role === "employee" &&
									(
										(complaint.status == "PENDINGUPDATE" &&

											<Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={<ActionButtonDropdown data={{
												label: { labelName: "TAKE ACTION ", labelKey: "BK_COMMON_TAKE_ACTION" },
												rightIcon: "arrow_drop_down",
												props: {
													variant: "outlined",
													style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "48px", width: "250px" }
												},
												menu: [{
													label: {
														labelName: "Approve",
														labelKey: "BK_MYBK_DELIVERED_ACTION_BUTTON"
													},

													link: () => this.btnOneOnClick('DELIVERED', serviceRequestId)
												}]
											}} />}></Footer>

										)
									)
								)}	


								<DialogContainer
									toggle={this.state.togglepopup}
									actionTittle={this.state.actionTittle}
									togglepopup={this.btnOneOnClick}
									maxWidth={'md'}
									children={this.state.actionOnApplication == 'APPROVED' ? <AssignTODriver
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : this.state.actionOnApplication == 'REJECTED' ? <RejectBWTBooking
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : this.state.actionOnApplication == 'DELIVERED' ? <DeliveredBWTBooking
										applicationNumber={match.params.applicationId}
										userInfo={userInfo}
									/> : ''}
								/>


							</div>
						</div>
					)}
				</Screen>
			</div>
		);
	}
}

const roleFromUserInfo = (roles = [], role) => {
	const roleCodes = roles.map((role, index) => {
		return role.code;
	});
	return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
		? true
		: false;
};


let gro = "";

const mapStateToProps = (state, ownProps) => {
	const { bookings, common, auth, form } = state;
	const { applicationData } = bookings;
	const { waterTankerPaymentReceipt,DownloadBWTApplicationDetails} = bookings;
	
	const { id } = auth.userInfo;
	const { citizenById } = common || {};

	const { employeeById, departmentById, designationsById, cities } =
		common || {};
	// const { categoriesById } = bookings;
	const { userInfo } = state.auth;

	let pdfBankName = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.GateWayName:"wrongNumber";  

  

	const serviceRequestId = ownProps.match.params.applicationId;
	let selectedComplaint = applicationData ? applicationData.bookingsModelList[0] : ''

	let businessService = applicationData ? applicationData.businessService : '';
	let bookingDocs;

	let bkTime = selectedComplaint ? selectedComplaint.bkTime : "NoTimeFound"

	
	let bkDate =  selectedComplaint ? selectedComplaint.bkDate : "NoTimeFound"


	let bookingForDate = selectedComplaint.bkDate != null ? selectedComplaint.bkDate : 'NA'

	let bookingForTime = selectedComplaint.bkTime != null ? selectedComplaint.bkTime : 'NA'
 

	let documentMap = applicationData && applicationData.documentMap ? applicationData.documentMap : '';
	const { HistoryData } = bookings;


	let historyObject = HistoryData ? HistoryData : ''
	const { paymentData } = bookings;
	const { fetchPaymentAfterPayment } = bookings;

let paymentDetailsForReceipt = fetchPaymentAfterPayment;
	let paymentDetails;
	paymentDetails = fetchPaymentAfterPayment && fetchPaymentAfterPayment.Payments[0] && fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;

	let historyApiData = {}
	if (historyObject) {
		historyApiData = historyObject;
	}

	// const role =
	// 	roleFromUserInfo(userInfo.roles, "GRO") ||
	// 		roleFromUserInfo(userInfo.roles, "DGRO")
	// 		? "ao"
	// 		: roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER1") ||
	// 			roleFromUserInfo(userInfo.roles, "ESCALATION_OFFICER2")
	// 			? "eo"
	// 			: roleFromUserInfo(userInfo.roles, "CSR")
	// 				? "csr"
	// 				: "employee";

	const role = "employee";

	let isAssignedToEmployee = true;
	if (selectedComplaint) {

		let details = {
			applicantName: selectedComplaint.bkApplicantName,
			status: selectedComplaint.bkApplicationStatus,
			applicationNo: selectedComplaint.bkApplicationNumber,
			address: selectedComplaint.bkCompleteAddress,
			bookingType: selectedComplaint.bkBookingType,
			sector: selectedComplaint.bkSector,
			bkEmail: selectedComplaint.bkEmail,
			bkMobileNumber: selectedComplaint.bkMobileNumber,
			houseNo: selectedComplaint.bkHouseNo,
			dateCreated: selectedComplaint.bkDateCreated,
			areaRequired: selectedComplaint.bkAreaRequired,
			bkDuration: selectedComplaint.bkDuration,
			bkCategory: selectedComplaint.bkCategory,
			constructionType: selectedComplaint.bkConstructionType,
			villageCity: selectedComplaint.bkVillCity,
			residentialCommercial: selectedComplaint.bkType,
			bkStatus: selectedComplaint.bkStatus,
			businessService: businessService,
			driverName: selectedComplaint ? selectedComplaint.bkDriverName : "NA",
			driverMobileNumber: selectedComplaint ? selectedComplaint.bkContactNo : 'NA',
			approverName: selectedComplaint ? selectedComplaint.bkApproverName : 'NA',
			time: selectedComplaint.bkTime,
			date: selectedComplaint.bkDate,		
			quantity: selectedComplaint.quantity
		}



		let transformedComplaint;
		if (applicationData != null && applicationData != undefined) {

			transformedComplaint = {
				complaint: details,
			};
		}

		const { localizationLabels } = state.app;
		const complaintTypeLocalised = getTranslatedLabel(
			`SERVICEDEFS.${transformedComplaint.complaint.complaint}`.toUpperCase(),
			localizationLabels
		);
		return {
			paymentDetails,
			pdfBankName,
			historyApiData,
			waterTankerPaymentReceipt,
			documentMap,
			DownloadBWTApplicationDetails,
			form,
			transformedComplaint,
			role,
			serviceRequestId,
			isAssignedToEmployee,
			complaintTypeLocalised,
			paymentDetailsForReceipt,
			bkDate,
			bkTime,
			bookingForDate,
            bookingForTime
			
		};
	} else {
		return {
			paymentDetails,
			pdfBankName,
			historyApiData,
			waterTankerPaymentReceipt,
			DownloadBWTApplicationDetails,
			documentMap,
			paymentDetailsForReceipt,
			form,
			transformedComplaint: {},
			role,
			serviceRequestId,
			isAssignedToEmployee,
			bkDate,
			bkTime,
			bookingForDate,
            bookingForTime
		};
	}
};

const mapDispatchToProps = dispatch => {
	return {
		fetchApplications: criteria => dispatch(fetchApplications(criteria)),
		fetchPayment: criteria => dispatch(fetchPayment(criteria)),
		fetchDataAfterPayment: criteria => dispatch(fetchDataAfterPayment(criteria)),
		downloadReceiptforCG: criteria => dispatch(downloadReceiptforCG(criteria)), //downloadWaterTankerReceipt
		downloadWaterTankerReceipt: criteria => dispatch(downloadWaterTankerReceipt(criteria)),
		downloadBWTApplication: criteria => dispatch(downloadBWTApplication(criteria)),
		fetchHistory: criteria => dispatch(fetchHistory(criteria)),
		resetFiles: formKey => dispatch(resetFiles(formKey)),
		sendMessage: message => dispatch(sendMessage(message)),
		sendMessageMedia: message => dispatch(sendMessageMedia(message)),
		prepareFormData: (jsonPath, value) =>
			dispatch(prepareFormData(jsonPath, value)),
		prepareFinalObject: (jsonPath, value) =>
			dispatch(prepareFinalObject(jsonPath, value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BwtApplicationDetails);
