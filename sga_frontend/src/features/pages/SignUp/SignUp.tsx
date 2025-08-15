import "./SignUp.css";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "react-bootstrap";
import {
  EyeIcon,
  EyeSlashIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import CustomSelector from "../../components/common/CustomSelector/CustomSelector";
import { useSystemPreferences } from "../../hooks/useSystemPreferences";
import { Language } from "../../models/systemPreferences";
import CustomTextInput from "../../components/common/TextInput/CustomTextInput";

// PasswordInput with show/hide toggle
const PasswordInput = ({
  label,
  value,
  onChange,
  onEnter,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onEnter?: () => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <CustomTextInput
      label={label}
      value={value}
      onChange={onChange}
      type={show ? "text" : "password"}
      placeholder="●●●●●●●●"
      onEnter={onEnter}
      icon={
        <span onClick={() => setShow(!show)} style={{ cursor: "pointer" }}>
          {show ? <EyeSlashIcon /> : <EyeIcon />}
        </span>
      }
    />
  );
};

const SignUpPage = () => {
  const { language, changeLanguage } = useSystemPreferences();
  const { signUp, loading, response } = useAuth();
  const [adminAccessCode, setAdminAccessCode] = useState("");
  const [CIN, setCIN] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (!CIN || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      alert("كلمتا السر غير متطابقتين");
      return;
    }

    signUp({ CIN, password, firstName, lastName, adminAccessCode });
  };

  return (
    <div className="container-fluid g-0 vh-100">
      <div className="row g-0 h-100">
        <div className="side-image d-none d-md-block col-md-6 col-lg-5" />
        <div className="login-container d-flex flex-column col-12 col-md-6 col-lg-7">
          <div className="login-header d-flex justify-content-between align-items-center">
            <h2>حساب جديد</h2>
            <CustomSelector
              value={language === Language.french ? "french" : "arabic"}
              options={[
                { value: "french", label: "Français" },
                { value: "arabic", label: "العربية" },
              ]}
              onChange={(value: string) =>
                changeLanguage(
                  value === "arabic" ? Language.arabic : Language.french
                )
              }
            />
          </div>

          <div className="login-form flex-fill d-flex flex-column gap-4 justify-content-center">
            <div className="form-inputs d-flex flex-column gap-4">
              <CustomTextInput
                label="الاسم"
                value={firstName}
                onChange={setFirstName}
                placeholder="أدخل الاسم"
              />
              <CustomTextInput
                label="النسب"
                value={lastName}
                onChange={setLastName}
                placeholder="أدخل النسب"
              />
              <CustomTextInput
                label="رقم البطاقة الوطنية"
                value={CIN}
                onChange={(val) => setCIN(val.toUpperCase())}
                placeholder="XX000000"
                icon={<IdentificationIcon />}
                onEnter={handleSignUp}
              />
              <PasswordInput
                label="كلمة السر"
                value={password}
                onChange={setPassword}
                onEnter={handleSignUp}
              />
              <PasswordInput
                label="تأكيد كلمة السر"
                value={confirmPassword}
                onChange={setConfirmPassword}
                onEnter={handleSignUp}
              />
              <CustomTextInput
                label="كود الدخول الإداري (اختياري)"
                value={adminAccessCode}
                onChange={setAdminAccessCode}
                placeholder="أدخل الكود إذا كان لديك"
              />
            </div>

            {response && response.statusCode >= 400 && (
              <p className="error-response">{response.message}</p>
            )}

            <Button
              type="submit"
              className="login-btn"
              disabled={loading}
              onClick={handleSignUp}
            >
              {loading ? "جاري التسجيل..." : "إنشاء حساب"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
