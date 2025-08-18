import "./Login.css";
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
import { useNavigate } from "react-router-dom";
import { PagesRoutes } from "../../AppRouter/AppRouter";
import { signInThunk } from "../../redux/thunks/authThunks";
import { t } from "../../../core/utils/translator";
import Footer from "../../components/features/Footer/Footer";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useSystemPreferences();
  const { signIn, loading, response } = useAuth();
  const [CIN, setCIN] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!CIN.trim() || !password.trim()) return;
    const resultAction = await signIn({ CIN, password });
    if (signInThunk.fulfilled.match(resultAction)) {
      navigate(PagesRoutes.visitDataEntryPage, { replace: true });
    }
  };
  return (
    <div className="container-fluid g-0 vh-100">
      <div className="row g-0 h-100">
        <div className="side-image d-none d-md-block col-md-6 col-lg-5" />
        <div className="login-container d-flex flex-column col-12 col-md-6 col-lg-7">
          <div className="login-header d-flex justify-content-between">
            <Button
              className="sign-up-button"
              onClick={() => {
                navigate(PagesRoutes.signUpPage);
              }}
            >
              {t("pages.login.newAccount", language)}
            </Button>
            <CustomSelector
              value={language == Language.french ? "french" : "arabic"}
              options={[
                { value: "french", label: "Français" },
                { value: "arabic", label: "العربية" },
              ]}
              onChange={function (value: string) {
                changeLanguage(
                  value == "arabic" ? Language.arabic : Language.french
                );
              }}
            />
          </div>

          <div className="login-form flex-fill d-flex flex-column gap-4 justify-content-center overflow-auto">
            <div className="form-title d-flex flex-column gap-2">
              <h1 className="title">{t("pages.login.title", language)}</h1>
              <p className="subtitle">{t("pages.login.subtitle", language)}</p>
            </div>

            <div className="form-inputs d-flex flex-column gap-4">
              <CustomTextInput
                label={t("pages.login.cin", language)}
                value={CIN.trim()}
                onChange={(val) => setCIN(val.toUpperCase())}
                placeholder="XX000000"
                icon={<IdentificationIcon />}
                onEnter={handleLogin}
              />
              <PasswordInput
                label={t("pages.login.password", language)}
                value={password.trim()}
                onChange={setPassword}
                onEnter={handleLogin}
              />
            </div>

            {response && response.statusCode >= 400 && (
              <p className="error-response">{response.message}</p>
            )}

            <Button
              type="submit"
              className="login-btn"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading
                ? t("pages.login.submitLoading", language)
                : t("pages.login.submit", language)}
            </Button>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
