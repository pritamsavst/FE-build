import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertEpochToDateAndHandleNA, handleNA } from "../../utils";

const service = getQueryArg(window.location.href, "service")

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

const connectionChargeDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PLUMBER_DETAILS"
});

const roadCuttingChargesHeader = getHeader({
  labelKey:  "WS_ROAD_CUTTING_CHARGE_DETAILS"
});

const otherChargesDetailsHeader =  getHeader({
  labelKey: "WS_OTHER_CHARGE_DETAILS" 
});

const activationDetailsHeader = getHeader({
  labelKey: "WS_ACTIVATION_DETAILS"
});
const PropactivationDetailsHeader = getHeader({
  labelKey: "WS_PROPOSED_ACTIVATION_DETAILS"
});

export const reviewConnectionType = getLabelWithValue(
  {
    labelName: "Connection Type",
    labelKey: "WS_SERV_DETAIL_CONN_TYPE"
  },
  {
    jsonPath: "WaterConnection[0].connectionType",
    callBack: handleNA
    // callBack: value => {
    //   return value.split(".")[0];
    // }
  }
);
export const reviewferruleSize = getLabelWithValue(
  {
    labelName: "ferrule Size",
    labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT"
  },
  {
    jsonPath: "WaterConnection[0].ferruleSize",
    callBack: handleNA
    // callBack: value => {
    //   return value.split(".")[0];
    // }
  }
);
export const reviewNumberOfTaps = getLabelWithValue(
  {
    labelName: "No. of Taps",
    labelKey: "WS_SERV_DETAIL_NO_OF_TAPS"
  },
  {
    jsonPath: "WaterConnection[0].noOfTaps",
    callBack: handleNA
  }
);
export const reviewWaterSource = getLabelWithValue(
  {
    labelName: "Water Source",
    labelKey: "WS_SERV_DETAIL_WATER_SOURCE"
  },
  {
    jsonPath: "WaterConnection[0].waterSource",
    callBack: handleNA
  }
);
export const reviewWaterSubSource = getLabelWithValue(
  {
    labelName: "Water Sub Source",
    labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE"
  },
  {
    jsonPath: "WaterConnection[0].waterSubSource",
    callBack: handleNA
  }
);
export const reviewPipeSize = getLabelWithValue(
  {
    labelName: "Pipe Size (in inches)",
    labelKey: "WS_SERV_DETAIL_PIPE_SIZE"
  },
  {
    jsonPath: "WaterConnection[0].pipeSize",
    callBack: handleNA
  }
);
export const reviewBillGroup = getLabelWithValue(
  {
    labelName: "Bill Group",
    labelKey: "WS_SERV_DETAIL_BILL_GROUP"
  },
  {
    jsonPath: "WaterConnection[0].billGroup",
    callBack: handleNA
  }
);
export const reviewcontractValue = getLabelWithValue(
  {
    labelName: "Contratc Value",
    labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE"
  },
  {
    jsonPath: "WaterConnection[0].contractValue",
    callBack: handleNA
  }
);
export const reviewccCode = getLabelWithValue(
  {
    labelName: "CC Code",
    labelKey: "WS_SERV_DETAIL_CC_CODE"
  },
  {
    jsonPath: "WaterConnection[0].ccCode",
    callBack: handleNA
  }
);
export const reviewledgerGroup = getLabelWithValue(
  {
    labelName: "ledgerGroup",
    labelKey: "WS_SERV_DETAIL_LEDGER_GROUP"
  },
  {
    jsonPath: "WaterConnection[0].ledgerGroup",
    callBack: handleNA
  }
);
export const reviewdivision = getLabelWithValue(
  {
    labelName: "Division",
    labelKey: "WS_SERV_DETAIL_DIVISION"
  },
  {
    jsonPath: "WaterConnection[0].div",
    callBack: handleNA
  }
);
export const reviewsubdiv = getLabelWithValue(
  {
    labelName: "Sub Division",
    labelKey: "WS_SERV_DETAIL_SUB_DIVISION"
  },
  {
    jsonPath: "WaterConnection[0].subdiv",
    callBack: handleNA
  }
);
export const reviewledgerNo = getLabelWithValue(
  {
    labelName: "Ledger No",
    labelKey: "WS_SERV_DETAIL_LEDGER_NO"
  },
  {
    jsonPath: "WaterConnection[0].ledgerNo",
    callBack: handleNA
  }
);

