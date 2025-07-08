import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/pages/Login/Login";
import VisitorsPage from "./features/pages/Visitors/Visitors";
import NotFound from "./features/pages/NotFound/NotFound";
import Footer from "./features/components/features/Footer/Footer";
import Header from "./features/components/features/Header/Header";
import StatsPage from "./features/pages/Stats/Stats";
import VisitorDataEntryPage from "./features/pages/VisitorDataEntry/VisitorDataEntry";

export enum PagesRoutes {
  basePage = "/accueil",
  loginPage = "/connexion",
  visitorsPage = "/visiteurs",
  visitorDataEntryPage = "/saisie-donnees-visiteurs",
  statsPage = "/statistiques-visiteurs",
}

const LoggedInLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Routes>
        <Route
          path={PagesRoutes.visitorDataEntryPage}
          element={<VisitorDataEntryPage />}
        />
        <Route path={PagesRoutes.visitorsPage} element={<VisitorsPage />} />
        <Route path={PagesRoutes.statsPage} element={<StatsPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={PagesRoutes.visitorsPage} />} />
      <Route path="/*" element={<LoggedInLayout />} />
      <Route path={PagesRoutes.loginPage} element={<LoginPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
