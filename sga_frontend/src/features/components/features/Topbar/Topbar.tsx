import React from "react";

const Topbar = () => {
  return (
    <div>
      <div className="profile">
        <img
          src="../../../../assets/images/image-profile.jpg"
          alt="profile-image"
        />
      </div>
      <div className="header">
        <button id="" title="تحصيل الزيارة">
          تحصيل الزيارة
        </button>
        <button title="تتبع التحصيل">تتبع التحصيل</button>
        <button title="خروج">خروج</button>
      </div>
    </div>
  );
};

export default Topbar;
