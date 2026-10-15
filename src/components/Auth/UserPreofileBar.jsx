import React from "react";
import { User, LogOut } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Auth.css";

// Header info + Logout action, rendered inside Navbar when someone's logged in.
export default function UserProfileBar({ user, onLogout }) {
  const { t } = useLanguage();
  if (!user) return null;
  return (
    <div className="user-profile-bar">
      <User size={13} />
      <span>{user.name || user.email}</span>
      {user.role === "admin" && <span className="user-profile-role mono">{t("auth.role.admin")}</span>}
      <button className="user-profile-logout" onClick={onLogout} title={t("auth.logout")} aria-label={t("auth.logout")}>
        <LogOut size={13} />
      </button>
    </div>
  );
}
