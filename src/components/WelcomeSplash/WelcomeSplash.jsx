import React, { useEffect, useState } from "react";
import OdissiDancer from "../OdissiDancer/OdissiDancer.jsx";
import "./WelcomeSplash.css";

// First-launch welcome screen. The figure is a stylised Odissi dancer in
// Tribhangi (three-bend) pose -- Odissi originated in Odisha's temples,
// and Konark's own Nata Mandir (dance hall) is carved with dancers in
// exactly this stance, so it's a direct visual link to the app's subject,
// not a generic decoration. The sun-wheel behind her reuses the app's
// existing signature motif as her halo.
//
// Shown once per browser session (sessionStorage flag) so returning users
// mid-session aren't slowed down by it. Auto-continues after ~2.8s, or
// immediately on tap/click/key. Respects prefers-reduced-motion by
// skipping the animated reveal and continuing almost immediately.
const SEEN_KEY = "odisha-ar-heritage:splash-seen";
const AUTO_DISMISS_MS = 2800;

export default function WelcomeSplash({ onDone }) {
  const [leaving, setLeaving] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    window.sessionStorage.setItem(SEEN_KEY, "true");
    setTimeout(onDone, reducedMotion ? 50 : 500);
  };

  useEffect(() => {
    const t = setTimeout(finish, reducedMotion ? 400 : AUTO_DISMISS_MS);
    const onKey = (e) => e.key === "Enter" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`splash ${leaving ? "splash-leaving" : ""} ${reducedMotion ? "splash-reduced" : ""}`}
      onClick={finish}
      role="button"
      tabIndex={0}
      aria-label="Continue to Odisha AR Heritage"
    >
      <div className="splash-halo" aria-hidden="true" />

      <svg
        className="splash-wheel"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="92" fill="none" stroke="#E8A33D" strokeWidth="2" opacity="0.55" />
        <circle cx="100" cy="100" r="92" fill="none" stroke="#E8A33D" strokeWidth="2" strokeDasharray="8 7" opacity="0.55" />
      </svg>

      <OdissiDancer className="splash-dancer" />

      <div className="splash-text">
        <div className="splash-welcome-odia">ସ୍ୱାଗତ</div>
        <h1 className="splash-title">Welcome to Odisha</h1>
        <p className="splash-subtitle">Step into a thousand years of heritage</p>
      </div>

      <div className="splash-hint mono">tap anywhere to continue</div>
    </div>
  );
}