export const reviewWaterClosets = getLabelWithValue(
  {
    labelName: "No. of Water Closets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS"
  },
  {
    jsonPath: "WaterConnection[0].proposedWaterClosets",
    callBack: handleNA
  }
);
export const reviewNoOfToilets = getLabelWithValue(
  {
    labelName: "No. of Toilets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS"
  },
  {
    jsonPath: "WaterConnection[0].proposedToilets",
    callBack: handleNA
  }
);

export const reviewPlumberProvidedBy = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"
  },
  {
    jsonPath: "WaterConnection[0].additionalDetails.detailsProvidedBy",
    callBack: handleNA
  }
);
export const reviewPlumberLicenseNo = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].plumberInfo[0].licenseNo",
    callBack: handleNA
  }
);
export const reviewPlumberName = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
  },
  { jsonPath: "WaterConnection[0].plumberInfo[0].name",
    callBack: handleNA }
);

export const reviewPlumberMobileNo = getLabelWithValue(
  {
    labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
  },
  { jsonPath: "WaterConnection[0].plumberInfo[0].mobileNumber",
    callBack: handleNA }
);

export const reviewRoadType = getLabelWithValue(
  {
    labelName: "Road Type",
    labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
  },
  {
    jsonPath: "WaterConnection[0].roadType",
    callBack: handleNA
    // callBack: convertEpochToDate
  }
);

export const reviewSecurityCharge = getLabelWithValue(
  {
    labelName: "Security Charges",
    labelKey: "WS_ADDN_DETAILS_SECURITY_CHARGES_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].waterApplication.securityCharge",
    callBack: handleNA
  }
);
export const reviewisFerruleApplicable = getLabelWithValue(
  {
    labelName: "Ferrule Applicable",
    labelKey: "WS_ADDN_DETAILS_IS_FERRULEAPPLICABLE"
  },
  {
    jsonPath: "WaterConnection[0].waterApplication.isFerruleApplicable",
    callBack: handleNA
  }
);
export const reviewisIsMeterStolen = getLabelWithValue(
  {
    labelName: "Is this is a case of theft of meter",
    labelKey: "WS_ADDN_DETAILS_IS_METER_STOLEN"
  },
  {
    jsonPath: "WaterConnection[0].waterApplication.isMeterStolen",
    callBack: handleNA
  }
);
export const reviewadditionalCharges = getLabelWithValue(
  {
    labelName: "Additional Charges",
    labelKey: "WS_ADDN_DETAILS_ADDITIONAL_CHARGES_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].waterApplication.additionalCharges",
    callBack: handleNA
  }
);
export const reviewconstructionCharges = getLabelWithValue(
  {
    labelName: "Construction Charges",
    labelKey: "WS_ADDN_DETAILS_CONSTRUCTION_CHARGES_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].waterApplication.constructionCharges",
    callBack: handleNA
  }
);
export const reviewArea = getLabelWithValue(
  {
    labelName: "Area (in sq ft)",
    labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
  },
  {
    jsonPath: "WaterConnection[0].roadCuttingArea",
    callBack: handleNA
  }
);
export const reviewConnectionExecutionDate = getLabelWithValue(
  {
    labelName: "Connection Execution Date",
    labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE"
  },
  {
    jsonPath: "WaterConnection[0].connectionExecutionDate",
    callBack: convertEpochToDateAndHandleNA
  }
);
export const reviewMeterId = getLabelWithValue(
  {
    labelName: "Meter ID",
    labelKey: "WS_SERV_DETAIL_METER_ID"
  },
  { jsonPath: "WaterConnection[0].meterId",
    callBack: handleNA }
);

export const reviewMeterInstallationDate = getLabelWithValue(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE"
  },
  {
    jsonPath: "WaterConnection[0].meterInstallationDate",
    callBack: convertEpochToDateAndHandleNA
  }
);

