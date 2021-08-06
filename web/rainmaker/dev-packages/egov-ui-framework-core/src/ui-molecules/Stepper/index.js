import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LabelContainer from "../../ui-containers/LabelContainer";

const styles = theme => ({
  root: {
    width: "100%",
    overflowY:window.innerWidth <900 ?"auto !important":"",
    overflowX : "auto"
  },
  MuiStepHorizontal:{
    minWidth:"90px"
  }
});

class HorizontalLabelPositionBelowStepper extends React.Component {
  render() {
    
    const { classes, activeStep, steps } = this.props;
    return (
      <div className={classes.root}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          style={{
            background: "inherit"
          }}
        >
          {steps.map(label => {
            return (
              <Step key={label} className={classes.MuiStepHorizontal}>
                <StepLabel>
                  <LabelContainer {...label} />
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  }
}

HorizontalLabelPositionBelowStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);
