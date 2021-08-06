import { getCommonCard, getPattern, getCommonSubHeader, getTextField, getSelectField, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject ,handleScreenConfigurationFieldChange as handleField} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from 'lodash/get';
let IsEdit = process.env.REACT_APP_NAME === "Citizen"?false:true;
let ApplicationType = false;
let wns_workflow = window.localStorage.getItem("wns_workflow");
if(wns_workflow ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION'
|| wns_workflow ==='WS_TEMP_TEMP'
|| wns_workflow ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION'
|| wns_workflow ==='WS_TEMP_REGULAR')
{
  ApplicationType = true;

}
// export const getGenderRadioButton = {
//   uiFramework: "custom-containers",
//   componentPath: "RadioGroupContainer",
//   gridDefination: { xs: 12, sm: 12, md: 6 },
//   jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
//   props: {
//     label: { key: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" },
//     buttons: [
//       { labelKey:"HARVESTING_SCORE_YES", value: "Yes" },
//       { labelKey:"HARVESTING_SCORE_NO", value: "No" },
//     ],
//     jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
//     required: true
//   },
//   type: "array"
// };
const displaysubUsageType = (usageType, dispatch, state) => {

  let subTypeValues = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreenMdmsData.ws-services-masters.wsCategory"
        );

      let subUsage=[];
      if(subTypeValues!== undefined)
      {
      subUsage = subTypeValues.filter(cur => {
                  return (cur.applicationType === usageType ) 
                });
          if(subUsage&&subUsage[0])
          {
            dispatch(prepareFinalObject("propsubusagetypeForSelectedusageCategory",subUsage[0].category));
           // dispatch(prepareFinalObject("applyScreen.waterProperty.usageSubCategory",null))
          }
        }
          
}

export const getCheckboxContainer = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "CheckboxContainer",
  gridDefination: { xs: 12, sm: 12, md: 12 },
  props: {
    jsonPathSewerage: "applyScreen.sewerage",
    jsonPathWater: "applyScreen.water",
    jsonPathTubewell: "applyScreen.tubewell",
    required: true,
    disabled:IsEdit,

  },
  type: "array",
};

export const OwnerInfoCard = getCommonCard({

  header: getCommonSubHeader(
    { labelName: "Connection Details", labelKey: "WS_COMMON_CONNECTION_DETAILS" },
    { style: { marginBottom: 18 } }
  ),

  tradeUnitCardContainer: getCommonContainer({
    getCheckboxContainer,

    // numberOfTaps: getTextField({
    //   label: { labelKey: "WS_CONN_DETAIL_NO_OF_TAPS" },
    //   placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
    //   gridDefination: { xs: 12, sm: 6 },
    //   required: true,
    //   visible:false,
    //   props:{
    //     disabled:IsEdit
    //   },
    //   sourceJsonPath: "applyScreen.proposedTaps",
    //   jsonPath: "applyScreen.proposedTaps",
    //   pattern: /^[0-9]*$/i,
    //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    // }),

    // pipeSize: getSelectField({
    //   label: { labelKey: "WS_CONN_DETAIL_PIPE_SIZE" },
    //   sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
    //   placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
    //   required: true,
    //   gridDefination: { xs: 12, sm: 6 },
    //   jsonPath: "applyScreen.proposedPipeSize"
    // }),


    pipeSize: {
      ...getSelectField({
        label: { labelKey: "WS_CONN_DETAIL_PIPE_SIZE" },
        sourceJsonPath: "applyScreenMdmsData.ws-services-calculation.pipeSize",
        placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
        required: true,
        props:{
          disabled:IsEdit
        },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.proposedPipeSize"
      }),
      beforeFieldChange: async (action, state, dispatch) => {

        // if(action.value)
        // {
        //   let pipeSize = get(
        //     state.screenConfiguration.preparedFinalObject,
        //     "applyScreenMdmsData.ws-services-calculation.pipeSize"
        //   )
        //   pipeSize = pipeSize.filter(x=>x.size === action.value)

        //    if(pipeSize&&pipeSize[0])
        //    {            
        //     dispatch(
        //       prepareFinalObject(
        //         "applyScreen.sanctionedCapacity",
        //         pipeSize[0].sanctionedCapacity
        //       )
        //     )
        //     dispatch(
        //       prepareFinalObject(
        //         "applyScreen.meterRentCode",
        //         pipeSize[0].MeterRentCode
        //       )
        //     )
        //    }
        // }
       
      }
    },
    waterApplicationType : getSelectField({
      label: { labelKey: "WATER_APPLICATION_TYPE" },
      sourceJsonPath: "applyScreenMdmsData.ws-services-masters.WaterApplicationType",
      placeholder: { labelKey: "WATER_APPLICATION_TYPE_PLACEHOLDER" },
      required: true,
      gridDefination: { xs: 12, sm: 6 },
      jsonPath: "applyScreen.waterApplicationType",
      props: {
        optionValue: "code",
        optionLabel: "name",
        disabled: ApplicationType === false?IsEdit:ApplicationType
      // data:
      // [
      //   {
      //     "id": 1,
      //     "code": "TEMPORARY",
      //     "name": "Temporary"
      //   },
      //   {
      //     "id": 2,
      //     "code": "REGULAR",
      //     "name": "Regular"
      //   }
      // ]
    },
    beforeFieldChange: async (action, state, dispatch) => {
      if(action.value)
      {
        if(action.value ==='TEMPORARY_BILLING')
        {
          dispatch(prepareFinalObject("propsubusagetypeForSelectedusageCategory",[]));
          dispatch(handleField(
            "apply",
            `components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType`,
            "required",
            false
            ));
            dispatch(handleField(
              "apply",
              `components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType`,
              "visible",
              false
              ));

        }
        else{
          displaysubUsageType(action.value, dispatch, state);
          dispatch(handleField(
            "apply",
            `components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType`,
            "required",
            true
            ));
            dispatch(handleField(
              "apply",
              `components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children.propertySubUsageType`,
              "visible",
              true
              ));
        }
      }
       
   }
    }),
    contractValue: getTextField({
      label: { labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE" },
      placeholder: { labelKey: "WS_ADDN_DETAILS_CONTRACT_VALUE_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      pattern: getPattern("Name"),
      visible:true,
      props:{
        disabled:IsEdit
      },
      jsonPath: "applyScreen.contractValue",
      pattern: /^[0-9]*$/i,
      
     // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
    }),
    ferruleSize: getTextField({
      label: { labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT" },
      placeholder: { labelKey: "WS_ADDN_DETAILS_FERRULE_INPUT_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      pattern: getPattern("AlphaNumValidation"),
      visible:false,
      props:{
        disabled:IsEdit
      },
      jsonPath: "applyScreen.ferruleSize",
      //pattern: /^[0-9]*$/i,
      
     // errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
    }),

    numberOfWaterClosets: getTextField({
      label: { labelKey: "WS_CONN_DETAIL_NO_OF_WATER_CLOSETS" },
      placeholder: { labelKey: "WS_CONN_DETAIL_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
      gridDefination: { xs: 12, sm: 6 },
      required: true,
      visible:false,
      sourceJsonPath: "applyScreen.proposedWaterClosets",
      jsonPath: "applyScreen.proposedWaterClosets",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    }),

    numberOfToilets: getTextField({
      label: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS" },
      placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS_PLACEHOLDER" },
      required: true,
      visible:false,
      gridDefination: { xs: 12, sm: 6 },
      sourceJsonPath: "applyScreen.proposedToilets",
      jsonPath: "applyScreen.proposedToilets",
      pattern: /^[0-9]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    })
  })
});