export const reviewInitialMeterReading = getLabelWithValue(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "WaterConnection[0].additionalDetails.initialMeterReading",
    callBack: handleNA }
);
export const reviewlastMeterReading = getLabelWithValue(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_LAST"
  },
  { jsonPath: "WaterConnection[0].additionalDetails.lastMeterReading",
    callBack: handleNA }
);
// new field

export const reviewMeterCount = getLabelWithValue(
  {
    labelName: "Meter Count",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_COUNT"
  },
  { jsonPath: "WaterConnection[0].meterCount",
    callBack: handleNA }
);
export const reviewmfrCode = getLabelWithValue(
  {
    labelName: "mfr Code",
    labelKey: "WS_SERV_DETAIL_MFRCODE"
  },
  { jsonPath: "WaterConnection[0].mfrCode",
    callBack: handleNA }
);
export const reviewmeterDigits = getLabelWithValue(
  {
    labelName: "Meter Digits",
    labelKey: "WS_SERV_DETAIL_METER_DIGIT"
  },
  { jsonPath: "WaterConnection[0].meterDigits",
    callBack: handleNA }
);
export const reviewmeterUnit = getLabelWithValue(
  {
    labelName: "Meter Unit",
    labelKey: "WS_SERV_DETAIL_METER_UNIT"
  },
  { jsonPath: "WaterConnection[0].meterUnit",
    callBack: handleNA }
);
export const reviewsanctionedCapacity = getLabelWithValue(
  {
    labelName: "Sanctioned Capacity",
    labelKey: "WS_SERV_DETAIL_SANCTION_CAPACITY"
  },
  { jsonPath: "WaterConnection[0].sanctionedCapacity",
    callBack: handleNA }
);
export const reviewmeterRentCode = getLabelWithValue(
  {
    labelName: "Meter Rent Code",
    labelKey: "WS_SERV_DETAIL_METER_RENT_CODE"
  },
  { jsonPath: "WaterConnection[0].meterRentCode",
    callBack: handleNA }
);
export const PropreviewConnectionExecutionDate = getLabelWithValue(
  {
    labelName: "Connection Execution Date",
    labelKey: "WS_PROP_SERV_DETAIL_CONN_EXECUTION_DATE"
  },
  {
    jsonPath: "WaterConnection[0].connectionExecutionDate",
    callBack: convertEpochToDateAndHandleNA
  }
);
export const PropreviewMeterId = getLabelWithValue(
  {
    labelName: "Meter ID",
    labelKey: "WS_PROP_SERV_DETAIL_METER_ID"
  },
  { jsonPath: "WaterConnection[0].proposedMeterId",
    callBack: handleNA }
);

export const PropreviewMeterInstallationDate = getLabelWithValue(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_PROP_ADDN_DETAIL_METER_INSTALL_DATE"
  },
  {
    jsonPath: "WaterConnection[0].proposedMeterInstallationDate",
    callBack: convertEpochToDateAndHandleNA
  }
);

export const PropreviewInitialMeterReading = getLabelWithValue(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "WaterConnection[0].proposedInitialMeterReading",
    callBack: handleNA }
);
export const PropreviewproposedLastMeterReading = getLabelWithValue(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "WaterConnection[0].proposedLastMeterReading",
    callBack: handleNA }
);
// new field

