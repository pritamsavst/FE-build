import { getRentSummaryCard, getCommonApplyFooter ,convertDateToEpoch} from "../utils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { get } from "lodash";
const { getCommonHeader, getCommonCard, getCommonContainer, getTextField,getDateField,getSelectField,getPattern, getCommonGrayCard, getCommonTitle, getLabel } = require("egov-ui-framework/ui-config/screens/specs/utils");
const { transitSiteHeader, transitNumberLookUp, colonyFieldConfig, pincodeField } = require("./applyResource/propertyDetails");
const { getRentPaymentPropertyDetails } = require("../../../../ui-utils/apply");
const { ownerNameField } = require("./applyResource/rentHolderDetails");
import { httpRequest } from "../../../../ui-utils";
import { BILLING_BUSINESS_SERVICE_RENT, ONLINE, OFFLINE } from "../../../../ui-constants";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { validateFields,getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import {getColonyTypes} from "../rented-properties/apply"
import moment from 'moment'
const header = process.env.REACT_APP_NAME === "Citizen" ?
getCommonHeader({
    labelName: "Online Rent Payment",
    labelKey: "RP_ONLINE_RENT_PAYMENT_HEADER"
})
: getCommonHeader({
    labelName: "Offline Rent Payment",
    labelKey: "RP_OFFLINE_RENT_PAYMENT_HEADER"
  });
  const offlinePaymentDetailsHeader = getCommonTitle(
    {
        labelName: "Payment Details",
        labelKey: "RP_PAYMENT_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

const transitNumberField = {
  ...transitNumberLookUp,
  pattern:"",
  maxLength:"",
  jsonPath: "property.transitNumber",
  iconObj: {
    ...transitNumberLookUp.iconObj,
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        getRentPaymentPropertyDetails(state, dispatch);
      }
    }
  },
  afterFieldChange: (action, state, dispatch)=> { 
    dispatch(prepareFinalObject("Properties", []))
    dispatch(handleField(
      "payment",
      "components.div.children.detailsContainer.children.rentSummaryDetails",
      "visible",
      false
    ))
    dispatch(
      prepareFinalObject(
        "Properties[0].propertyDetails.address.colony",
        ""
      )
    )
    dispatch(
      prepareFinalObject(
        "Properties[0].propertyDetails.address.pincode",
        ""
      )
    )
    dispatch(
      prepareFinalObject(
        "Properties[0].owners[0].ownerDetails.name",
        ""
      )
    )
  }
}

const propertyDetails = getCommonCard({
  header: transitSiteHeader,
  detailsContainer: getCommonContainer({
    transitNumber: getTextField(transitNumberField),
    colony: getSelectField({
      ...colonyFieldConfig,
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      props: {
        ...colonyFieldConfig.props,
        disabled: true
      },
      required: false,
      jsonPath: "Properties[0].propertyDetails.address.colony"
    }),
    pincode: getTextField({
      ...pincodeField,
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      props: {
        ...pincodeField.props,
        disabled: true
      },
      required: false,
      jsonPath: "Properties[0].propertyDetails.address.pincode"
    }),
    ownername: getTextField({...ownerNameField,
      placeholder: {
        labelName: "",
        labelKey: ""
      },
      props: {
        ...ownerNameField.props,
        disabled: true
      },
      required: false
    })
  })
})

const rentSummaryHeader = getCommonTitle({
  labelName: "Rent Summary",
  labelKey: "RP_RENT_SUMMARY_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const rentSummary = getCommonGrayCard({
  rentSection: getRentSummaryCard({
    sourceJsonPath: "Properties[0].rentSummary"
  })
});

const rentSummaryDetails = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
  rentCard: getCommonCard({
    header: rentSummaryHeader,
    detailsContainer: rentSummary
  })
  },
  visible: false
}

const paymentInfoHeader = getCommonTitle({
  labelName: "Payment Info",
  labelKey: "RP_PAYMENT_INFO_HEADER"
}, {
  style: {
    marginBottom: 18,
    marginTop: 18
  }
})

