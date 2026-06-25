import { Bell, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { storageKeys } from "../../constants/storage";

export function TopBar() {
  const { i18n } = useTranslation();

  const changeLanguage = async (language: "pl" | "en") => {
    localStorage.setItem(storageKeys.language, language);
    await i18n.changeLanguage(language);
  };

  return (
      <header className="topbar topbar-clean">
        <div className="topbar-actions">
          <button className="icon-button" type="button" aria-label="notifications">
            <Bell size={18} />
          </button>

          <div className="language-switch">
            <Globe2 size={16} />

            <button
                className={i18n.language === "pl" ? "active" : ""}
                onClick={() => changeLanguage("pl")}
                type="button"
            >
              PL
            </button>

            <button
                className={i18n.language === "en" ? "active" : ""}
                onClick={() => changeLanguage("en")}
                type="button"
            >
              EN
            </button>
          </div>
        </div>
      </header>
  );
}