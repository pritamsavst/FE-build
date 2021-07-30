import {
    getBreak,
    getCommonHeader,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { httpRequest } from "../../../../ui-utils";  
  import { searchResults } from "./downloadResourse/searchResults";
  import { searchForm ,DownloadDataExchangeFile} from "./downloadResourse/searchForm";
  import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getResults } from "../../../../ui-utils/commons"; 
  import commonConfig from "config/common.js";
  import { getTextToLocalMapping } from "./downloadResourse/searchResults"; 
  import {
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  // import{UserRoles} from '../../../../ui-utils/sampleResponses'
  // let roles = UserRoles().UserRoles;
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  //enableButton = hasButton && hasButton === "false" ? false : true;
  const showHideTable = (booleanHideOrShow, dispatch) => {
    dispatch(
      handleField(
        "download",
        "components.div.children.searchResults",
        "visible",
        booleanHideOrShow
      )
    );
  };
  const header = getCommonHeader({
    labelName: "Bill Download",
    labelKey: "WS_BILL_DOWNLOAD",
  });

  const DownloadDataExchangeFileheader = getCommonHeader({
    labelName: "Bill Download",
    labelKey: "WS_BILL_DOWNLOAD",
  });
 
  const getdownloadList = async (action, state, dispatch) => {
    const tenantId = getTenantId();  
    showHideTable(false, dispatch);
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId
      }];
  
    // let response = await getResults(queryObject, dispatch,"download");
      let response ={
        download:[
          {
            col1:"col1",
            col2:"col2",
            download:"download1"
          },
          {
            col1:"col1",
            col2:"col2",
            download:"download1"
          }
        ]
      }
      try {
        let data = response.download.map((item) => {
          return {
             
              [getTextToLocalMapping("Col 1")]: get(item, "col1", "-") || "-",
              [getTextToLocalMapping("Col 2")]: get(item, "col2", "-") || "-",
              [getTextToLocalMapping("Download")]: get(item, "download", "-") || "-",
          };
        });
  
        dispatch(
          handleField(
            "download",
            "components.div.children.searchResults",
            "props.data",
            data
          )
        );
        dispatch(
          handleField(
            "download",
            "components.div.children.searchResults",
            "props.title",
            `${getTextToLocalMapping("Search Results for Bill Download")} (${
              response.download.length
            })`
          )
        );
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
  };

  const getData = async (action, state, dispatch) => {
    //await getMDMSData(action, state, dispatch);
    await getdownloadList(action, state, dispatch)
    await getMdmsData(state, dispatch);
  };
  export const getMdmsData = async (state,dispatch) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
         // { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }] },
          
          {
            moduleName: "ws-services-masters", masterDetails: [
              { name: "DataTransferType" },
              
            ]
          }
        ]
      }
    };
    try {
      let payload = null;
      payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);      
      dispatch(prepareFinalObject("applyScreenMdmsData.ws-services-masters.DataTransferType", payload.MdmsRes['ws-services-masters'].DataTransferType));
      //
    } catch (e) { console.log(e); }
  };
  
  const downloadSearchAndResult = {
    uiFramework: "material-ui",
    name: "download",
    beforeInitScreen: (action, state, dispatch) => {
            // fetching store name for populating dropdown
            const queryObject = [{ key: "tenantId", value: getTenantId()  }];

      
            // fetching MDMS data
      getData(action, state, dispatch);
      //set search param blank
dispatch(prepareFinalObject("searchScreen",{}));
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "search",
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
  
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 6,
                },
                ...header,
              },
             
            },
          },
         searchForm,
        // DownloadDataExchangeFileheader,
         DownloadDataExchangeFile,
          breakAfterSearch: getBreak(),
          //searchResults,
        },
      },
    },
  };
  
  export default downloadSearchAndResult;
  