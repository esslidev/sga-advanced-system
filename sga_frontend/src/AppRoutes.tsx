import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/pages/Login/Login";
import VisitorsPage from "./features/pages/Visitors/Visitors";
import NotFound from "./features/pages/NotFound/NotFound";
import Topbar from "./features/components/features/Topbar/Topbar";

export enum PagesRoutes {
  basePage = "/accueil",
  loginPage = "/connexion",
  visitorsPage = "/visiteurs",
}

const AppRoutes = () => {
  return (
    <div>
      <Topbar />
      <Routes>
        <Route path="/" element={<Navigate to={PagesRoutes.visitorsPage} />} />
        <Route path={PagesRoutes.loginPage} element={<LoginPage />} />
        <Route path={PagesRoutes.visitorsPage} element={<VisitorsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
