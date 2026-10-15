import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, Globe2 } from "lucide-react";
import UserProfileBar from "../Auth/UserPreofileBar.jsx";
import "./Navbar.css";

const TABS = [
  { to: "/discover", label: "Discover" },
  { to: "/explorer", label: "Explorer" },
  { to: "/passport", label: "Passport" },
  { to: "/admin", label: "Admin" },
];

const LANGS = [
  { code: "en", label: "English" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "hi", label: "हिन्दी" },
];

export default function Navbar({ lang, setLang, stampCount, user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-brand">
          <img src="/odisha-heritage-logo.png" alt="Odisha AR Heritage logo" className="navbar-logo" />
          <div>
            <div className="navbar-title">Odisha AR Heritage</div>
            <div className="navbar-subtitle mono">odisha-ar-heritage · WebAR</div>
          </div>
        </div>
        <nav className="navbar-tabs" aria-label="Main navigation">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `navbar-tab ${isActive ? "active" : ""}`}
            >
              {t.label}
              <ChevronDown size={13} aria-hidden="true" />
              {t.to === "/passport" && stampCount > 0 && (
                <span className="navbar-badge">{stampCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="navbar-right">
          <div className="navbar-langs" aria-label="Language">
            <Globe2 size={20} aria-hidden="true" />
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`navbar-lang-btn ${lang === l.code ? "active" : ""}`}
                onClick={() => setLang(l.code)}
                aria-label={`Change language to ${l.label}`}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
          <UserProfileBar user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
