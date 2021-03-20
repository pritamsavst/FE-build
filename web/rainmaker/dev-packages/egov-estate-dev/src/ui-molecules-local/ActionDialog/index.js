import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { get } from "lodash";
import {DocumentListContainer} from "../../ui-containers-local";
import store from "egov-workflow/ui-redux/store";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const fieldConfig = {
  approverName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_PLACEHOLDER"
    }
  },
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "ES_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  },
  termsandcondition: {
    label: {
      labelName: "Comments",
      labelKey: "ES_COMMON_TERMS AND CONDITIONS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "ES_COMMON_TERMS AND CONDITIONS_PLACEHOLDER"
    }
  },
  mandatoryComments: {
    label: {
      labelName: "Comments",
      labelKey: "ES_MANDATORY_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  },
  
  hardCopyReceivedDate: {
    label: {
      labelName: "Hard Copy Received Date",
      labelKey: "ES_HARD_COPY_RECEIVED_DATE"
    }
  }
};

let bb_payment_config = [
  {
    label: {
      labelName: "Development Charges",
      labelKey: "ES_BB_DEVELOPMENT_CHARGES"
    },
    placeholder: {
      labelName: "Enter Development Charges",
      labelKey: "ES_BB_DEVELOPMENT_CHARGES_PLACEHOLDER"
    },
    path: "developmentCharges",
    required: true,
    errorMessage: "ES_ERR_DEVELOPMENT_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "Conversion Charges",
      labelKey: "ES_BB_CONVERSION_CHARGES"
    },
    placeholder: {
      labelName: "Enter Conversion Charges",
      labelKey: "ES_BB_CONVERSION_CHARGES_PLACEHOLDER"
    },
    path: "conversionFee",
    required: true,
    errorMessage: "ES_ERR_CONVERSION_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "Scrutiny Charges",
      labelKey: "ES_BB_SCRUTINY_CHARGES"
    },
    placeholder: {
      labelName: "Enter Scrutiny Charges",
      labelKey: "ES_BB_SCRUTINY_CHARGES_PLACEHOLDER"
    },
    path: "scrutinyCharges",
    required: true,
    errorMessage: "ES_ERR_SCRUTINY_CHARGES",
    showError: false
  },
  {
    label: {
      labelName: "Transfer Fees",
      labelKey: "ES_BB_TRANSFER_FEES"
    },
    placeholder: {
      labelName: "Enter Transfer Fees",
      labelKey: "ES_BB_TRANSFER_FEES_PLACEHOLDER"
    },
    path: "transferFee",
    required: true,
    errorMessage: "ES_ERR_TRANSFER_FEES",
    showError: false
  },
  {
    label: {
      labelName: "Allotment Number",
      labelKey: "ES_BB_ALLOTMENT_NUMBER"
    },
    placeholder: {
      labelName: "Enter Allotment Number",
      labelKey: "ES_BB_ALLOTMENT_NUMBER_PLACEHOLDER"
    },
    path: "applicationNumberCharges",
    required: true,
    errorMessage: "ES_ERR_ALLOTMENT_NUMBER",
    showError: false
  }
]

const getEpoch = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};

class ActionDialog extends React.Component {
  state = {
    hardCopyReceivedDateError: false,
    commentsErr:false,
    documentsErr: false
  };

  getButtonLabelName = label => {
    switch (label) {
      case "FORWARD":
        return "Verify and Forward";
      case "MARK":
        return "Mark";
      case "REJECT":
        return "Reject";
      case "CANCEL":
      case "APPROVE":
        return "APPROVE";
      case "PAY":
        return "Pay";
      case "SENDBACK":
        return "Send Back";
      default:
        return label;
    }
  };

