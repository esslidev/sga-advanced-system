import "./Login.css";
import CustomTextInput from "../../components/common/CustomTextInput/CustomTextInput";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const { signIn, loading, response } = useAuth();

  const [CIN, setCIN] = useState("");
  const [password, setPassword] = useState("");

  // Submit handler
  const handleLogin = () => {
    if (!CIN || !password) return;
    signIn({ CIN, password });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="side-image col-md-5" />
        <div className="login-form col-md-7">
          <div className="from-header"></div>
          <div className="margin with bootstrap">
            <div className="form-title">
              <p className="title">تسجيل الدخول</p>
              <p className="sub-title"></p>
            </div>
            <div className="form-inputs">
              <CustomTextInput
                name="رقم البطاقة الوطنية"
                type="text"
                value={CIN}
                onChange={(e) => setCIN(e.target.value)}
              />
              <CustomTextInput
                name="كلمة السر"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {response && (
              <p
                className="error-response"
                style={{ color: "red", marginTop: "1rem" }}
              >
                {response.message}
              </p>
            )}
            <CustomButton
              name={loading ? "جاري الدخول..." : "تسجيل الدخول"}
              isInsert
              disabled={loading}
              onClick={handleLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
