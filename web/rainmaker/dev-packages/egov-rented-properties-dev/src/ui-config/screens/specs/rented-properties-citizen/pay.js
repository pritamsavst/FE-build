import {
    getCommonContainer,
    getCommonHeader,
    getCommonCard,
    getCommonTitle
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { footer, callPGService } from "../rented-properties/payResource/footer";
  import estimateDetails from "../rented-properties/payResource/estimate-details";
  import {
    getQueryArg,
    setBusinessServiceDataToLocalStorage
  } from "egov-ui-framework/ui-utils/commons";
  import { fetchBill } from "../utils";
  import set from "lodash/set";
  import { getPaymentGateways } from "../../../../ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { BILLING_BUSINESS_SERVICE_OT, BILLING_BUSINESS_SERVICE_DC, BILLING_BUSINESS_SERVICE_RENT } from "../../../../ui-constants";
import {applicationOfflinePaymentDetails} from "../rented-properties/payment"
import get from "lodash/get";
  const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "Application for Ownership Transfer",
      labelKey: "RP_COMMON_PAY_OWNERSHIP_SCREEN_HEADER"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-rented-properties",
      componentPath: "ApplicationNoContainer",
      props: {
        number: getQueryArg(window.location.href, "consumerCode")
      }
    }
  });
  
  const setPaymentMethods = async (action, state, dispatch) => {
    const businessService = getQueryArg(window.location.href, "businessService")
    const response = await getPaymentGateways();
    if(!!response && !!response.length) {
      const paymentMethods = response.map(item => ({
        label: { labelName: item,
        labelKey: item},
        link: () => callPGService(state, dispatch, item, businessService)
      }))
      set(action, "screenConfig.components.div.children.footer.children.makePayment.props.data.menu", paymentMethods)
    }
  }

  const beforeScreenInit = async (action, state, dispatch) => {
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let consumerCode = getQueryArg(window.location.href, "consumerCode");
    let consumerNumber=consumerCode.split("-")[2]
      const businessService = getQueryArg(window.location.href, "businessService")
      const queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: businessService }
      ];
      if(process.env.REACT_APP_NAME === "Citizen") {
      setPaymentMethods(action, state, dispatch)
      }
      // setBusinessServiceDataToLocalStorage(queryObject, dispatch);
      await fetchBill(action, state, dispatch, businessService);
      let sourceJsonPath, header;
      switch(consumerNumber) {
        case "OT" : {
          sourceJsonPath = "OwnersTemp[0].estimateCardData"
          header = getCommonHeader({
            labelName: "Application for Ownership Transfer",
            labelKey: "RP_COMMON_PAY_OWNERSHIP_SCREEN_HEADER"
          })
          break
        }
        case "DC": {
          sourceJsonPath = "DuplicateTemp[0].estimateCardData"
          header = getCommonHeader({
            labelName: "Application for Duplicate Transfer",
            labelKey: "RP_COMMON_PAY_DUPLICATE_SCREEN_HEADER"
          })
          break
        }
        default:  
        {
          sourceJsonPath = "PropertiesTemp[0].estimateCardData"
          header = getCommonHeader({
            labelName: "Online Rent Payment",
            labelKey: "RP_COMMON_PAY_ONLINE_RENT_SCREEN_HEADER"
          })
          consumerCode = consumerCode.split("-")[1]
          dispatch(
            handleField(
              "pay",
              "components.div.children.headerDiv.children.header.children.applicationNumber.props",
              "type",
              "RP_MASTER"
            )
          )
          break
        }
      }
      dispatch(
        handleField(
            "pay",
            "components.div.children.formwizardFirstStep.children.paymentDetails.children.cardContent.children",
            "estimateDetails",
            estimateDetails(sourceJsonPath)
        )
    );
    dispatch(
      handleField(
        "pay",
        "components.div.children.headerDiv.children.header.children",
        "header",
         header
      )
    )
    dispatch(
      handleField(
        "pay",
        "components.div.children.headerDiv.children.header.children.applicationNumber.props",
        "number",
        consumerCode
      )
    )
    let estimate=get(state.screenConfiguration.preparedFinalObject,"OwnersTemp[0].estimateCardData")
    let dupestimate=get(state.screenConfiguration.preparedFinalObject,"DuplicateTemp[0].estimateCardData")
    let colony=get(state.screenConfiguration.preparedFinalObject,"Owners[0].property.colony")
    let dupcolony=get(state.screenConfiguration.preparedFinalObject,"DuplicateCopyApplications[0].property.colony")
    let data=[
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
      }
    ]
    let vikasColonydData=[
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
      {
        label: "RP_PAYMENT_DIRECT_PAYMENT",
        value: "OFFLINE_NEFT",
      }
    ]
    let sectorColonyData=[
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
      {
        label: "RP_PAYMENT_DIRECT_PAYMENT_SECTOR",
        value: "OFFLINE_RTGS",
      }
    ]
    let value=0
    if(!!estimate){
   for(var i=0;i<estimate.length;i++){
     value= value+Number(estimate[i].value)
   }
  }
  else if(!!dupestimate){
    for(var i=0;i<dupestimate.length;i++){
      value= value+Number(dupestimate[i].value)
    }
  }

    dispatch(
      handleField(
        "pay",
        "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.amount",
        "props.value",
        value.toString()
      )
    )
    if(!!colony){
      if(colony==="COLONY_VIKAS_NAGAR"){
        dispatch(handleField(
          "pay",
          "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.mode",
          "props.data",
          vikasColonydData
        ))
      }else if(colony==="COLONY_SECTOR_52_53"){
        dispatch(handleField(
          "pay",
          "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.mode",
          "props.data",
          sectorColonyData
        ))
      }
      else{
        dispatch(handleField(
          "pay",
          "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.mode",
          "props.data",
          data
        ))
      }
    }
    else if(!!dupcolony){
      if(dupcolony==="COLONY_VIKAS_NAGAR"){
        dispatch(handleField(
          "pay",
          "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.mode",
          "props.data",
          vikasColonydData
        ))
      }else if(dupcolony==="COLONY_SECTOR_52_53"){
        dispatch(handleField(
          "pay",
          "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.mode",
          "props.data",
          sectorColonyData
        ))
      }
      else{
        dispatch(handleField(
          "pay",
          "components.div.children.formwizardFirstStep.children.offlinePaymentDetails.children.cardContent.children.detailsContainer.children.mode",
          "props.data",
          data
        ))
      }
    }
  }
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "pay",
    beforeInitScreen: (action, state, dispatch) => {
      beforeScreenInit(action, state, dispatch)
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css citizen-payment-confirmation"
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
          formwizardFirstStep: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
              paymentDetails: getCommonCard({
                header: getCommonTitle({
                  labelName: "Please review your fee and proceed to payment",
                  labelKey: "RP_PAYMENT_HEAD"
                }),
                // estimateDetails
              }),
              offlinePaymentDetails : {
                ...applicationOfflinePaymentDetails,
                visible: process.env.REACT_APP_NAME === "Employee"
              }
            }
          },
          footer
        }
      }
    }
  };
  
  export default screenConfig;
  