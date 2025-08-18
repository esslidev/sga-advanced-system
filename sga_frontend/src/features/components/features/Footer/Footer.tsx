import { t } from "../../../../core/utils/translator";
import { useSystemPreferences } from "../../../hooks/useSystemPreferences";
import "./Footer.css";

const Footer = () => {
  const { language } = useSystemPreferences();
  return (
    <div className="footer">
      <p>{t("components.features.footer.allRights", language)}</p>
    </div>
  );
};

export default Footer;
