import "./Header.css";
import { useNavigate } from "react-router-dom";
import { PagesRoutes } from "../../../AppRouter/AppRouter";
import { useAuth } from "../../../hooks/useAuth";
import { signOutThunk } from "../../../redux/thunks/authThunks";
import moroccoSymbol from "../../../../assets/images/morocco-symbol.png";
import { useSystemPreferences } from "../../../hooks/useSystemPreferences";
import { t } from "../../../../core/utils/translator";
import ProfileFilledIcon from "../../../../assets/vectors/profile-filled-icon";

const Header = () => {
  const navigate = useNavigate();
  const { language } = useSystemPreferences();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    signOut();

    const resultAction = await signOut();
    if (signOutThunk.fulfilled.match(resultAction)) {
      navigate(PagesRoutes.loginPage, { replace: true });
    }
  };

  return (
    <div className="header container-fluid d-flex align-items-center justify-content-between shadow-sm py-3">
      <div className="d-flex gap-3 align-items-center justify-content-center">
        <div className="profileImage">
          <ProfileFilledIcon fillColor="#717070" />
        </div>
        <p className="full-name">علي سالم السويح</p>
      </div>

      {/* Center: Morocco Symbol Logo */}
      <div className="position-absolute start-50 translate-middle-x">
        <img className="symbol-img" src={moroccoSymbol} alt="Logo" />
      </div>

      {/* Right: Navigation Links */}
      <div className="header-nav d-flex flex-row gap-3">
        <button
          className="nav-btn"
          onClick={() => navigate(PagesRoutes.visitDataEntryPage)}
        >
          {t("components.features.header.navs.dataEntry", language)}
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate(PagesRoutes.visitorsPage)}
        >
          {t("components.features.header.navs.tracking", language)}{" "}
        </button>
        <button
          className="nav-btn"
          onClick={() => navigate(PagesRoutes.analyticsPage)}
        >
          {t("components.features.header.navs.analytics", language)}
        </button>
        <button className="signout-btn" onClick={handleLogout}>
          {t("components.features.header.signout", language)}
        </button>
      </div>
    </div>
  );
};

export default Header;
