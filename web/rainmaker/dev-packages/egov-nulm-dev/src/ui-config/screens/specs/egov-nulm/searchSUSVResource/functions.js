import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "search-susv"
  );

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS",
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every((x) => (typeof x === "string") && x.trim() === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS",
        },
        "warning"
      )
    );
  } else {
    // Add selected search fields to queryobject
    // for (var key in searchScreenObject) {
      
    //   if(searchScreenObject.hasOwnProperty(key) && typeof searchScreenObject[key] === "boolean"){
    //     queryObject.push({ key: key, value: searchScreenObject[key] });
    //   }
    //   else  if (
    //     searchScreenObject.hasOwnProperty(key) &&
    //     searchScreenObject[key].trim() !== ""
    //   ) {
    //     queryObject.push({ key: key, value: searchScreenObject[key].trim() });
    //   }
    // }
   let NulmSusvRequest = {...searchScreenObject};
   NulmSusvRequest.tenantId = tenantId;

  // if(get(NulmSusvRequest, "toDate")){
  //   let toDate = get(NulmSusvRequest, "toDate").split("-").reverse().join("-");
  //   set( NulmSusvRequest,"toDate",toDate );
  // }
  // if(get(NulmSusvRequest, "fromDate")){
  //   let fromDate = get(NulmSusvRequest, "fromDate").split("-").reverse().join("-");
  //   set( NulmSusvRequest,"fromDate",fromDate );
  // }
  let IsValidDate = true
  let toDate = get(NulmSusvRequest, "toDate")
  let fromDate = get(NulmSusvRequest, "fromDate")
  if(toDate &&  (fromDate === null  || fromDate === undefined))
  {
    IsValidDate = false
  }
  else if(fromDate && (toDate === null  || toDate === undefined))
{
  IsValidDate = false

}
if(toDate && toDate)
{
  if(fromDate< toDate)
  {
    IsValidDate = true

  }
  else if(fromDate === toDate)
  {
    IsValidDate = true

  }
  else
  {
    IsValidDate = false
  }
}
if(IsValidDate)
{
   const requestBody = {NulmSusvRequest}
    let response = await getSearchResults([],requestBody, dispatch,"susv");
    try {
      if(response.ResponseBody.length > 0){
        let data = response.ResponseBody.map((item) => {
  
          return {
            [getTextToLocalMapping("Application Id")]: get(item, "applicationId", "-") || "-",
            [getTextToLocalMapping("Name of Applicant")]: get(item, "nameOfApplicant", "-") || "-",
            [getTextToLocalMapping("Application Status")]: get(item, "applicationStatus", "-") || "-",
            [getTextToLocalMapping("Creation Date")]: get(item, "auditDetails.createdTime", "")? new Date(get(item, "auditDetails.createdTime", "-")).toISOString().substr(0,10) : "-",
            ["code"]: get(item, "applicationUuid", "-")
          };
        });
  
        dispatch(
          handleField(
            "search-susv",
            "components.div.children.searchResults",
            "props.data",
            data
          )
        );
        dispatch(
          handleField(
            "search-susv",
            "components.div.children.searchResults",
            "props.title",
            `${getTextToLocalMapping("Search Results for SUSV")} (${
              response.ResponseBody.length
            })`
          )
        );
        showHideTable(true, dispatch); 
      }
      showHideTable(true, dispatch); 
    } catch (error) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Unable to parse search results!" },
          "error"
        )
      );
    }
  }
  else{
    if(toDate &&  (fromDate === null  || fromDate === undefined))
  {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select from date",
          labelKey: "ERR_NULM_FROM_DATE_SELECTION_VALIDATION",
        },
        "warning"
      )
    );
      }
      else if(fromDate && (toDate === null  || toDate === undefined))
      {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Please select to date",
              labelKey: "ERR_NULM_TO_DATE_SELECTION_VALIDATION",
            },
            "warning"
          )
        );

      }
      if(toDate && toDate)
      {
        if(fromDate > toDate)
        {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "From date shpuld be less then to date",
                labelKey: "ERR_NULM_FROM_DATE_TO_DATE_SELECTION_VALIDATION",
              },
              "warning"
            )
          );

        }
      }

  }

  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-susv",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
