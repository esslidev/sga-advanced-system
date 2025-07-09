import React from "react";
import "./Login.css";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import CustomButton from "../../components/common/CustomButton/CustomButton";
const LoginPage = () => {
  return (
    <div className="loginPage">
      <div id="loginContainer">
        <h2 className="title">تسجيل الدخول</h2>
        <div className="inputs">
          <CustomTextInput name="رقم البطاقة الوطنية" type="text" />
          <CustomTextInput name="كلمة السر" type="password" />
        </div>
        <CustomButton name="تسجيل الدخول" isInsert={true} />
      </div>
    </div>
  );
};

export default LoginPage;