const amountField = {
  label: {
    labelName: "Amount",
    labelKey: "RP_AMOUNT_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Amount",
    labelKey: "RP_ENTER_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  pattern: getPattern("AmountFeild"),
  required: true,
  minLength: 1,
  maxLength: 7,
  jsonPath: "paymentInfo.amount",
  errorMessage: "RP_ERR_AMOUNT_FIELD",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 7) {
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_AMOUNT_FIELD_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_AMOUNT_FIELD_MAXLENGTH"
            )
        )
    }
    else {
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_AMOUNT_FIELD"
            )
        )
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_AMOUNT_FIELD"
            )
        )
    }
  }
}
const transactiondate = {
  label: {
      labelName: "Date of Payment",
      labelKey: "RP_DATE_TRANSACTION_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment",
      labelKey: "RP_DATE_TRANSACTION_PLACEHOLDER"
  },
  required: true,
  visible:false,
  errorMessage:"RP_ERR_TRANSACTION_DATE",
  pattern: getPattern("Date"),
  jsonPath: "paymentInfo.transactiondate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}
const transactiondatefield = {
  label: {
      labelName: "Date of Payment",
      labelKey: "RP_DATE_TRANSACTION_LABEL"
  },
  placeholder: {
      labelName: "Enter Date of Payment",
      labelKey: "RP_DATE_TRANSACTION_PLACEHOLDER"
  },
  required: true,
  visible:false,
  errorMessage:"RP_ERR_TRANSACTION_DATE",
  pattern: getPattern("Date"),
  jsonPath: "payment.transactiondate",
  props: {
      inputProps: {
          max: getTodaysDateInYMD()
      }
  }
}
const bankNameField = {
  label: {
    labelName: "Bank Name",
    labelKey: "RP_BANK_NAME_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Bank Name",
    labelKey: "RP_ENTER_BANK_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"RP_ERR_BANK_NAME_FIELD",
  minLength: 1,
  maxLength: 40,
  jsonPath: "paymentInfo.bankName",
  visible: false,
  // visible: process.env.REACT_APP_NAME !== "Citizen",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 40) {
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_BANK_NAME_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_BANK_NAME_MAXLENGTH"
            )
        )
     }
    else {
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_BANK_NAME_FIELD"
            )
        )
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_BANK_NAME_FIELD"
            )
        )
    }
  
}
}

const transactionNumberField = {
  label: {
    labelName: "Transaction/Cheque/DD No",
    labelKey: "RP_TRANSACTION_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Transaction/Cheque/DD No",
    labelKey: "RP_ENTER_TRANSACTION_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"RP_ERR_TRANSACTION_NUMBER_FIELD",
  minLength: 1,
  maxLength: 40,
  jsonPath: "paymentInfo.transactionNumber",
  visible: false,
  // visible: process.env.REACT_APP_NAME !== "Citizen",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 40) {
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_MAXLENGTH"
            )
        )
    }
    else {
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_FIELD"
            )
        )
        dispatch(
            handleField(
              "payment",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_FIELD"
            )
        )
    }
  }
}

