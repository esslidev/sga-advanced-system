import "./Login.css";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import { PagesRoutes } from "../../../AppRoutes";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="loginPage">
      <div id="loginContainer">
        <h2 className="title">تسجيل الدخول</h2>
        <div className="inputs">
          <CustomTextInput name="رقم البطاقة الوطنية" type="text" />
          <CustomTextInput name="كلمة السر" type="password" />
        </div>
        <CustomButton
          name="تسجيل الدخول"
          isInsert={true}
          onClick={() => navigate(PagesRoutes.visitDataEntryPage)}
        />
      </div>
    </div>
  );
};

export default LoginPage;
