import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getTextField,
    getPattern,
    getLabelWithValue,
    getLabel,
    getSelectField,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  let IsEdit = process.env.REACT_APP_NAME === "Citizen"?false:true;
  let IsEditP = process.env.REACT_APP_NAME === "Citizen"?false:true;
  const service = getQueryArg(window.location.href, "actionType");
  if(service === 'UPDATE_CONNECTION_HOLDER_INFO')
  {
    IsEdit = true

  }
  else
  {
    IsEdit = false;
  }

  const connHolderDetail = getCommonContainer({
    applicantName: getTextField({
      label: {
        labelName: "Name",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Name",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_PLACEHOLDER"
      },
      required: true,
      props: {
        
        disabled: IsEdit,
    },
      pattern: getPattern("Name"),
      errorMessage: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL_VALIDATION",
      jsonPath: "connectionHolders[0].name",
      gridDefination: {
        xs: 12,
        sm: 6
      }
    }),
    mobileNumber: getTextField({
      label: {
        labelName: "Mobile Number",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_PLACEHOLDER"
      },
      props: {
        
        disabled: IsEdit,
    },
      required: true,
      pattern: getPattern("MobileNo"),
      errorMessage: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL_VALIDATION",
      jsonPath: "connectionHolders[0].mobileNumber",
      gridDefination: {
        xs: 12,
        sm: 6
      },
    }),
    email: getTextField({
      label: {
        labelName: "email",
        labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL"
      },
      placeholder: {
        labelName: "Enter email",
        labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL_PLACEHOLDER"
      },
      
      pattern: getPattern("Email"),
      required: false,
     errorMessage: "WS_OWNER_DETAILS_EMAIL_LABEL_VALIDATION",
      jsonPath: "connectionHolders[0].emailId",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        className: "applicant-details-error",
        disabled: IsEdit,
      }
    }),

    // genderRadioGroup: {
    //   uiFramework: "custom-containers",
    //   componentPath: "RadioGroupContainer",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   jsonPath: "connectionHolders[0].gender",
    //   props: {
    //     label: { name: "Gender", key: "WS_CONN_HOLDER_OWN_DETAIL_GENDER_LABEL" },
    //     className: "applicant-details-error",
    //     buttons: [
    //       {
    //         labelName: "Male",
    //         labelKey: "WS_CONN_HOLDER_COMMON_GENDER_MALE",
    //         value: "MALE"
    //       },
    //       {
    //         labelName: "FEMALE",
    //         labelKey: "WS_CONN_HOLDER_COMMON_GENDER_FEMALE",
    //         value: "FEMALE"
    //       },
    //       {
    //         labelName: "Transgender",
    //         labelKey: "WS_CONN_HOLDER_COMMON_GENDER_TRANSGENDER",
    //         value: "TRANSGENDER"
    //       }
    //     ],
    //     jsonPath: "connectionHolders[0].gender",
    //     required: true,
    //     errorMessage: "Required",
    //   },
    //   required: true,
    //   type: "array"
    // },
    // guardianName: getTextField({
    //   label: {
    //     labelName: "Father/Husband's Name",
    //     labelKey: "WS_CONN_HOLDER_COMMON_FATHER_OR_HUSBAND_NAME"
    //   },
    //   placeholder: {
    //     labelName: "Enter Father/Husband's Name",
    //     labelKey: "WS_CONN_HOLDER_COMMON_ENTER_FATHER_OR_HUSBAND_NAME_PLACEHOLDER"
    //   },
    //   required: true,
    //   pattern: getPattern("Name"),
    //   errorMessage: "Invalid Name",
    //   jsonPath: "connectionHolders[0].fatherOrHusbandName",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    // }),
    // relationshipWithGuardian: getSelectField({
    //   label: {
    //     labelName: "Relationship with Guardian",
    //     labelKey: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Select Relationship with Guardian",
    //     labelKey: "WS_CONN_HOLDER_OWN_DETAIL_RELATION_PLACEHOLDER"
    //   },
    //   required: true,
    //   jsonPath: "connectionHolders[0].relationship",
    //   data: [{ code: "FATHER" }, { code: "HUSBAND" }],
    //   localePrefix: {
    //     moduleName: "common-masters",
    //     masterName: "OwnerType"
    //   },
    //   //sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   }
    // }),
    correspondenceAddress: getTextField({
      label: {
        labelName: "Correspondence Address",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD"
      },
      placeholder: {
        labelName: "Enter Correspondence Address",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD_PLACEHOLDER"
      },
      //pattern: getPattern("Address"),
      pattern: /^[^\$\"'<>\?~`!&@#$%^+={}\[\]*:;]{1,500}$/i,
      
      required: true,
      errorMessage: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD_VALIDATION",
      jsonPath: "connectionHolders[0].correspondenceAddress",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        className: "applicant-details-error",
        disabled: IsEdit,
      }
    }),
    aadharNo: getTextField({
      label: {
        labelName: "Aadhar Card number",
        labelKey: "WS_OWN_DETAIL_ADDHAR_NO"
      },
      placeholder: {
        labelName: "Enter Aadhar Card number",
        labelKey: "WS_OWN_DETAIL_ADDHAR_NO_PLACEHOLDER"
      },
      pattern: getPattern("AdharCardNumber"),
      required: false,
      visible:true,
     // errorMessage: "Invalid Address",
      jsonPath: "connectionHolders[0].aadhaarNumber",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        className: "applicant-details-error",
        disabled:IsEdit
      }
    }),
    // specialApplicantCategory: getSelectField({
    //   label: {
    //     labelName: "Special Applicant Category",
    //     labelKey: "WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_LABEL"
    //   },
    //   placeholder: {
    //     labelName: "Select Special Applicant Category",
    //     labelKey: "WS_CONN_HOLDER_OWN_DETAIL_SPECIAL_APPLICANT_PLACEHOLDER"
    //   },
    //   jsonPath: "connectionHolders[0].ownerType",
    //   required: true,
    //   visible:false,
    //   localePrefix: {
    //     moduleName: "common-masters",
    //     masterName: "OwnerType"
    //   },
    //   sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   }
    // }),
  });
  const proconnHolderDetail = getCommonContainer({
    applicantName: getTextField({
      label: {
        labelName: "Name",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Name",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_PLACEHOLDER"
      },
      required: true,
      props: {
        
        disabled: IsEditP,
    },
      pattern: getPattern("Name"),
      errorMessage: "WS_CONN_HOLDER_OWN_DETAIL_OWN_NAME_LABEL_VALIDATION",
      jsonPath: "connectionHolders[0].proposedName",
      gridDefination: {
        xs: 12,
        sm: 6
      }
    }),
    mobileNumber: getTextField({
      label: {
        labelName: "Mobile Number",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Mobile No.",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_PLACEHOLDER"
      },
      props: {
        
        disabled: IsEditP,
    },
      required: true,
      pattern: getPattern("MobileNo"),
      errorMessage: "WS_CONN_HOLDER_OWN_DETAIL_MOBILE_NO_LABEL_VALIDATION",
      jsonPath: "connectionHolders[0].proposedMobileNo",
      gridDefination: {
        xs: 12,
        sm: 6
      },
    }),
    email: getTextField({
      label: {
        labelName: "email",
        labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL"
      },
      placeholder: {
        labelName: "Enter email",
        labelKey: "WS_OWNER_DETAILS_EMAIL_LABEL_PLACEHOLDER"
      },
      
      pattern: getPattern("Email"),
      required: false,
      visible:false,
      errorMessage: "WS_OWNER_DETAILS_EMAIL_LABEL_VALIDATION",
      jsonPath: "connectionHolders[0].emailId",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        className: "applicant-details-error",
        disabled: IsEditP,
      }
    }),

   
    correspondenceAddress: getTextField({
      label: {
        labelName: "Correspondence Address",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD"
      },
      placeholder: {
        labelName: "Enter Correspondence Address",
        labelKey: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD_PLACEHOLDER"
      },
      //pattern: getPattern("Address"),
      pattern: /^[^\$\"'<>\?~`!&@#$%^+={}\[\]*:;]{1,500}$/i,
      
      required: true,
      errorMessage: "WS_CONN_HOLDER_OWN_DETAIL_CROSADD_VALIDATION",
      jsonPath: "connectionHolders[0].proposedCorrespondanceAddress",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      props: {
        className: "applicant-details-error",
        disabled: IsEditP,
      }
    }),
   
  });

  export const sameAsOwner=getCommonContainer({
    sameAsOwnerDetails: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "CheckboxContainerConnHolder",
      gridDefination: { xs: 12, sm: 12, md: 12 },
      props: {
        label: {
          name: "connection holder details",
          key: "WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS",
        },
        jsonPath: "connectionHolders[0].sameAsPropertyAddress",
        required: false,
        isChecked: false
      },
      type: "array",
      jsonPath: "connectionHolders[0].sameAsPropertyAddress"
    },
    });

    export const proposedholderHeader = getCommonSubHeader({
        labelKey: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER_PROPOSED",
        labelName: "proposedConnection Holder Details"
      })
      export const holderHeader = getCommonSubHeader({
        labelKey: "WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER",
        labelName: "Connection Holder Details"
      })
  
export const getHolderDetails = (isEditable = true) => {
  return getCommonContainer({
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
          }
        },
      }
    },
    holderDetails: connHolderDetail
  });
};
export const getproposedHolderDetails = (isEditable = true) => {
  return getCommonContainer({
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
          }
        },
      }
    },
    holderDetails: proconnHolderDetail
  });
};