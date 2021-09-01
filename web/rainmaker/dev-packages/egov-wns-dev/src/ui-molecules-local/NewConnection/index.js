import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import KeyboardRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { Link } from "react-router-dom";



const styles = theme => ({
  root: {
    margin: "2px 8px",
    backgroundColor: theme.palette.background.paper
  }
});

class NewConnection extends React.Component {

  clickHandler = (type) => {
    const {
      screenConfig,
      toggleSnackbar,
      handleField,
      setRoute,
      moduleName,
      jsonPath,
      value,
      preparedFinalObject,
    } = this.props;

    // let toggle = get(
    //   screenConfig[route.screenKey],
    //   `${route.jsonPath}.props.open`,
    //   false
    // );
   // handleField(route.screenKey, route.jsonPath, "props.open", !toggle);
  // window.location.href = "wns/apply"
  const {searchScreen} = preparedFinalObject
  if(type ==='ACTIVITY')
  {
    if(searchScreen)
    {
      if(searchScreen.connectionNo)
      {
  
      }
    }
    else{
      toggleSnackbar(
        true,
        {
          labelName: "Please select Consumer No",
          labelKey: "WS_SELECT_CONNECTION_VALIDATION_MESSAGE"
        },
        "warning"
      ); 

    }
   

  }
  else{
    const applyUrl = "../wns/apply"
    //setRoute(applyUrl)
    window.location.href = applyUrl
    //dispatch(setRoute(applyUrl));
  }
  

  };
  render() {
    const { classes, items } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav" onClick={() => this.clickHandler('WATER')}>
          <ListItem button>
            <ListItemText
              primary={
                <LabelContainer
                  labelKey="WS_COMMON_APPL_NEW_CONNECTION"
                  style={{
                    fontSize: 14,
                    color: "rgba(0, 0, 0, 0.8700000047683716)"
                  }}
                />
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <KeyboardRightIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
       
     
      </div>
    );
  }
}

const mapStateToProps = state => {
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  const moduleName = get(state.screenConfiguration, "moduleName");
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { screenConfig, moduleName ,preparedFinalObject};
};

const mapDispatchToProps = dispatch => {
  return {
    handleField: (screenKey, jsonPath, fieldKey, value) =>
      dispatch(handleField(screenKey, jsonPath, fieldKey, value)),
      toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: path => dispatch(setRoute(path)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
      
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewConnection)
);