const paymentMode = {
  label: {
    labelName: "Payment Mode",
    labelKey: "RP_PAYMENT_MODE_LABEL",
  },
  placeholder: {
    labelName: "Select Payment Mode",
    labelKey: "RP_PAYMENT_MODE_PLACEHOLDER",
  },
  required: true,
  visible: process.env.REACT_APP_NAME !== "Citizen",
  optionValue: "value",
  optionLabel: "label",
  jsonPath: "paymentInfo.paymentMode",
  data: [
    {
      label: "RP_PAYMENT_CASH",
      value: "CASH",
    },
    {
      label: "RP_PAYMENT_DD",
      value: "DD",
    },
    {
      label: "RP_PAYMENT_CHEQUE",
      value: "CHEQUE",
    },
    // {
    //   label: "RP_PAYMENT_DIRECT_PAYMENT",
    //   value: "OFFLINE_NEFT",
    // }
  ],
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  errorMessage: "RP_ERR_PAYMENT_TYPE_FIELD",
  afterFieldChange: (action, state, dispatch) => {
    const screenName = "payment"
    const commonPath = "components.div.children.detailsContainer.children.paymentInfo.children.cardContent.children.detailsContainer.children"
    dispatch(handleField(
        screenName,
        `${commonPath}.bankName`,
        "visible",
        action.value !== "CASH" && action.value !== "OFFLINE_NEFT" && action.value !== "OFFLINE_RTGS"
      )
    )
    dispatch(handleField(
      screenName,
      `${commonPath}.transactiondate`,
      "visible",
      action.value === "OFFLINE_NEFT" || action.value == "OFFLINE_RTGS"
    )
  )
    dispatch(handleField(
        screenName,
        `${commonPath}.transactionNumber`,
        "visible",
        action.value !== "CASH"
      )
    )
      dispatch(
        handleField(
          screenName,
          `${commonPath}.transactionNumber.props.label`,
          "labelKey",
          action.value === "DD"
            ? "RP_DD_NUMBER_LABEL"
            : action.value === "OFFLINE_NEFT"
            ?"RP_DIRECT_BANK_LABEL"
            : action.value === "OFFLINE_RTGS"
            ?"RP_DIRECT_BANK_LABEL"
            :"RP_CHEQUE_NUMBER_LABEL"
        )
      );
      dispatch(
        handleField(
          screenName,
          `${commonPath}.transactionNumber.props.placeholder`,
          "labelKey",
          action.value === "DD"
            ? "RP_DD_NUMBER_PLACEHOLDER"
            : action.value === "OFFLINE_NEFT"
            ?"RP_DIRECT_BANK_PLACEHOLDER"
            : action.value === "OFFLINE_RTGS"
            ?"RP_DIRECT_BANK_PLACEHOLDER"
            : "RP_CHEQUE_NUMBER_PLACEHOLDER"
        )
      );
  }
};

const paymentInfo = getCommonCard({
  header: paymentInfoHeader,
  detailsContainer: getCommonContainer({
    type: getSelectField(paymentMode),
    amount: getTextField(amountField),
    bankName: getTextField(bankNameField),
    transactiondate:getDateField(transactiondate),
    transactionNumber: getTextField(transactionNumberField),
  })
})
const paymentInfoOffline = getCommonCard({
  header: paymentInfoHeader,
  detailsContainer: getCommonContainer({
    amount: getTextField(amountField),
  })
})
const paymenttype = {
  label: {
    labelName: "Payment Mode",
    labelKey: "RP_PAYMENT_MODE_LABEL",
  },
  placeholder: {
    labelName: "Select Payment Mode",
    labelKey: "RP_PAYMENT_MODE_PLACEHOLDER",
  },
  required: true,
  optionValue: "value",
  optionLabel: "label",
  jsonPath: "payment.paymentMode",
  data: [
    {
      label: "RP_PAYMENT_CASH",
      value: "CASH",
    },
    {
      label: "RP_PAYMENT_DD",
      value: "DD",
    },
    {
      label: "RP_PAYMENT_CHEQUE",
      value: "CHEQUE",
    },
    // {
    //   label: "RP_PAYMENT_DIRECT_PAYMENT",
    //   value: "OFFLINE_NEFT",
    // }
  ],
  gridDefination: {
    xs: 12,
    sm: 6,
  },
  errorMessage: "RP_ERR_PAYMENT_TYPE_FIELD",
  afterFieldChange: (action, state, dispatch) => {
    const screenName = "pay"
    const commonPath = "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children"
    dispatch(handleField(
        screenName,
        `${commonPath}.bankName`,
        "visible",
        action.value !== "CASH" && action.value !== "OFFLINE_NEFT" && action.value !== "OFFLINE_RTGS"
      )
    )
    dispatch(handleField(
      screenName,
      `${commonPath}.transationdate`,
      "visible",
      action.value === "OFFLINE_NEFT" || action.value == "OFFLINE_RTGS"
    )
  )
    dispatch(handleField(
        screenName,
        `${commonPath}.transactionId`,
        "visible",
        action.value !== "CASH"
      )
    )
      dispatch(
        handleField(
          screenName,
          `${commonPath}.transactionId.props.label`,
          "labelKey",
          action.value === "DD"
            ? "RP_DD_NUMBER_LABEL"
            : action.value === "OFFLINE_NEFT"
            ?"RP_DIRECT_BANK_LABEL"
            : action.value === "OFFLINE_RTGS"
            ?"RP_DIRECT_BANK_LABEL"
            : "RP_CHEQUE_NUMBER_LABEL"
        )
      );
      dispatch(
        handleField(
          screenName,
          `${commonPath}.transactionId.props.placeholder`,
          "labelKey",
          action.value === "DD"
            ? "RP_DD_NUMBER_PLACEHOLDER"
            : action.value === "OFFLINE_NEFT"
            ?"RP_DIRECT_BANK_PLACEHOLDER"
            : action.value === "OFFLINE_RTGS"
            ?"RP_DIRECT_BANK_PLACEHOLDER"
            : "RP_CHEQUE_NUMBER_PLACEHOLDER"
        )
      );
  }
};

