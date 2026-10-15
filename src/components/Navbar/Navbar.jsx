import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, Globe2 } from "lucide-react";
import UserProfileBar from "../Auth/UserPreofileBar.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Navbar.css";

const TABS = [
  { to: "/discover", label: "nav.discover" },
  { to: "/explorer", label: "nav.explorer" },
  { to: "/passport", label: "nav.passport" },
  { to: "/admin", label: "nav.admin" },
];


export default function Navbar({ lang, setLang, stampCount, user, onLogout }) {
  const { t } = useLanguage();
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-brand">
          <img src="/odisha-heritage-logo.png" alt="Odisha AR Heritage logo" className="navbar-logo" />
          <div>
            <div className="navbar-title">Odisha AR Heritage</div>
            <div className="navbar-subtitle mono">{t("nav.subtitle")}</div>
          </div>
        </div>
        <nav className="navbar-tabs" aria-label={t("nav.main")}>
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `navbar-tab ${isActive ? "active" : ""}`}
            >
              {t(tab.label)}
              <ChevronDown size={13} aria-hidden="true" />
              {tab.to === "/passport" && stampCount > 0 && (
                <span className="navbar-badge">{stampCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="navbar-right">
          <div className="navbar-langs" aria-label={t("nav.language")}>
            <Globe2 size={20} aria-hidden="true" />
            {["en", "or", "hi"].map((code) => (
              <button
                key={code}
                className={`navbar-lang-btn ${lang === code ? "active" : ""}`}
                onClick={() => setLang(code)}
                aria-label={t("nav.changeLanguage", { language: t(`lang.${code}`) })}
              >
                {code === "or" ? "OR" : code.toUpperCase()}
              </button>
            ))}
          </div>
          <UserProfileBar user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
