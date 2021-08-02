import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter, showHideAdhocPopup } from "../../utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
    getapplicationType,
    getapplicationNumber,
    getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import get from "lodash/get";
import set from "lodash/set";
import { callBackForSearch } from "../checkavailabilityForm_room";
export const callBackForCancel = (state, dispatch) => {
    dispatch(setRoute("/egov-services/my-applications"));
};

export const goAfterConfirmation = (state, dispatch) => {
    let applicationNumber = getapplicationNumber()
    let businessService = getapplicationType();
    let tenantId = getTenantId().split(".")[0]
    const booktingVenueType = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.bkBookingType",
        {}
    );
    dispatch(setRoute(`/egov-services/checkavailability_pcc?applicationNumber=${applicationNumber}&tenantId=${tenantId}&businessService=${businessService}&changeDateVenue=Enabled&booktingVenueType=${booktingVenueType}`));
};

export const callBackForEdit = (state, dispatch) => {
    let toggle = get(
      state.screenConfiguration.screenConfig["pcc-search-preview"],
      "components.cityPickerDialog.props.open",
      false
    );
    const roomsExistsInBooking = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.roomsModel",
        {}
    );
    if(roomsExistsInBooking.length > 0){
        dispatch(
            handleField("pcc-search-preview", "components.cityPickerDialog", "props.open", !toggle)
          );
    }else{
        goAfterConfirmation(state, dispatch);
    }

  };

export const callBackForNext = (state, dispatch, pathKey) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    dispatch(
        setRoute(
            `/egov-services/pay?applicationNumber=${applicationNumber}&tenantId=${
            getTenantId().split(".")[0]
            }&businessService=${businessService}`
        )
    );
};

export const callBackForCancelParkAndCC = (state, dispatch) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    ); 
    dispatch(
        setRoute(
            `/egov-services/cancelparkccbooking?applicationNumber=${applicationNumber}&tenantId=${
            getTenantId().split(".")[0]
            }&businessService=${businessService}`
        )
    );
};


export const callBackForRefundSecurityFee = (state, dispatch) => {
    const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
    );
    const businessService = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.businessService",
        {}
    );
    
    if(businessService==="PACC"){
        dispatch(
            setRoute(
                `/egov-services/refundsecfeeparkccbooking?applicationNumber=${applicationNumber}&tenantId=${
                getTenantId().split(".")[0]
                }&businessService=${businessService}`
            )
        );
    }else{
        dispatch(
            setRoute(
                `/egov-services/refundsecfeecgbooking?applicationNumber=${applicationNumber}&tenantId=${
                getTenantId().split(".")[0]
                }&businessService=${businessService}`
            )
        );
    }
    
};

export const footer = getCommonApplyFooter({

    cancelButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {

            previousButtonLabel: getLabel({
                labelName: "CANCEL",
                labelKey: "BK_MY_BK_BUTTON_CANCEL",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForCancel,
        },
        visible: false,
    },



    submitButton: {
        componentPath: "Button",
        props: {
            variant: "contained",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "45px",
                borderRadius: "inherit",
            },
        },
        children: {
            nextButtonLabel: getLabel({
                labelName: "Make Payment",
                labelKey: "BK_MY_BK_BUTTON_PAYMENT",
            }),

        },
        onClickDefination: {
            action: "condition",
            // callBack: callBackForNext,
            callBack: (state, dispatch) =>
                callBackForNext(state, dispatch, "pay"),
        },
        visible: false,

    },
});

export const footerForCg = getCommonApplyFooter({
    refundSecurityFeeButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {

            previousButtonLabel: getLabel({
                labelName: "REFUND SECURITY",
                labelKey: "REFUND SECURITY",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForRefundSecurityFee,
        },
        visible: false,
    },
})

export const footerForParkAndCC = getCommonApplyFooter({
    bookRoomButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {

            previousButtonLabel: getLabel({
                labelName: "BOOK ROOM",
                labelKey: "BOOK ROOM",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) =>{
                const applicationNumberForCC = get(
                    state,
                    "screenConfiguration.preparedFinalObject.Booking.bkApplicationNumber",
                    {}
                );
             
                dispatch(prepareFinalObject("ccApplicationNumber", applicationNumberForCC))
                // callBackForSearch(state, dispatch)
                dispatch(setRoute("/egov-services/checkavailability_room"));
            },
           },
        visible:false
    },
    refundSecurityFeeButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {

            previousButtonLabel: getLabel({
                labelName: "REFUND SECURITY",
                labelKey: "REFUND SECURITY",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForRefundSecurityFee,
        },
        visible: false,
    },
    cancelButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "16px",
                borderRadius: "inherit",
            },
        },
        children: {
            previousButtonLabel: getLabel({
                labelName: "CANCEL BOOKING",
                labelKey: "BK_PACC_BUTTON_CANCEL_BOOKING",
            }),
        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForCancelParkAndCC,
        },
        visible: false,
    },
    editButton: {
        componentPath: "Button",
        props: {
            variant: "outlined",
            color: "primary",
            style: {
                minWidth: "180px",
                height: "48px",
                marginRight: "45px",
                borderRadius: "inherit",
            },
        },
        children: {
            nextButtonLabel: getLabel({
                labelName: "CHANGE DATE/VENUE",
                labelKey: "BK_PACC_CHANGE_DATE_VENUE_BUTTON_EDIT",
            }),

        },
        onClickDefination: {
            action: "condition",
            callBack: callBackForEdit,
        },
        visible: false,

    },
});