import "./Login.css";
import CustomButton from "../../components/common/CustomButton/CustomButton";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  CustomTextField,
  CustomTextFieldIconPosition,
} from "../../components/common/CustomTextField/CustomTextField";
import { IdCard } from "lucide-react";

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
        <div className="login-container d-flex flex-column col-md-7">
          <div className="login-header d-flex justify-content-between">
            <CustomButton
              name={"تسجيل حساب جديد"}
              isInsert
              disabled={loading}
              onClick={() => {}}
            />
            <CustomButton
              name={"العربية"}
              isInsert
              disabled={loading}
              onClick={() => {}}
            />
          </div>
          <div className="login-form flex-fill d-flex flex-column align-items-center justify-content-center">
            <div className="form-title">
              <p className="title">تسجيل الدخول</p>
              <p className="sub-title"></p>
            </div>
            <div className="form-inputs d-flex flex-column gap-4">
              <div className="d-flex flex-column gap-2">
                <label>رقم البطاقة الوطنية</label>
                <CustomTextField
                  icon={<IdCard />}
                  iconColor=""
                  hintText="أدخل رقم البطاقة الوطنية"
                  keyboardType="text"
                  value={CIN}
                  onChange={(value) => setCIN(value)}
                  borderRadius={8}
                />
              </div>
              <div className="d-flex flex-column gap-2">
                <label>كلمة السر</label>
                <CustomTextField
                  icon="lock"
                  iconPosition={CustomTextFieldIconPosition.LEFT}
                  hintText="أدخل كلمة السر هنا"
                  keyboardType="password"
                  obscureText={true}
                  value={password}
                  onChange={(value) => setPassword(value)}
                  borderRadius={8}
                />
              </div>
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
