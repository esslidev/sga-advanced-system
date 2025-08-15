import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./features/pages/Login/Login";
import SignUpPage from "./features/pages/SignUp/SignUp";
import VisitorsPage from "./features/pages/Visitors/Visitors";
import VisitsPage from "./features/pages/Visits/Visits";
import VisitDataEntryPage from "./features/pages/VisitorDataEntry/VisitDataEntry";
import StatsPage from "./features/pages/Stats/Stats";
import NotFound from "./features/pages/NotFound/NotFound";
import Header from "./features/components/features/Header/Header";
import Footer from "./features/components/features/Footer/Footer";
import { useAuth } from "./features/hooks/useAuth";

export const PagesRoutes = {
  basePage: "/accueil",
  loginPage: "/connexion",
  signUpPage: "/inscription",
  visitorsPage: "/visiteurs",
  visitsPage: "/visiteurs/visites",
  visitDataEntryPage: "/saisie-donnees-visites",
  statsPage: "/statistiques-visiteurs",
};

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
          path={PagesRoutes.visitDataEntryPage}
          element={<VisitDataEntryPage />}
        />
        <Route path={PagesRoutes.visitorsPage} element={<VisitorsPage />} />
        <Route path={PagesRoutes.visitsPage} element={<VisitsPage />} />
        <Route path={PagesRoutes.statsPage} element={<StatsPage />} />
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
