import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";
import { httpRequest } from "../../../../../ui-utils/api";
import {
  getQueryArg,
  getSelectedTabIndex
} from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { convertDateToEpoch, validateFields } from "../../utils";
import {
  toggleSnackbar,
  toggleSpinner
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getBill } from "../../utils";
import {
    getUserInfo,
  } from "egov-ui-kit/utils/localStorageUtils";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
export const callPGService = async (state, dispatch, item, _businessService) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const consumerCode = getQueryArg(window.location.href, "consumerCode");
  let callbackUrl = `${document.location.origin}${
    process.env.NODE_ENV === "production" ? "/citizen" : ""
  }/rented-properties-citizen/PaymentRedirectPage`;
//   const _businessService = get(state.screenConfiguration.preparedFinalObject, "Licenses[0].businessService", "");
  try {
    const queryObj = [
      {
        key: "tenantId",
        value: tenantId
      },
      {
        key: "consumerCode",
        value: consumerCode
      },
      {
        key: "businessService",
        value: _businessService
      }
    ];

  const billPayload = await getBill(queryObj);

  const taxAmount = Number(get(billPayload, "Bill[0].totalAmount"));
  // let amtToPay =
  //   state.screenConfiguration.preparedFinalObject.AmountType ===
  //   "partial_amount"
  //     ? state.screenConfiguration.preparedFinalObject.AmountPaid
  //     : taxAmount;
  // amtToPay = amtToPay ? Number(amtToPay) : taxAmount;
  const amtToPay = Number(taxAmount)
  if(taxAmount === 0){
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "Amount already Paid !",
        labelKey: "RP_ERR_FEE_AMOUNT_PAID"
      },
      "error"
    ));
  }
  else{
  // if(amtToPay>taxAmount&&!isAdvancePaymentAllowed){
  //   alert("Advance Payment is not allowed");
  //   return;
  // }

  let userInfo = JSON.parse(getUserInfo());

  const user = {
    name: get(billPayload, "Bill[0].payerName"),
    mobileNumber: userInfo.userName,
    // mobileNumber: get(billPayload, "Bill[0].mobileNumber"),
    tenantId
  };
  const businessService = get(billPayload, "Bill[0].businessService")
  let taxAndPayments = [];
  taxAndPayments.push({
    // taxAmount:taxAmount,
    // businessService: businessService,
    billId: get(billPayload, "Bill[0].id"),
    amountPaid: amtToPay
  });

  try {
    const requestBody = {
      Transaction: {
        tenantId,
        txnAmount: amtToPay,
        module: businessService,
        billId: get(billPayload, "Bill[0].id"),
        consumerCode: consumerCode,
        productInfo: "Common Payment",
        gateway: item,
        taxAndPayments,
        user,
        callbackUrl
      }
    };

    const goToPaymentGateway = await httpRequest(
      "post",
      "pg-service/transaction/v1/_create",
      "_create",
      [],
      requestBody
    );


    if (get(goToPaymentGateway, "Transaction.txnAmount") == 0) {
      const srcQuery = `?tenantId=${get(
        goToPaymentGateway,
        "Transaction.tenantId"
      )}&billIds=${get(goToPaymentGateway, "Transaction.billId")}`;

      let searchResponse = await httpRequest(
        "post",
        "collection-services/payments/_search" + srcQuery,
        "_search",
        [],
        {}
      );

      let transactionId = get(
        searchResponse,
        "Payments[0].paymentDetails[0].receiptNumber"
      );

      dispatch(
        setRoute(
          `/rented-properties/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}`
        )
      );
    } else {
      const redirectionUrl =
        get(goToPaymentGateway, "Transaction.redirectUrl") ||
        get(goToPaymentGateway, "Transaction.callbackUrl");
      window.location = redirectionUrl;
    }
  } catch (e) {
    console.log(e);
    if (e.message === "A transaction for this bill has been abruptly discarded, please retry after 30 mins"){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: e.message, labelKey: e.message },
          "error"
        )
      );
    }else{
      moveToFailure(dispatch);
    }
  }
} }catch (error) {
  console.log(error);
}
};
const callBackForOfflinePayment = async (state, dispatch) => {
  let isValid = true;
  isValid = validateFields("components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children", state, dispatch, "pay")
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  let consumerNumber=consumerCode.split("-")[2]
 // const businessService = getQueryArg(window.location, "businessService")
  const businessService = get(state.screenConfiguration.preparedFinalObject,"Owners[0].billingBusinessService") || get(state.screenConfiguration.preparedFinalObject,"DuplicateCopyApplications[0].billingBusinessService")
  || getQueryArg(window.location, "businessService")
  const queryObj = [
    
    {
      key: "consumerCode",
      value: consumerCode
    },
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "businessService",
      value: businessService
    }
  ];