  handleValidation = (buttonLabel, isDocRequired, applicationState) => {
      let {dataPath, state} = this.props;
      dataPath = `${dataPath}[0]`;
      const data = get(state.screenConfiguration.preparedFinalObject, dataPath)
      const validationDate = data.hardCopyReceivedDate;
      const {dialogData} = this.props;
      const {documentsJsonPath, documentProps} = dialogData
      if(!!documentProps) {
        let documents = get(state.screenConfiguration.preparedFinalObject, documentsJsonPath)
        documents = documents.filter(item => !!item)
        if (!documents || !documents.length) {
          this.setState({
            documentsErr: true
          })
          return
        } else {
          this.setState({
            documentsErr: false
          })
        }
      }
      if(buttonLabel === "FORWARD" && (applicationState === "ES_PENDING_DS_VERIFICATION"||applicationState==="ES_MM_PENDING_DS_VERIFICATION")){
        if(!!validationDate) {
          this.props.onButtonClick(buttonLabel, isDocRequired)
        } else {
          this.setState({
            hardCopyReceivedDateError: true
          })
        }
      } else if(buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DRAFSMAN_CALCULATION") {
        bb_payment_config = bb_payment_config.map(payment => ({...payment, isError: !data.applicationDetails[payment.path]}))
        const isError = bb_payment_config.some(payment => !!payment.isError)
        if(isError) {
          return
        } else {
          this.props.onButtonClick(buttonLabel, isDocRequired)
        }
      } else if(buttonLabel == 'APPROVE' || buttonLabel == 'REJECT'){
        const comments = data.comments;
        if(!!comments) {
          this.props.onButtonClick(buttonLabel, isDocRequired)
        } else {
          this.setState({
            commentsErr: true
          })
        }
      } else {
        this.props.onButtonClick(buttonLabel, isDocRequired)
      }
  }

  onClose = () => {
    this.setState({
      hardCopyReceivedDateError: false,
      commentsErr:false,
      documentsErr: false
    })
    this.props.onClose()
  }

  render() {  
    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      dialogData,
      dataPath,
      state
    } = this.props;
    const {
      buttonLabel,
      showEmployeeList,
      dialogHeader,
      moduleName,
      isDocRequired,
      documentProps,
      documentsJsonPath
    } = dialogData;
    const { getButtonLabelName } = this;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    dataPath = `${dataPath}[0]`;