export const PropreviewMeterCount = getLabelWithValue(
  {
    labelName: "Meter Count",
    labelKey: "WS_PROP_ADDN_DETAILS_INITIAL_METER_COUNT"
  },
  { jsonPath: "WaterConnection[0].proposedMeterCount",
    callBack: handleNA }
);
export const PropreviewmfrCode = getLabelWithValue(
  {
    labelName: "mfr Code",
    labelKey: "WS_PROP_SERV_DETAIL_MFRCODE"
  },
  { jsonPath: "WaterConnection[0].proposedMfrCode",
    callBack: handleNA }
);
export const PropreviewmeterDigits = getLabelWithValue(
  {
    labelName: "Meter Digits",
    labelKey: "WS_PROP_SERV_DETAIL_METER_DIGIT"
  },
  { jsonPath: "WaterConnection[0].proposedMeterDigits",
    callBack: handleNA }
);
export const PropreviewmeterUnit = getLabelWithValue(
  {
    labelName: "Meter Unit",
    labelKey: "WS_PROP_SERV_DETAIL_METER_UNIT"
  },
  { jsonPath: "WaterConnection[0].proposedMeterUnit",
    callBack: handleNA }
);
export const PropreviewsanctionedCapacity = getLabelWithValue(
  {
    labelName: "Sanctioned Capacity",
    labelKey: "WS_PROP_SERV_DETAIL_SANCTION_CAPACITY"
  },
  { jsonPath: "WaterConnection[0].proposedSanctionedCapacity",
    callBack: handleNA }
);
export const PropreviewmeterRentCode = getLabelWithValue(
  {
    labelName: "Meter Rent Code",
    labelKey: "WS_PROP_SERV_DETAIL_METER_RENT_CODE"
  },
  { jsonPath: "WaterConnection[0].proposedMeterRentCode",
    callBack: handleNA }
);
export const getReviewOwner = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Additional Details ( To be filled by Municipal Employee)",
            labelKey: "WS_COMMON_ADDN_DETAILS_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    // viewOne: propertyDetails,
    // viewTwo: propertyLocationDetails
    viewFive: connectionDetailsHeader,
    viewSix: renderService(),
    // viewSix: connectionDetails,
    // viewSeven: connectionChargeDetailsHeader,
    // viewEight: connectionChargeDetails,
    // viewNine: roadCuttingChargesHeader,
    // viewTen: roadCuttingCharges,  
    viewEleven: otherChargesDetailsHeader ,
    viewTwelve: otherChargesDetails,
    viewThirteen :activationDetailsHeader ,
    viewFourteen: activationDetails,
    viewFifteen :PropactivationDetailsHeader ,
    viewSixteen: PropactivationDetails,
  })
};

const connectionChargeDetails = getCommonContainer({
  reviewPlumberProvidedBy,
  reviewPlumberLicenseNo,
  reviewPlumberName,
  reviewPlumberMobileNo
});

const roadCuttingCharges = getCommonContainer({
  reviewRoadType,
  reviewArea
});

const otherChargesDetails =  getCommonContainer({
  reviewSecurityCharge,
  reviewisFerruleApplicable,
  reviewadditionalCharges,
  reviewconstructionCharges,
  reviewisIsMeterStolen,
});
const activationDetails = getCommonContainer({
  reviewConnectionExecutionDate,
  reviewMeterId,
  reviewMeterInstallationDate,
  reviewInitialMeterReading,
  reviewlastMeterReading,
  reviewmfrCode,
  reviewmeterDigits,
  reviewmeterUnit,
  reviewsanctionedCapacity,
  reviewmeterRentCode,
  reviewMeterCount
});
const PropactivationDetails = getCommonContainer({
  PropreviewConnectionExecutionDate,
  PropreviewMeterId,
  PropreviewMeterInstallationDate,
  PropreviewInitialMeterReading,
  PropreviewproposedLastMeterReading,
  PropreviewmfrCode,
  PropreviewmeterDigits,
  PropreviewmeterUnit,
  PropreviewsanctionedCapacity,
  PropreviewmeterRentCode,
  PropreviewMeterCount
});

export const renderService = () => {
  if (service === "WATER") {
    //return getCommonContainer({ reviewConnectionType, reviewNumberOfTaps, reviewWaterSource, reviewWaterSubSource, reviewPipeSize ,reviewccCode, reviewdivision, reviewsubdiv,reviewledgerNo, reviewledgerGroup});
    return getCommonContainer({ reviewdivision, 
              reviewsubdiv, 
              reviewBillGroup,
              reviewledgerNo, 
              reviewledgerGroup,
              reviewccCode ,
              reviewConnectionType, 
              reviewferruleSize
              //reviewNumberOfTaps, 
              //reviewWaterSource,
              //reviewWaterSubSource, 
              //reviewPipeSize
            });
  } else if (service === "SEWERAGE") {
    return getCommonContainer({ reviewConnectionType, reviewWaterClosets,reviewNoOfToilets })
  }
  else{
    return getCommonContainer({ reviewConnectionType, 
                               // reviewNumberOfTaps, 
                                reviewWaterSource, 
                                reviewWaterSubSource, 
                                reviewPipeSize,
                                reviewferruleSize });
  }
}