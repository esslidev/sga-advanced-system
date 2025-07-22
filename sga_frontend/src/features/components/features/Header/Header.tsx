import React from "react";
import "./Header.css";
import ProfileFilledIcon from "../../../../assets/vectors/profile-filled-icon";
import { useNavigate } from "react-router-dom";
import { PagesRoutes } from "../../../../AppRoutes";

const Header = () => {
  const navigate = useNavigate();

  const isLoggedIn = false;

  return (
    <div className="header">
      <div className="topBar">
        <div className="profile">
          {isLoggedIn ? (
            <img className="profileImage" src="" alt="profile-image" />
          ) : (
            <div className="profileImage">
              <ProfileFilledIcon fillColor="#717070" />
            </div>
          )}

          <p id="fullName">الإسم الكامل</p>
        </div>
        <button
          id="logout"
          title="خروج"
          onClick={() => navigate(PagesRoutes.loginPage)}
        >
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
          onClick={() => navigate(PagesRoutes.statsPage)}
        >
          الإحصائيات
        </button>
      </div>
    </div>
  );
};

export default Header;
