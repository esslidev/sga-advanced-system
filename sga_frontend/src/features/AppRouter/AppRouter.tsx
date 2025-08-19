import "./AppRouter.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Login/Login";
import SignUpPage from "../pages/SignUp/SignUp";
import VisitorsPage from "../pages/Visitors/Visitors";
import VisitsPage from "../pages/Visits/Visits";
import VisitDataEntryPage from "../pages/VisitorDataEntry/VisitDataEntry";
import StatsPage from "../pages/Stats/Stats";
import NotFound from "../pages/NotFound/NotFound";
import Header from "../components/features/Header/Header";
import Footer from "../components/features/Footer/Footer";
import { useAuth } from "../hooks/useAuth";

export const PagesRoutes = {
  basePage: "/accueil",
  loginPage: "/connexion",
  signUpPage: "/inscription",
  visitorsPage: "/visiteurs",
  visitsPage: "/visiteurs/visites",
  visitDataEntryPage: "/saisie-donnees-visites",
  analyticsPage: "/analytique-visiteurs",
};

const LoggedInLayout = () => {
  return (
    <div
      className="logged-in-layout"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Routes>
        <Route
          path={PagesRoutes.visitDataEntryPage}
          element={<VisitDataEntryPage />}
        />
        <Route path={PagesRoutes.visitorsPage} element={<VisitorsPage />} />
        <Route path={PagesRoutes.visitsPage} element={<VisitsPage />} />
        <Route path={PagesRoutes.analyticsPage} element={<StatsPage />} />
        <Route
          path="/"
          element={<Navigate to={PagesRoutes.visitDataEntryPage} replace />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  const { apiAuth } = useAuth();

  if (!apiAuth?.accessToken) {
    // Public routes
    return (
      <Routes>
        <Route path={PagesRoutes.loginPage} element={<LoginPage />} />
        <Route path={PagesRoutes.signUpPage} element={<SignUpPage />} />
        <Route
          path="*"
          element={<Navigate to={PagesRoutes.loginPage} replace />}
        />
      </Routes>
    );
  }

  // Protected routes
  return <LoggedInLayout />;
};

export default AppRoutes;