const bankName = {
  label: {
    labelName: "Bank Name",
    labelKey: "RP_BANK_NAME_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Bank Name",
    labelKey: "RP_ENTER_BANK_NAME_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"RP_ERR_BANK_NAME_FIELD",
  minLength: 1,
  maxLength: 40,
  jsonPath: "payment.bankName",
  visible: false,
  // visible: process.env.REACT_APP_NAME !== "Citizen",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 40) {
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_BANK_NAME_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_BANK_NAME_MAXLENGTH"
            )
        )
     }
    else {
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_BANK_NAME_FIELD"
            )
        )
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_BANK_NAME_FIELD"
            )
        )
    }
  
}
}

const transactionId = {
  label: {
    labelName: "Transaction/Cheque/DD No",
    labelKey: "RP_TRANSACTION_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Transaction/Cheque/DD No",
    labelKey: "RP_ENTER_TRANSACTION_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"RP_ERR_TRANSACTION_NUMBER_FIELD",
  minLength: 1,
  maxLength: 40,
  jsonPath: "payment.transactionNumber",
  visible: false,
  // visible: process.env.REACT_APP_NAME !== "Citizen",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 40) {
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_MAXLENGTH"
            )
        )
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_MAXLENGTH"
            )
        )
    }
    else {
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_FIELD"
            )
        )
        dispatch(
            handleField(
              "pay",
              action.componentJsonpath,
              "props.errorMessage",
              "RP_ERR_TRANSACTION_NUMBER_FIELD"
            )
        )
    }
  }
}
const amount = {
  label: {
    labelName: "Amount",
    labelKey: "RP_AMOUNT_LABEL"
  },
  placeholder: {
    labelName: "Please Enter Amount",
    labelKey: "RP_ENTER_AMOUNT_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  //pattern: getPattern("AmountFeild"),
  required: true,
  minLength: 1,
  maxLength: 7,
  jsonPath: "payment.amount",
  props:{
    disabled: true
  }
}
export const applicationOfflinePaymentDetails = getCommonCard({
  header: offlinePaymentDetailsHeader,
  detailsContainer: getCommonContainer({
    mode: getSelectField(paymenttype),
    amount:getTextField(amount),
      bankName: getTextField(bankName),
      transationdate:getDateField(transactiondatefield),
      transactionId: getTextField(transactionId)
  })
})
const detailsContainer = {
    uiFramework: "custom-atoms",
    componentPath: "Form",
    props: {
      id: "apply_form1"
    },
    children: {
      propertyDetails,
      rentSummaryDetails,
      paymentInfo
    },
    visible: true
  }
const detailsContainerCitizen={
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    propertyDetails,
    rentSummaryDetails,
    paymentInfoOffline
  },
  visible: true
}
const getConsumerCode = async (state, dispatch, payload) => {
  try {
    let response = await httpRequest(
      "post",
      "/rp-services/property/_payrent",
      "",
      [],
      payload
    );
    return response;
  } catch (e) {
    dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
    // console.log(e);
  }
} 

