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
    <div className="loginPage">
      <div id="loginContainer">
        <h2 className="title">تسجيل الدخول</h2>

        <div className="inputs">
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
            className="error-message"
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
  );
};

export default LoginPage;
