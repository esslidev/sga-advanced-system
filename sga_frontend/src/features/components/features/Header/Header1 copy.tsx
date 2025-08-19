import "./Header.css";
import { useNavigate } from "react-router-dom";
import { PagesRoutes } from "../../../AppRouter/AppRouter";
import { useAuth } from "../../../hooks/useAuth";
import ProfileFilledIcon from "../../../../assets/vectors/profile-filled-icon";

const Header = () => {
  const navigate = useNavigate();
  const { apiAuth, signOut } = useAuth();

  const fullName = "الإسم الكامل";
  const profileImage = null;

  const handleLogout = () => {
    signOut(); // Clear auth state
    navigate(PagesRoutes.loginPage); // Redirect to login
  };

  return (
    <div className="header">
      <div className="topBar">
        <div className="profile">
          {profileImage ? (
            <img className="profileImage" src={profileImage} alt="profile" />
          ) : (
            <div className="profileImage">
              <ProfileFilledIcon fillColor="#717070" />
            </div>
          )}
          <p id="fullName">{fullName}</p>
        </div>

        <button id="logout" title="خروج" onClick={handleLogout}>
          خروج
        </button>
      </div>

      <div className="navBar">
        <button
          className="navButton"
          title="تحصيل الزيارة"
          onClick={() => navigate(PagesRoutes.visitDataEntryPage)}
        >
          تحصيل الزيارة
        </button>
        <button
          className="navButton"
          title="تتبع التحصيل"
          onClick={() => navigate(PagesRoutes.visitorsPage)}
        >
          تتبع التحصيل
        </button>
        <button
          className="navButton"
          title="الإحصائيات"
          onClick={() => navigate(PagesRoutes.analyticsPage)}
        >
          الإحصائيات
        </button>
      </div>
    </div>
  );
};

export default Header;
