import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextField, Image , DropDown,Icon} from "components";
import { CityPicker } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";

const LoginForm = ({ handleFieldChange, form, onForgotPasswdCLick, logoUrl,languages,onLanguageChange,languageSelected,hasLocalisation }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const callIconStyle = {
    marginLeft: "17px",
    height: "17px",
    width: "17px",
    borderRadius: "50%",
    position: "absolute",
    top: "0px",
  };
  const style = {
    baseStyle: {
      background: "#ffffff",
      height: "30px",
    //  marginRight: "30px",
      width: "98px",
      marginBottom: "10px",
    },
    label: {
      color: "#5F5C57",
      fontSize: "12px",
      paddingRight: "40px",
      top : "-27px"
    },
    iconStyle: {
      top : "-24px",
      fill : "black"
    },
    listStyle: {
      display: "block",
    },
  }
  return (
    <Card
      className="user-screens-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4"
      textChildren={
        <div>
        <marquee width="100%" direction="left" height="50px">
        <Label style={{ marginBottom: "2px" }}        
        color="blue" 
        bold={true} dark={false} 
        fontSize={18} label="CORE_COMMON_MESSAGE_MARQEE" />
        </marquee>
          <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
          {/*}  <div style={{ marginBottom: "24px" }}>
              <Image className="mseva-logo" source={`${logo}`} />
            </div >
          <div style={{marginLeft:"7px", marginBottom: "24px" }}>
          <Label bold={true}  fontSize= "23px" label="|" />
          </div>
      */}
           <div style={{marginLeft:"7px" }}>
              <Label bold={true} color="black" fontSize= "24px"  containerStyle={{height :30}} labelStyle={{height :30}} label="STATE_LABEL" />
           </div>
          </div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
          <TextField onChange={(e, value) => handleFieldChange("username", value)} {...fields.username} />
          <TextField onChange={(e, value) => handleFieldChange("password", value)} {...fields.password}  />
    {/* <CityPicker onChange={handleFieldChange} fieldKey="city" field={fields.city} />  */}
    <div style={{ display: "flex", flexDirection: "column"}}>
          <div style={{ marginBottom: "0px", position: "relative", zIndex: 10 }} className="text-right">       
          <Link to="/forgot-password">
            <div style={{ float: "right" }}>
              <Label
                containerStyle={{ cursor: "pointer", position: "relative", zIndex: 10 ,height: 30,marginRight:25 }}
                labelStyle={{ marginBottom: "12px" }}
                className="forgot-passwd"
                fontSize={14}
                label="CORE_COMMON_FORGOT_PASSWORD"
              />
            </div>
          </Link>
          </div >
          <div style={{ marginBottom: "10px", position: "relative", zIndex: 10,  }} className="text-right">
              {/* <div style={{ display: "inline-block", paddingTop : window.screen.availWidth > 770 ? 0 : 5 }}>
              <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label={languageSelected ?`LANGUAGE_${languageSelected.toUpperCase()}`:'en_IN'} />
              </div>
              <div style={{ display: "inline-block" , float:"right", height:40 }}>
            {hasLocalisation && (
        <DropDown
            onChange={onLanguageChange}
            listStyle={style.listStyle}
            style={style.baseStyle}
            labelStyle={style.label}
            iconStyle={style.iconStyle}
            dropDownData={languages}
            value={languageSelected}
            underlineStyle={{ borderBottom: "none" }}
          />
            )}  
             </div> */}
          </div>
          </div>
          <Button {...submit} fullWidth={true} primary={true} />
          <div style={{  position: "relative",paddingTop:"10px"}} className="text-center">            
                <p>
                In case of any support or query, kindly contact us on
                <br></br>   
                {/* <b  style={{  color:"blue"}} > 0172 2787200</b> */}
                <a
              className="citizen-mobileNumber-style"
              href={`tel:+0172-2787200`}
              style={{ textDecoration: "none", position: "relative" }}
            >
              <Icon action="communication" name="call" style={callIconStyle} color={"#22b25f"} />
              <span
                style={{
                  fontSize:12,// filedBy.includes("@CSR") ? 12 : 14,
                  marginLeft: "43px",
                }}
              >{`0172-2787200`}</span>
            </a>
                </p> 
              </div>
        </div>
        
      }
    />
  );
};

export default LoginForm;