    const applicationState = (get(state.screenConfiguration.preparedFinalObject, dataPath) || {}).state
      let documents = get(state.screenConfiguration.preparedFinalObject, documentsJsonPath) || []
      documents = documents.filter(item => !!item)
    return (
      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={this.onClose}
        maxWidth='sm'
        style={{zIndex:2000}}
      >
        <DialogContent
          children={
            <Container
              children={
                <Grid
                  container="true"
                  spacing={12}
                  marginTop={16}
                  className="action-container"
                >
                  <Grid
                    style={{
                      alignItems: "center",
                      display: "flex"
                    }}
                    item
                    sm={10}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer {...dialogHeader} />
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sm={2}
                    style={{
                      textAlign: "right",
                      cursor: "pointer",
                      position: "absolute",
                      right: "16px",
                      top: "16px"
                    }}
                    onClick={this.onClose}
                  >
                    <CloseIcon />
                  </Grid>
                  {showEmployeeList && applicationState !== "ES_MM_PENDING_DA_FEE" &&!!dropDownData.length && (moduleName === "ES-EB-IS-RefundOfEmd" ? buttonLabel !== "MODIFY" : true) && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.approverName.label}
                        placeholder={fieldConfig.approverName.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        //onChange={e => this.onEmployeeClick(e)}
                        onChange={e =>
                          handleFieldChange(
                            `${dataPath}.assignee`,
                            [e.target.value]
                          )
                        }
                        jsonPath={`${dataPath}.assignee[0]`}
                      />
                    </Grid>
                  )}
                  <Grid item sm="12">
                    <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      // label= {fieldConfig.comments.label }
                      label= {buttonLabel == 'APPROVE' || buttonLabel == 'REJECT' ? fieldConfig.mandatoryComments.label : fieldConfig.comments.label }
                      onChange={e =>
                        handleFieldChange(`${dataPath}.comments`, e.target.value)
                      }
                      // required = {true}
                      //jsonPath={this.open != true ? "" : `${dataPath}.comments`}
                      placeholder={fieldConfig.comments.placeholder}
                      inputProps={{ maxLength: 120 }}
                    />
                    {!!this.state.commentsErr && (<span style={{color: "red"}}>Please enter comments</span>)}
                  </Grid>

                  {buttonLabel === "FORWARD" && (applicationState === "ES_PENDING_DA_PREPARE_LETTER") && (
                  <Grid item sm="12">
                    <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      // label= {fieldConfig.comments.label }
                      label= { fieldConfig.termsandcondition.label}
                      onChange={e =>
                        handleFieldChange(`${dataPath}.termsandconditions`, e.target.value)
                      }
                      // required = {true}
                      //jsonPath={this.open != true ? "" : `${dataPath}.comments`}
                      placeholder={fieldConfig.termsandcondition.placeholder}
                      inputProps={{ maxLength: 120 }}
                    />
                    {/* {!!this.state.commentsErr && (<span style={{color: "red"}}>Please enter comments</span>)} */}
                  </Grid>
                  )}


                  {buttonLabel === "FORWARD" && (applicationState === "ES_PENDING_DS_VERIFICATION" || applicationState == "ES_MM_PENDING_DS_VERIFICATION") && (
                    <Grid item sm="12">
                    <TextFieldContainer
                    type="date"
                    required={true}
                    // defaultValue={new Date().toISOString().split('T')[0]}
                    InputLabelProps={{ shrink: true }}
                    inputProps = {{max: new Date().toISOString().split('T')[0]}}
                    label= {fieldConfig.hardCopyReceivedDate.label}
                    onChange={e =>
                     handleFieldChange( `${dataPath}.hardCopyReceivedDate` , getEpoch(e.target.value))
                   }
                   jsonPath={`${dataPath}.hardCopyReceivedDate`}
                    /> 
                    {!!this.state.hardCopyReceivedDateError && (<span style={{color: "red"}}>Please enter hard copy received date</span>)}
                    </Grid>
                  )}
                  {applicationState === "ES_PENDING_DRAFSMAN_CALCULATION" && buttonLabel === "FORWARD" && bb_payment_config.map(payment => (
                    <Grid payment sm="12">
                    <TextFieldContainer
                    InputLabelProps={{ shrink: true }}
                    label= {payment.label}
                    onChange={e =>
                      handleFieldChange(`${dataPath}.applicationDetails.${payment.path}`, e.target.value)
                    }
                    // required = {true}
                    jsonPath={`${dataPath}.applicationDetails.${payment.path}`}
                    placeholder={payment.placeholder}
                    inputProps={{ maxLength: 120 }}
                    /> 
                    {!!payment.isError && (<span style={{color: "red"}}>{payment.errorMessage}</span>)}
                    </Grid>
                  ))}

                  {!!documentProps && buttonLabel != "SENDBACK" && (
                    <Grid item sm="12">
                    <Typography
                    component="h3"
                    variant="subheading"
                    style={{
                      color: "rgba(0, 0, 0, 0.8700000047683716)",
                      fontFamily: "Roboto",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      marginBottom: "8px"
                    }}
                  >
                    <div className="rainmaker-displayInline">
                      <LabelContainer
                        labelName="Supporting Documents"
                        labelKey="ES_WF_APPROVAL_UPLOAD_HEAD"
                      />
                      {isDocRequired && (
                        <span style={{ marginLeft: 5, color: "red" }}>*</span>
                      )}
                    </div>
                  </Typography>
                  <DocumentListContainer {...documentProps}/>
                  {(this.state.documentsErr && (!documents || !documents.length)) && (<span style={{color: "red"}}>Please upload documents</span>)}
                  </Grid>
                  )}
                  {/* {(buttonLabel === "FORWARD" && applicationState === "ES_PENDING_SO_TEMPLATE_CREATION") && (<Grid item sm="12">
                  <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <div className="rainmaker-displayInline">
                        <LabelContainer
                          labelName="Supporting Documents"
                          labelKey="ES_WF_APPROVAL_UPLOAD_HEAD"
                        />
                        {isDocRequired && (
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                        )}
                      </div>
                    </Typography>
                    <div
                      style={{
                        color: "rgba(0, 0, 0, 0.60)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px"
                      }}
                    >
                      <LabelContainer
                        labelName="Only .jpg and .pdf files. 5MB max file size."
                        labelKey="ES_WF_APPROVAL_UPLOAD_SUBHEAD"
                      />
                    </div>
                    <UploadMultipleFiles
                      maxFiles={4}
                      inputProps={{
                        accept: "image/*, .pdf, .png, .jpeg"
                      }}
                      buttonLabel={{ labelName: "UPLOAD FILES",labelKey : "ES_UPLOAD_FILES_BUTTON" }}
                      jsonPath={`${dataPath}.wfDocuments`}
                      maxFileSize={5000}
                    />
                    </Grid>)} */}

                  <Grid item sm="12">
                    <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                    </Typography>
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={() =>
                          this.handleValidation(buttonLabel, isDocRequired, applicationState)
                          // buttonLabel === "FORWARD" && applicationState === "ES_PENDING_DS_VERIFICATION" ? this.handleValidation(buttonLabel, isDocRequired) : onButtonClick(buttonLabel, isDocRequired,applicationState)
                        }
                      >
                        <LabelContainer
                          labelName={getButtonLabelName(buttonLabel)}
                          labelKey={
                            moduleName
                              ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                              : ""
                          }
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              }
            />
          }
        />
      </Dialog>
    );
  }
}
export default withStyles(styles)(ActionDialog);
