import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getLegalDashboardData } from "../../../../../ui-utils/commons";


export const SearchLegalDashboardData = async (state, dispatch) =>{
  
    //
    var flag_for_api_call = true
    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId()
      },
      { key: "offset", value: "0" }
    ];
    let dashboardFilterDAta = get(
      state.screenConfiguration.preparedFinalObject,
      "dahsboardHome",
      {}
    );
    
    var dateFromObject = new Date(dashboardFilterDAta["defaultFromDate"]);
    var dateToObject = new Date(dashboardFilterDAta["defaulttoDate"]);
    var fromDateNumeric = dateFromObject.getTime()  ? dateFromObject.getTime() : null;
    var toDateNumeric = dateToObject.getTime() ? dateToObject.getTime() : null;
    var reportSortBy = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
    // var reportName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.reportdefaultDropDownData",{});
  
    // Validation For api call
    if(fromDateNumeric === null || toDateNumeric === null || reportSortBy.value === undefined ){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "ERROR", labelKey: "DASHBOARD_FILTER_FORM_ERROR_MSG" },
          "warning"
        )
      );
    }
    else{ 
  
    var data = {
      "tenantId" : getTenantId(),
      "fromDate":fromDateNumeric,
      "toDate": toDateNumeric,
      "reportSortBy": reportSortBy
      
    }
    let requestBody = {
      "tenantId": getTenantId(),
      "fromDate": fromDateNumeric,
      "toDate": toDateNumeric,
      "reportSortBy": reportSortBy
    }
      
      try {
        // API call for Description Report
        const response = await getLegalDashboardData( dispatch, requestBody );
          
      } catch (error) {
  
        dispatch(toggleSnackbar(true, error.message, "error"));
        console.log(error);
      }
    }
  };