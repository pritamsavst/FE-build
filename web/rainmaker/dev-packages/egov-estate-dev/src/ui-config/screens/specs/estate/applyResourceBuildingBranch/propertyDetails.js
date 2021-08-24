import {
  getCommonCard,
  getSelectField,
  getTextField,
  getDateField,
  getCommonTitle,
  getPattern,
  getCommonContainer,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import {
  displayDefaultErr,
  displayCustomErr,
  _getPattern
} from "../../utils";

export const categoryField = {
  label: {
    labelName: "Category",
    labelKey: "ES_CATEGORY_LABEL"
  },
  placeholder: {
    labelName: "Select Category",
    labelKey: "ES_CATEGORY_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].category",
  sourceJsonPath: "applyScreenMdmsData.EstateServices.categories",
  gridDefination: {
    xs: 12,
    sm: 6
  },
  errorMessage:"ES_ERR_CATEGORY",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(
      handleField(
        action.screenKey,
        `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
        "props.value",
        ""
      )
    )

    if (action.value == "CAT.RESIDENTIAL" || action.value == "CAT.COMMERCIAL") {
      dispatch(
        handleField(
          action.screenKey,
          `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "visible",
          true
        )
      );

      const categories = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreenMdmsData.EstateServices.categories"
      )

      const filteredCategory = categories.filter(item => item.code === action.value);
      dispatch(
        handleField(
          action.screenKey,
          `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "props.data",
          filteredCategory[0].SubCategory
        )
      )
    } else {
      dispatch(
        handleField(
          action.screenKey,
          `components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.subCategory`,
          "visible",
          false
        )
      );
    }
  }
}

export const subCategoryField = {
  label: {
    labelName: "Sub Category",
    labelKey: "ES_SUBCATEGORY_LABEL"
  },
  placeholder: {
    labelName: "Select Sub Category",
    labelKey: "ES_SUBCATEGORY_PLACEHOLDER"
  },
  required: true,
  jsonPath: "Properties[0].subCategory",
  visible: false,
  gridDefination: {
    xs: 12,
    sm: 6
  },
  errorMessage:"ES_ERR_SUB_CATEGORY"
}

export const siteNumberField = {
  label: {
    labelName: "Site Number/SCO/Booth",
    labelKey: "ES_SITE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter Site Number",
    labelKey: "ES_SITE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: _getPattern("file-number-only-with-no-firstdigit-zero"),
  jsonPath: "Properties[0].siteNumber",
  errorMessage:"ES_ERR_SITE_BOOTH_NUMBER",
  afterFieldChange: (action, state, dispatch) => {
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    }    else if(action.value.length < 2){
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MINLENGTH_2", action.screenKey);
  }
  else {
      displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_SITE_BOOTH_NUMBER",action.screenKey);
  }
  }
}

// export const sectorNumberField = {
//   label: {
//     labelName: "Sector Number",
//     labelKey: "ES_SECTOR_NUMBER_LABEL"
//   },
//   placeholder: {
//     labelName: "Select Sector Number",
//     labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
//   },
//   required: true,
//   jsonPath: "Properties[0].sectorNumber",
//   sourceJsonPath: "applyScreenMdmsData.EstateServices.sector",
//   gridDefination: {
//     xs: 12,
//     sm: 6
//   },
//   errorMessage:"ES_ERR_SECTOR_NUMBER"
// }
export const sectorNumberField= {
  uiFramework: "custom-containers-local",
  moduleName: "egov-estate",
  componentPath: "AutosuggestContainer",
  jsonPath: "Properties[0].sectorNumber",
  required: true,
  gridDefination: {
    xs: 12,
    sm: 6
  },
  props: {
    // style: {
    //   width: "100%",
    //   cursor: "pointer"
    // },
    // localePrefix: {
    //   moduleName: "TENANT",
    //   masterName: "TENANTS"
    // },
   // className: "citizen-city-picker",
    label: {
          labelName: "Sector Number",
          labelKey: "ES_SECTOR_NUMBER_LABEL"
        },
        placeholder: {
          labelName: "Select Sector Number",
          labelKey: "ES_SECTOR_NUMBER_PLACEHOLDER"
        },
    jsonPath: "citiesByModule.citizenTenantId",
    sourceJsonPath: "applyScreenMdmsData.EstateServices.sector",
    labelsFromLocalisation: true,
    //fullwidth: true,
    required: true,
    inputLabelProps: {
      shrink: true
    }
  },
  errorMessage:"ES_ERR_SECTOR_NUMBER"
}
const fileNumberField = {
  label: {
    labelName: "File Number",
    labelKey: "ES_FILE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter File Number",
    labelKey: "ES_FILE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  errorMessage:"ES_ERR_FILENUMBER_FEILD",
  pattern: _getPattern("file-number-no-firstdigit-zero"),
  jsonPath: "Properties[0].fileNumber",
  afterFieldChange: (action, state, dispatch) => {
    dispatch(handleField(
      "apply-building-branch",
      "components.div.children.footer.children.nextButton",
      "props.disabled",
      false
    ))
    if (action.value.length > 50) {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_50", action.screenKey);
    } else {
      displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_FILENUMBER_FEILD",action.screenKey);
    }
  }
}

const houseNumberField = {
  label: {
    labelName: "House Number",
    labelKey: "ES_BB_HOUSE_NUMBER_LABEL"
  },
  placeholder: {
    labelName: "Enter House Number",
    labelKey: "ES_BB_HOUSE_NUMBER_PLACEHOLDER"
  },
  gridDefination: {
    xs: 12,
    sm: 6
  },
  required: true,
  pattern: /^((\w+)\-(\d+))$/,
  errorMessage:"ES_BB_ERR_HOUSE_NUMBER",
  jsonPath: "Properties[0].propertyDetails.houseNumber",

}

export const mohallaField = {
  label: {
      labelName: "Mohalla",
      labelKey: "ES_MOHALLA_LABEL"
  },
  placeholder: {
      labelName: "Enter Mohalla",
      labelKey: "ES_MOHALLA_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: true,
  pattern: _getPattern("alphabet"),
  jsonPath: "Properties[0].propertyDetails.mohalla",
  errorMessage:"ES_ERR_MOHALLA_FEILD",
  afterFieldChange: (action, state, dispatch) => {
      if (action.value.length > 150) {
          displayCustomErr(action.componentJsonpath, dispatch, "ES_ERR_MAXLENGTH_150", action.screenKey);
      }
      else {
        displayCustomErr(action.componentJsonpath, dispatch,"ES_ERR_MOHALLA_FEILD", action.screenKey);
      }
  }
}

const villageField = {
  label: {
      labelName: "Village",
      labelKey: "ES_VILLAGE_LABEL"
  },
  placeholder: {
      labelName: "Enter Village",
      labelKey: "ES_VILLAGE_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  required: true,
  //pattern: _getPattern("alphabet"),
  sourceJsonPath: "applyScreenMdmsData.EstateServices.village",
  jsonPath: "Properties[0].propertyDetails.village",
  errorMessage:"ES_ERR_VILLAGE_FEILD",
  beforeFieldChange: (action, state, dispatch) => {
    const villages = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.EstateServices.village") || []
    const findItem = villages.find(item => item.code === action.value)
    let currentvillage=get(state.screenConfiguration.preparedFinalObject,"Properties[0].propertyDetails.village")
    if(action.value !== currentvillage){
      dispatch(
              handleField(
               "apply-building-branch",
                "components.div.children.formwizardFirstStep.children.propertyDetails.children.cardContent.children.detailsContainer.children.houseNumber",
                "props.value",
                findItem.house
              )
            )
  }
}
}

const sizeOfAreaPurchasedField = {
  label: {
      labelName: "The size of area purchased",
      labelKey: "ES_SIZE_OF_AREA_PURCHASED_LABEL"
  },
  placeholder: {
      labelName: "Enter the size of area purchased",
      labelKey: "ES_SIZE_OF_AREA_PURCHASED_PLACEHOLDER"
  },
  gridDefination: {
      xs: 12,
      sm: 6
  },
  pattern: _getPattern("areaSqFeet"),
  required: false,
  errorMessage:"ES_ERR_AREA_OF_PROPERTY_FIELD_TWO_TO_FIVE",
  jsonPath: "Properties[0].propertyDetails.areaSqft",
}

export const propertyDetailsHeader = getCommonTitle({
  labelName: "Property Details",
  labelKey: "ES_PROPERTY_DETAILS_HEADER"
}, {
  style: {
      marginBottom: 18,
      marginTop: 18
  }
})
export const propertyDetails = getCommonCard({
  header: propertyDetailsHeader,
  detailsContainer: getCommonContainer({
    fileNumber: getTextField(fileNumberField),
    category: getSelectField(categoryField),
    subCategory: getSelectField(subCategoryField),
 //   siteNumber: getTextField(siteNumberField),
    sectorNumber: getSelectField(sectorNumberField),
    mohalla: getTextField(mohallaField),
    village: getSelectField(villageField),
    sizeOfAreaPurchase: getTextField(sizeOfAreaPurchasedField),
    houseNumber: getTextField(houseNumberField)
  })
})