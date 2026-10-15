import React, { useState } from "react";
import { Loader2, Mail, Lock, User, ArrowRight, KeyRound } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Auth.css";

// Shared account creation form for tourists and setup-key-protected admins.
export default function SignupForm({ onSubmit, submitting, error, adminMode = false }) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password, setupKey });
  };

  return (
    <div className="auth-card">
      <h2>{t(adminMode ? "signup.createAdmin" : "signup.createPassport")}</h2>
      <p className="auth-subtitle">
        {t(adminMode ? "signup.adminText" : "signup.signupText")}
      </p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field-label">{t("signup.name")}</span>
          <span className="auth-field-input">
            <User size={16} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("signup.nameHint")} required autoComplete="name" />
          </span>
        </label>
        <label className="auth-field">
          <span className="auth-field-label">{t("login.email")}</span>
          <span className="auth-field-input">
            <Mail size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("input.emailHint")}
              required
              autoComplete="email"
            />
          </span>
        </label>
        <label className="auth-field">
          <span className="auth-field-label">{t("login.password")}</span>
          <span className="auth-field-input">
            <Lock size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("signup.passwordHint")}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </span>
        </label>
        {adminMode && (
          <label className="auth-field">
            <span className="auth-field-label">{t("signup.setupKey")}</span>
            <span className="auth-field-input">
              <KeyRound size={16} />
              <input
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                required
                autoComplete="off"
              />
            </span>
          </label>
        )}
        {error && <div className="auth-error">{error}</div>}
        <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
          {submitting ? <Loader2 size={15} className="auth-spin" /> : <ArrowRight size={15} />}
          {submitting ? t("signup.submitting") : t("signup.submit")}
        </button>
      </form>
    </div>
  );
}