const billPayload = await getBill(queryObj);
const taxAmount = Number(get(billPayload, "Bill[0].totalAmount"));
  if(taxAmount === 0){
    dispatch(toggleSnackbar(
      true,
      {
        labelName: "Amount already Paid !",
        labelKey: "RP_ERR_FEE_AMOUNT_PAID"
      },
      "error"
    ));
  }
  else{
    if(isValid) {
      const applicationNumber = getQueryArg(window.location.href, "consumerCode")
      const tenantId = getTenantId()
      const id=get(state.screenConfiguration.preparedFinalObject,"Owners[0].id")
      const  ownerid=get(state.screenConfiguration.preparedFinalObject,"Owners[0].ownerDetails.ownerId")
      const paymentInfo = get(state.screenConfiguration.preparedFinalObject, "payment")

      
let paths
      if(consumerNumber==="OT"){
          paths="/rp-services/ownership-transfer/_pay-fee"
          const payload = 
          [
          {
            id:id,
            tenantId:tenantId,
            ownerDetails: {
              ownerId:ownerid,
              applicationNumber:applicationNumber,
              transactionId:paymentInfo.transactionNumber,
              bankName:paymentInfo.bankName,
              paymentAmount:paymentInfo.amount,
              paymentMode:paymentInfo.paymentMode,
              transactionDate:convertDateToEpoch(paymentInfo.transactiondate)
            }
          }
          ]
          try {
            const response = await httpRequest("post",
            paths,
            "",
            [],
            { Owners : payload })
            if(!!response) {
              const path = `/rented-properties/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${businessService}`
              dispatch(
                setRoute(path)
              );
            }
          } catch (error) {
            console.log("error", error)
          }
      }
      else if(consumerNumber==="DC"){
           paths ="/rp-services/duplicatecopy/_pay-fee"
           const res = 
           [
           {
             
             tenantId:tenantId,
              
               applicationNumber:applicationNumber,
               transactionId:paymentInfo.transactionNumber,
               bankName:paymentInfo.bankName,
               paymentAmount:paymentInfo.amount,
               paymentMode:paymentInfo.paymentMode,
               transactionDate:convertDateToEpoch(paymentInfo.transactiondate)
           }
           ]
           try {
            const response = await httpRequest("post",
            paths,
            "",
            [],
            { DuplicateCopyApplications : res })
            if(!!response) {
              const path = `/rented-properties/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${applicationNumber}&tenantId=${tenantId}&type=${businessService}`
              dispatch(
                setRoute(path)
              );
            }
          } catch (error) {
            console.log("error", error)
          }
      }

 
    }
  }
 
}
const moveToSuccess = (href, dispatch, receiptNumber) => {
  const applicationNo = getQueryArg(href, "applicationNumber");
  const tenantId = getQueryArg(href, "tenantId");
  const purpose = "pay";
  const status = "success";
  dispatch(
    setRoute(
      `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
    )
  );
};

const moveToFailure = dispatch => {
  const consumerCode = getQueryArg(window.location, "consumerCode");
  const tenantId = getQueryArg(window.location, "tenantId");
  const businessService = getQueryArg(window.location, "businessService")
  const status = "failure";
  const purpose = "pay";
  // const appendUrl =
  //   process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  dispatch(
    setRoute(
      `/rented-properties/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${consumerCode}&tenantId=${tenantId}&businessService=${businessService}`
    )
  );
};

const convertDateFieldToEpoch = (finalObj, jsonPath) => {
  const dateConvertedToEpoch = convertDateToEpoch(
    get(finalObj, jsonPath),
    "daystart"
  );
  set(finalObj, jsonPath, dateConvertedToEpoch);
};

const allDateToEpoch = (finalObj, jsonPaths) => {
  jsonPaths.forEach(jsonPath => {
    if (get(finalObj, jsonPath)) {
      convertDateFieldToEpoch(finalObj, jsonPath);
    }
  });
};

const callBackForPay = async (state, dispatch) => {
  const { href } = window.location;
  let isFormValid = true;

  // --- Validation related -----//

  const selectedPaymentType = get(
    state.screenConfiguration.preparedFinalObject,
    "ReceiptTemp[0].instrument.instrumentType.name"
  );
  const {
    selectedTabIndex,
    selectedPaymentMode,
    fieldsToValidate
  } = getSelectedTabIndex(selectedPaymentType);

  isFormValid =
    fieldsToValidate
      .map(curr => {
        return validateFields(
          `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.capturePaymentDetails.children.cardContent.children.tabSection.props.tabs[${selectedTabIndex}].tabContent.${selectedPaymentMode}.children.${curr}.children`,
          state,
          dispatch,
          "pay"
        );
      })
      .indexOf(false) === -1;
  if (
    get(
      state.screenConfiguration.preparedFinalObject,
      "Bill[0].billDetails[0].manualReceiptDate"
    )
  ) {
    isFormValid = validateFields(
      `components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children.g8Details.children.cardContent.children.receiptDetailsCardContainer.children`,
      state,
      dispatch,
      "pay"
    );
  }

  //------------ Validation End -------------//

  //------------- Form related ----------------//

  const ReceiptDataTemp = get(
    state.screenConfiguration.preparedFinalObject,
    "ReceiptTemp[0]"
  );
  let finalReceiptData = cloneDeep(ReceiptDataTemp);

  allDateToEpoch(finalReceiptData, [
    "Bill[0].billDetails[0].manualReceiptDate",
    "instrument.transactionDateInput"
  ]);
  if (get(finalReceiptData, "instrument.transactionDateInput")) {
    set(
      finalReceiptData,
      "instrument.instrumentDate",
      get(finalReceiptData, "instrument.transactionDateInput")
    );
  }

  if (get(finalReceiptData, "instrument.transactionNumber")) {
    set(
      finalReceiptData,
      "instrument.instrumentNumber",
      get(finalReceiptData, "instrument.transactionNumber")
    );
  }

  if (selectedPaymentType === "Card") {
    //Extra check - remove once clearing forms onTabChange is fixed
    if (
      get(finalReceiptData, "instrument.transactionNumber") !==
      get(finalReceiptData, "instrument.transactionNumberConfirm")
    ) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Transaction numbers don't match !",
            labelKey: "RP_ERR_TRASACTION_NUMBERS_DONT_MATCH"
          },
          "error"
        )
      );
      return;
    }
  }

  //------------- Form End ----------------//

  let ReceiptBody = {
    Receipt: []
  };

  ReceiptBody.Receipt.push(finalReceiptData);

  //---------------- Create Receipt ------------------//
  if (isFormValid) {
    try {
      dispatch(toggleSpinner());
      let response = await httpRequest(
        "post",
        "collection-services/receipts/_create",
        "_create",
        [],
        ReceiptBody,
        [],
        {}
      );
      let receiptNumber = get(
        response,
        "Receipt[0].Bill[0].billDetails[0].receiptNumber",
        null
      );
      dispatch(toggleSpinner());
      moveToSuccess(href, dispatch, receiptNumber);
    } catch (e) {
      dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
      dispatch(toggleSpinner());
      console.log(e);
    }
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName:
            "Please fill all mandatory fields and upload the documents !",
          labelKey: "RP_ERR_FILL_MANDATORY_FIELDS"
        },
        "warning"
      )
    );
  }
};

export const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
      style: { justifyContent: "flex-end" }
    },
    children
  };
};

export const footer = getCommonApplyFooter({
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "RP_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPay
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "PAY"
    },
    visible: process.env.REACT_APP_NAME === "Citizen" ? false : true
  },
  makePayment: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-rented-properties",
    componentPath: "MenuButton",
    visible: process.env.REACT_APP_NAME === "Citizen",
    props: {
      data: {
        label: {labelName : "MAKE PAYMENT" , labelKey :"COMMON_MAKE_PAYMENT"},
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", 
        style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "250px" } },
        menu: []
      }
    },
  },
  paymentButton: {
    componentPath: "Button",
    visible: process.env.REACT_APP_NAME !== "Citizen",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
          submitButtonLabel: getLabel({
            labelName: "MAKE PAYMENT",
            labelKey: "COMMON_MAKE_PAYMENT"
          })
        },
    onClickDefination: {
      action: "condition",
      callBack: callBackForOfflinePayment
    },
  }
});