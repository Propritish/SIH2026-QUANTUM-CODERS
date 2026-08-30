import React from "react";
import { NavLink } from "react-router-dom";
import { Compass, Award, ShieldCheck, Map } from "lucide-react";
import UserProfileBar from "../Auth/UserPreofileBar.jsx";
import "./Navbar.css";

const TABS = [
  { to: "/discover", label: "Discover", icon: Map },
  { to: "/explorer", label: "Explorer", icon: Compass },
  { to: "/passport", label: "Passport", icon: Award },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
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
          <img src="/favicon.ico" alt="" className="navbar-wheel" />
          <div>
            <div className="navbar-title">Odisha AR Heritage</div>
            <div className="navbar-subtitle mono">odisha-ar-heritage · WebAR</div>
          </div>
        </div>
        <div className="navbar-right">
          <div className="navbar-langs">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`navbar-lang-btn ${lang === l.code ? "active" : ""}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <UserProfileBar user={user} onLogout={onLogout} />
        </div>
      </div>
      <nav className="navbar-tabs">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) => `navbar-tab ${isActive ? "active" : ""}`}
            >
              <Icon size={15} />
              {t.label}
              {t.to === "/passport" && stampCount > 0 && (
                <span className="navbar-badge">{stampCount}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
