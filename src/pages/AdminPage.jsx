import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import LoginForm from "../components/Auth/LoginForm.jsx";
import SignupForm from "../components/Auth/SignupForm.jsx";
import AdminPortal from "../components/AdminPortal/Adminportal.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./AdminPage.css";

// Protected upload dashboard view — gates itself: shows the admin login
// form until auth.user is an "admin" account, then shows AdminPortal.
export default function AdminPage({ auth }) {
  const { t } = useLanguage();
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("login");
  const addUpload = (u) => setUploads((arr) => [u, ...arr]);

  const handleLogin = async ({ email, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await auth.login(email, password, "admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async ({ name, email, password, setupKey }) => {
    setSubmitting(true);
    setError(null);
    try {
      await auth.registerAdmin(name, email, password, setupKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth.user || auth.user.role !== "admin") {
    return (
      <div className="page auth-page">
        <div className="admin-auth-card">
          {mode === "login" ? (
            <LoginForm
              onSubmit={handleLogin}
              submitting={submitting}
              error={error}
              title={t("admin.signIn")}
              subtitle={t("admin.signInSubtitle")}
            />
          ) : (
            <SignupForm onSubmit={handleSignup} submitting={submitting} error={error} adminMode />
          )}
          <button
            className="admin-auth-toggle"
            type="button"
            onClick={() => { setError(null); setMode(mode === "login" ? "signup" : "login"); }}
          >
            {t(mode === "login" ? "signup.adminPrompt" : "signup.adminExisting")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="admin-hero-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="admin-hero-title">{t("admin.dashboard")}</h2>
          <p className="mono admin-hero-subtitle">{t("admin.signedIn", { name: auth.user.name || auth.user.email })}</p>
        </div>
      </div>
      <AdminPortal auth={auth} uploads={uploads} addUpload={addUpload} />
    </div>
  );
}