const goToPayment = async (state, dispatch, type) => {

  const isTransitValid = validateFields(
    "components.div.children.detailsContainer.children.propertyDetails.children.cardContent.children.detailsContainer.children",            
    state,
    dispatch,
    "payment"
  )
  const isPaymentInfoValid = validateFields(
    "components.div.children.detailsContainer.children.paymentInfo.children.cardContent.children.detailsContainer.children",            
    state,
    dispatch,
    "payment"
  )
  if(!!isTransitValid && !!isPaymentInfoValid) {
    const paymentInfo = get(state.screenConfiguration.preparedFinalObject, "paymentInfo")
    let propertyId = get(state.screenConfiguration.preparedFinalObject, "Properties[0].propertyDetails.propertyId")
    let id;
    if(!propertyId) {
       id = await getRentPaymentPropertyDetails(state, dispatch)
    }
    if(!!propertyId || !!id) {
      let payload = {Properties: [{
        id: propertyId || id,
        paymentAmount: paymentInfo.amount,
        transactionId: paymentInfo.transactionNumber,
        transactionDate:moment(paymentInfo.transactiondate).unix(),
        bankName: paymentInfo.bankName
      }]}
      payload = type === ONLINE ? payload : {
        Properties: [{
          ...payload.Properties[0],
          paymentMode: paymentInfo.paymentMode
        }]
      }
      const response = await getConsumerCode(state, dispatch, payload)
      if(!!response && !!response.Properties.length){
        const {rentPaymentConsumerCode, tenantId} = response.Properties[0]
        let billingBuisnessService=response.Properties[0].billingBusinessService
        type === ONLINE ? dispatch(
            setRoute(
             `/rented-properties-citizen/pay?consumerCode=${rentPaymentConsumerCode}&tenantId=${tenantId}&businessService=${billingBuisnessService}`
            )
          ) : dispatch(
            setRoute(
            `/rented-properties/acknowledgement?purpose=pay&applicationNumber=${rentPaymentConsumerCode}&status=success&tenantId=${tenantId}&type=${billingBuisnessService}`
             
            )
          )
        dispatch(prepareFinalObject("Properties", response.Properties))
      }
    }
  } else {
    dispatch(toggleSnackbar(true, {labelName: "RP_ERR_FILL_RENTED_MANDATORY_FIELDS", labelKey: "RP_ERR_FILL_RENTED_MANDATORY_FIELDS"}, "warning"))
  }
}

const paymentFooter = getCommonApplyFooter({
  makePayment: {
    componentPath: "Button",
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
      callBack: (state, dispatch) => {
        goToPayment(state, dispatch, ONLINE)
      },

    },
    visible: process.env.REACT_APP_NAME === "Citizen"
  },
  submit: {
    componentPath: "Button",
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
        labelName: "Submit",
        labelKey: "RP_BUTTON_MAKE_PAYEMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        goToPayment(state, dispatch, OFFLINE)
      },
    },
    visible: process.env.REACT_APP_NAME !== "Citizen"
  }
})
const beforeInitFn =async(action, state, dispatch)=>{
  getColonyTypes(action, state, dispatch);
}
const payment = {
    uiFramework: "material-ui",
    name: "payment",
    beforeInitScreen: (action, state, dispatch) => {
      beforeInitFn(action, state, dispatch);
      dispatch(prepareFinalObject("Properties", []));
      dispatch(prepareFinalObject("property", {}))
      dispatch(prepareFinalObject("paymentInfo", {}))
      return action;
    },
    components: {
        div: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {
            className: "common-div-css"
          },
          children: {
            headerDiv: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              children: {
                header: {
                  gridDefination: {
                    xs: 12,
                    sm: 10
                  },
                  ...header
                }
              }
            },
            detailsContainer: detailsContainer,
            footer: paymentFooter
          }
        }
      }
}

export default payment;