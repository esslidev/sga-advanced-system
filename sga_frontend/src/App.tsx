import "./App.css";
import AppRoutes from "./features/AppRouter/AppRouter";
import { useSystemPreferences } from "./features/hooks/useSystemPreferences";
import { Language } from "./features/models/systemPreferences";

function App() {
  const { language } = useSystemPreferences();
  return (
    <div className="App" dir={language == Language.arabic ? "rtl" : "ltr"}>
      <AppRoutes />
    </div>
  );
}

export default App;
