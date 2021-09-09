import { getCommonCard, getCommonContainer,
  getSelectField,
  getDateField, getLabel, getPattern,} from "egov-ui-framework/ui-config/screens/specs/utils";
// import { searchAPICall, SearchDashboardData, SearchPGRDashboardData } from "./functions";
import get from "lodash/get";
import { SearchDashboardData } from "./StoreFunction";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import './StoreDashboard.css';

export const FilterForm = getCommonCard({
  FilterConstraintsContainer: getCommonContainer({
    // fromDate: getDateField({
    //   label: { labelName: "From Date", labelKey: "DASHBOARD_FROM_DATE_LABEL" },
    //   placeholder: {
    //     labelName: "",
    //     labelKey: "Select From Date"
    //   },
    //   gridDefination: {
    //     xs: 6,
    //     sm: 2,
    //     md: 2
    //   },
    //   pattern: getPattern("Date"),
    //   jsonPath: "dahsboardHome.defaultFromDate",
    //   required: true,
    //   afterFieldChange: (action, state, dispatch) => {
    //     // dispatch(
    //     //   handleField(
    //     //     "dashboardSource",
    //     //     "components.div.children.FilterFormforEmployee.children.cardContent.children.FilterConstraintsContainer.children.toDate",
    //     //     "props.inputProps.min",
    //     //     action.value
    //     //   )
    //     // );
    //     }
    // }),
    // toDate: getDateField({
    //   label: { labelName: "To Date", labelKey: "DASHBOARD_TO_DATE_LABEL" },
    //   placeholder: {
    //     labelName: "To Date",
    //     labelKey: "Select To Date"
    //   },
    //   props: {
    //     inputProps: {
    //       min: ''
    //     }
    //   },
    //   gridDefination: {
    //     xs: 6,
    //     sm: 2,
    //     md: 2
    //   },
    //   pattern: getPattern("Date"),
    //   jsonPath: "dahsboardHome.defaulttoDate",
    //   required: true,
    // }),
    storeDashboardDropdownOne: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-dashboard",
      componentPath: "AutosuggestContainer",
      jsonPath: "dahsboardHome.dropDownData2",
      required: true,
      gridDefination: {
            xs: 6,
            sm: 2,
            md: 2
          },
      props: {
        style: {
        width: "100%",
        cursor: "pointer",
        height: "55px",
      },
  
      className: "citizen-city-picker",
      label: { labelName: "Report Type", labelKey: "DASHBOARD_DROPDOWN_REPORT_TYPE_LABEL" },
      placeholder: {
        labelName: "",
        labelKey: "Select Module"
      },
      sourceJsonPath: "dahsboardHome.dropDownData",
      jsonPath: "dahsboardHome.dropDownData2",
      maxLength:5,
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      // required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
      labelName: "name",
      valueName: "name"
      },
      afterFieldChange: (action, state, dispatch) => {
        
        
        var selectedDropdown = get(state.screenConfiguration.preparedFinalObject, "dahsboardHome.dropDownData2", {});
        // dispatch(
        //   handleField(
        //     "StoreDashboard",
        //     "components.div.children.FilterForm.children.cardContent.children.FilterConstraintsContainer.children.moduleDashboardDropdownStore",
        //     "props.disabled",
        //     true
        //   )
        // );
      }
    },
    storeDashboardDropdownTwo: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-dashboard",
      componentPath: "AutosuggestContainer",
      jsonPath: "dahsboardHome.storeNameDefault",
      required: true,
      gridDefination: {
            xs: 6,
            sm: 2,
            md: 2
          },
      props: {
        style: {
          width: "100%",
          cursor: "pointer",
      },
  
      className: "citizen-city-picker",
      label: { labelName: "Report Type", labelKey: "DASHBOARD_DROPDOWN_REPORT_TYPE_LABEL" },
      placeholder: {
        labelName: "",
        labelKey: "Select Module"
      },
      sourceJsonPath: "dahsboardHome.storeName",
      jsonPath: "dahsboardHome.storeNameDefault",
      maxLength:5,
      labelsFromLocalisation: false,
      suggestions: [],
      fullwidth: true,
      // required: true,
      inputLabelProps: {
        shrink: true
      },
      isMulti: false,
      labelName: "name",
      valueName: "name"
      },
    
    },
    // financialDropdownStore: {
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-dashboard",
    //   componentPath: "AutosuggestContainer",
    //   jsonPath: "dahsboardHome.selectedFinancialYearData",
    //   required: true,
    //   gridDefination: {
    //         xs: 6,
    //         sm: 2,
    //         md: 2
    //       },
    //   props: {
    //     style: {
    //     width: "100%",
    //     cursor: "pointer",
    //   },
  
    //   className: "citizen-city-picker",
    //   label: { labelName: "Financial Year", labelKey: "DASHBOARD_STORE_DROPDOWN_FINANCIAL_YR_LABEL" },
    //   placeholder: {
    //     labelName: "",
    //     labelKey: "Select Module"
    //   },
    //   sourceJsonPath: "dahsboardHome.financialYearData",
    //   jsonPath: "dahsboardHome.selectedFinancialYearData",
    //   maxLength:5,
    //   labelsFromLocalisation: false,
    //   suggestions: [],
    //   fullwidth: true,
    //   // required: true,
    //   inputLabelProps: {
    //     shrink: true
    //   },
    //   isMulti: false,
    //   labelName: "name",
    //   valueName: "name"
    //   },
    
    // },
    storeDashboardSearchButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 6,
        sm: 2,
        md: 2
      },
      props: {
        variant: "contained",
        color: "primary",
        style: {
        width: "100%",
        height: "55px",
        // marginLeft: "90%"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "Search",
          labelKey: "DASHBOARD_SEARCH_BTN_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          SearchDashboardData(state, dispatch)
        }
      }
    },
  })
});

export const DashboardResults = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-dashboard",
  componentPath: "DashboardStoreManagement",
  props: {
  // className: "dashboard-graph",
  formKey: `newapplication`,
  data : []
  },
  style: {
  },
  visible: true,
}