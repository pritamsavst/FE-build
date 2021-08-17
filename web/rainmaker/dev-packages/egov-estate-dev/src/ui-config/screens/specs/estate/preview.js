import { getStatusList } from "./searchResource/functions";
import {
  getTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import { createEstimateData, getCommonApplyHeader, getFeesEstimateCard } from "../utils";
import { footerReview } from "./preview-resource/reviewFooter";
const { getCommonContainer, getCommonHeader, getCommonCard, getCommonGrayCard } = require("egov-ui-framework/ui-config/screens/specs/utils");
const { prepareFinalObject, toggleSpinner } = require("egov-ui-framework/ui-redux/screen-configuration/actions");
const { getQueryArg, setDocuments } = require("egov-ui-framework/ui-utils/commons");
const { getSearchApplicationsResults } = require("../../../../ui-utils/commons");
const { setThirdStep } = require("../estate-citizen/applyResource/review");
import {downloadPrintContainer} from './applyResource/footer';
import { getApplicationConfig } from "../estate-citizen/_apply";
import { set } from "lodash";
import {getReviewNoc} from '../estate/applyResource/reviewProperty'
const userInfo = JSON.parse(getUserInfo());
const {
  roles = []
} = userInfo
const findItem = roles.find(item => item.code === "ES_EB_FINANCIAL_OFFICER");

const getWfDocuments = (status) => {
  const templateDocuments = [{
    type: status === "ES_PENDING_SO_TEMPLATE_CREATION" ? "WF_DOCS_TEMPLATE" : status === "ES_PENDING_CITIZEN_TEMPLATE_SUBMISSION" ? "WF_DOCS_TEMPLATE_SUBMISSION" : "WF_DOCS_NOTICE",
    description: {
      labelName: "ES_ALLTYPES",
      labelKey: "ES_ALLTYPES",
    },
      formatProps :{
        accept : "application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*",
      }, 
      maxFileSize: 6000,
      moduleName: "ES",
  statement: {
       labelName: "UPLOAD_DOCUMENT",
       labelKey: "UPLOAD_DOCUMENT"
  }
  }]
  const documentTypes = [
    {
    name: status === "ES_PENDING_SO_TEMPLATE_CREATION" ? "WF_DOCS_TEMPLATE" : status === "ES_PENDING_CITIZEN_TEMPLATE_SUBMISSION" ? "WF_DOCS_TEMPLATE_SUBMISSION" : "WF_DOCS_NOTICE",
    required: true,
    jsonPath: `templateDocuments[0]`,
    statement: "UPLOAD_DOCUMENT"
    }
  ]
  return {templateDocuments, documentTypes}
}

const getData = async (action, state, dispatch) => {
    const userRoles = JSON.parse(getUserInfo()).roles;
    const userRole = userRoles[0].code;
    let siteReportUser = roles.find(item => item.code === "ES_MM_DEALING_ASSISTANT" || item.code === "ES_MM_TAX_CONTROLLER_MANIMAJRA" || item.code === "ES_MM_SR_ASSISTANT" || item.code === "ES_MM_SECTION_OFFICER" | item.code === "ES_ADDITIONAL_COMMISSIONER");

    await dispatch(prepareFinalObject("workflow.ProcessInstances", []))
    await dispatch(prepareFinalObject("templateDocuments", []))
    await dispatch(prepareFinalObject("temp", []))
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const branchType = getQueryArg(window.location.href, "branchType");
    if(!applicationNumber) {
        return {}
    }
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let queryObject = [
        {key: "applicationNumber", value: applicationNumber},
      ]
      queryObject = !!branchType ? [...queryObject, {key: "branchType", value: branchType}] : queryObject
    let footer = {},printCont = {},taskStatusProps = {};
    const response = await getSearchApplicationsResults(queryObject)
    try {
       let {Applications = []} = response;
       let {applicationDocuments, allDocuments,workFlowBusinessService, state: applicationState, billingBusinessService: businessService, property,hardcopyReceivedDate,applicationDetails} = Applications[0];
       const estateRentSummary = property.estateRentSummary
       const dueAmount = !!estateRentSummary ? estateRentSummary.balanceRent + estateRentSummary.balanceRentPenalty + estateRentSummary.balanceGSTPenalty + estateRentSummary.balanceGST : "0"
       property = {...property, propertyDetails: {...property.propertyDetails, dueAmount: dueAmount || "0"}}
       const property_copy = property;
       if(property.fileNumber ===  "BBNOC-1") {
        property = Applications[0].applicationDetails.property;
        }
       applicationDocuments = applicationDocuments || []
       allDocuments = allDocuments || []
       const statusQueryObject = [{
          key: "tenantId",
          value: getTenantId()
          },
          {
          key: "businessServices",
          value: workFlowBusinessService
          }
        ]
       getStatusList( state, dispatch, statusQueryObject)
       const removedDocs = applicationDocuments.filter(item => !item.isActive)
       applicationDocuments = applicationDocuments.filter(item => !!item.isActive)
       let finalLetter
       if(applicationState==="ES_PENDING_DA_PREPARE_LETTER"){
        finalLetter=[]
       }
       else{
         finalLetter = applicationDocuments.find(item => item.documentType === "FINAL_LETTER")
       }
       //const finalLetter = applicationDocuments.find(item => item.documentType === "FINAL_LETTER")
      //  applicationDocuments = applicationDocuments.filter(item => item.documentType !== "FINAL_LETTER")
      //  allDocuments = allDocuments.filter(item => item.documentType !== "FINAL_LETTER")
       Applications = [{...Applications[0], applicationDocuments, property, finalLetter, property_copy}]
       dispatch(prepareFinalObject("Applications", Applications))
       dispatch(prepareFinalObject("temp[0].removedDocs", removedDocs))
       await setDocuments(
        response,
        "Applications[0].applicationDocuments",
        "temp[0].reviewDocData",
        dispatch,'ES'
      );
      await setDocuments(
        response,
        "Applications[0].wfDocuments",
        "temp[0].reviewWfDocData",
        dispatch, ''
      )
       const {branchType, moduleType, applicationType} = Applications[0];
       const type = `${branchType}_${moduleType}_${applicationType}`;
       const application = Applications[0]
       const headerLabel = `ES_${type.toUpperCase()}`

       if (branchType == "ManiMajra") {
        await setDocuments(
          response,
          "Applications[0].applicationDetails.sampleSiteMap",
          "temp[0].reviewSampleSiteMap",
          dispatch,'ES'
        );
       }

       const headerrow = getCommonApplyHeader({label: headerLabel, number: applicationNumber});
       let {uiConfig, wfDocumentList = []} = await getApplicationConfig({dispatch, applicationType: type})
       wfDocumentList = wfDocumentList.filter(item => eval(item.filter))
       let {preview} = uiConfig
       let reviewDetails = await setThirdStep({state, dispatch, preview, applicationType: type, data: Applications[0], isEdit: false, showHeader: false});
       const estimateResponse = await createEstimateData(Applications[0], dispatch, window.location.href)
const nocReview=getReviewNoc()
reviewDetails = {nocReview, ...reviewDetails}
       if((!!estimateResponse && ((estimateResponse.Payments && !!estimateResponse.Payments.length) || (!!estimateResponse.billDetails && !!estimateResponse.billDetails.length)))) {
         const estimate = !!estimateResponse ? getCommonGrayCard({
           estimateSection: getFeesEstimateCard({
             sourceJsonPath: "temp[0].estimateCardData"
            })
          }) : {}
          reviewDetails = {estimate, ...reviewDetails}
       }
        if(process.env.REACT_APP_NAME === "Citizen" ? applicationState === "ES_PENDING_PAYMENT" || applicationState === "ES_MM_PENDING_PAYMENT" || applicationState === "ES_PENDING_CITIZEN_TEMPLATE_SUBMISSION" || applicationState === "ES_PENDING_CITIZEN_NOTICE_SUBMISSION" || applicationState === "ES_PENDING_CITIZEN_NOTICE_DOCUMENTS" || applicationState === "ES_PENDING_JE_VERIFICATION" || applicationState === "ES_MM_PENDING_BI_VERIFICATION" || applicationState === "ES_MM_PENIDNG_CITIZEN_NOTICE" : applicationState === "ES_PENDING_JE_VERIFICATION" || applicationState === "ES_MM_PENDING_BI_VERIFICATION") {
          footer = footerReview(
            action,
            state,
            dispatch,
            applicationState,
            applicationNumber,
            tenantId,
            businessService,
            branchType
          )
        }

        if(!!wfDocumentList.length) {
          const templateDocuments = wfDocumentList.map(item => ({
            type: item.code,
            description: {
              labelName: item.fileType,
              labelKey: item.fileType,
            },
            formatProps :{
              accept : item.accept,
            }, 
            maxFileSize: 6000,
            moduleName: "ES",
            statement: {
                labelName: item.description,
                labelKey: item.description
            }
          }))
          const documentTypes = wfDocumentList.map((item, index) => ({
            name: item.code,
            required: item.required,
            jsonPath: `templateDocuments[${index}]`,
            statement: item.description
            }))
          dispatch(prepareFinalObject("temp[0].templateDocuments", documentTypes))
          const documentProps = {
                buttonLabel: {
                  labelName: "UPLOAD FILE",
                  labelKey: "ES_BUTTON_UPLOAD_FILE"
                },
                inputProps : templateDocuments,
                documentsJsonPath: "temp[0].templateDocuments",
                uploadedDocumentsJsonPath: "temp[0].uploadedDocsInRedux",
                tenantIdJsonPath: "Applications[0].tenantId",
                documentTypePrefix: ""
              }
          taskStatusProps = {documentProps, documentsJsonPath: "templateDocuments"}
        }
       printCont = downloadPrintContainer(
          action,
          state,
          dispatch,
          applicationState,
          applicationType,
          branchType,
          application
        );        
        reviewDetails = getCommonCard({...reviewDetails});
        
        set(
          reviewDetails, 
          "children.cardContent.children.ES_SITE_REPORT_DETAILS_HEADER.visible",
          (!!siteReportUser && branchType == "ManiMajra" && process.env.REACT_APP_NAME !== "Citizen")
        )
        set(
          reviewDetails, 
          "children.cardContent.children.ES_SAMPLE_SITE_MAP_HEADER.visible",
          (!!siteReportUser && branchType == "ManiMajra" && process.env.REACT_APP_NAME !== "Citizen")
        )
        set(
          reviewDetails, 
          "children.cardContent.children.ES_HARD_COPY_DATE.visible",
          (!!hardcopyReceivedDate)
        )
        set(
          reviewDetails, 
          "children.cardContent.children.nocReview.visible",
          (!!applicationDetails.khasraNo && branchType == "BuildingBranch" && process.env.REACT_APP_NAME !== "Citizen")
        )
        return {
                div: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    props: {
                      className: "common-div-css search-preview"
                    },
                    children: {
                      headerDiv: {
                        uiFramework: "custom-atoms",
                        componentPath: "Container",
                        children: {
                          header: {
                            gridDefination: {
                              xs: 12,
                              sm: 8
                            },
                           ...headerrow
                          },
                          helpSection: {
                            uiFramework: "custom-atoms",
                            componentPath: "Container",
                            props: {
                              color: "primary",
                              style: { justifyContent: "flex-end" }
                            },
                            gridDefination: {
                              xs: 12,
                              sm: 4,
                              align: "right"
                            },
                            children: printCont
                              
                          }
                          }
                        },
                        taskStatus: {
                          uiFramework: "custom-containers-local",
                          moduleName: "egov-estate",
                          componentPath: "WorkFlowContainer",
                          props: {
                            dataPath: "Applications",
                            updateUrl: "/est-services/application/_update",
                            ...taskStatusProps
                          }
                        },
                        actionDialog: {
                          uiFramework: "custom-containers-local",
                          componentPath: "ResubmitActionContainer",
                          moduleName: "egov-estate",
                          visible: process.env.REACT_APP_NAME === "Citizen" ? true : false,
                          props: {
                            dataPath: "Applications",
                            updateUrl: "/est-services/application/_update",
                            data: {
                              buttonLabel: "SUBMIT",
                              dialogHeader: {
                                labelName: "RESUBMIT Application",
                                labelKey: "WF_RESUBMIT_APPLICATION"
                              },
                              showEmployeeList: false,
                              roles: "CITIZEN",
                              isDocRequired: true,
                              ...taskStatusProps
                            },
                            documentsJsonPath: "templateDocuments",
                          }
                        },
                        reviewDetails,
                        footer
                    }
                  }
        }
    } catch (error) {
      console.log("=====error", error)
        return {}
    }
 }

const commonPreview = {
    uiFramework: "material-ui",
    name: "preview",
    hasBeforeInitAsync: true,
    beforeInitScreen: async (action, state, dispatch) => {
        dispatch(toggleSpinner())
        const components = await getData(action, state, dispatch)
        dispatch(toggleSpinner())
        return {
          "type": "INIT_SCREEN",
          "screenKey": "preview",
          "screenConfig": {
            "uiFramework": "material-ui",
            "name": "preview",
            components
          }
        }
    }
}

export default commonPreview;