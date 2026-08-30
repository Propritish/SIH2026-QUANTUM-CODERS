import React from "react";
import { User, LogOut } from "lucide-react";
import "./Auth.css";

// Header info + Logout action, rendered inside Navbar when someone's logged in.
export default function UserProfileBar({ user, onLogout }) {
  if (!user) return null;
  return (
    <div className="user-profile-bar">
      <User size={13} />
      <span>{user.name || user.email}</span>
      {user.role === "admin" && <span className="user-profile-role mono">admin</span>}
      <button className="user-profile-logout" onClick={onLogout} title="Log out">
        <LogOut size={13} />
      </button>
    </div>
  );
}
