import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Compass, Award, Globe2 } from "lucide-react";
import LoginForm from "../components/Auth/LoginForm.jsx";
import SignupForm from "../components/Auth/SignupForm.jsx";
import OdissiDancer from "../components/OdissiDancer/OdissiDancer.jsx";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./LoginPage.css";

const HIGHLIGHTS = [
  { icon: Compass, key: "login.highlight1" },
  { icon: Award, key: "login.highlight2" },
  { icon: Globe2, key: "login.highlight3" },
];

// Landing auth page for tourists — mandatory before Explorer/Passport.
// Split hero: a dusk-gradient panel introduces the app (reusing the
// splash's dancer motif at rest, no animation loop), paired with the
// actual login/signup form. Toggles between the two modes; admin
// sign-in lives on /admin instead (embedded in AdminPage), not here.
export default function LoginPage({ auth }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/discover";

  const handleLogin = async ({ email, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await auth.login(email, password, "tourist");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async ({ name, email, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await auth.register(name, email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-layout">
      <div className="login-hero">
        <div className="login-hero-halo" aria-hidden="true" />
        <OdissiDancer className="login-hero-dancer" />
        <div className="login-hero-copy">
          <div className="login-hero-odia">ସ୍ୱାଗତ</div>
          <h1>Odisha AR Heritage</h1>
          <p>{t("login.hero")}</p>
        </div>
        <ul className="login-hero-list">
          {HIGHLIGHTS.map(({ icon: Icon, key }, i) => (
            <li key={i}>
              <Icon size={16} />
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="login-form-side">
        <div className="login-form-inner">
          <div className="login-tabs">
            <button
              className={`login-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setError(null);
              }}
            >
              {t("signup.loginTab")}
            </button>
            <button
              className={`login-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
            >
              {t("signup.signupTab")}
            </button>
          </div>

          {mode === "login" ? (
            <LoginForm
              onSubmit={handleLogin}
              submitting={submitting}
              error={error}
              title={t("login.welcome")}
              subtitle={t("login.subtitle")}
            />
          ) : (
            <SignupForm onSubmit={handleSignup} submitting={submitting} error={error} />
          )}
        </div>
      </div>
    </div>
  );
}
