import React from "react";
import "./TimeSlider.css";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

// Damaged vs Restored toggle
export default function TimeSlider({ era, setEra }) {
  const { t } = useLanguage();
  const restored = era === "restored";
  return (
    <div className="time-slider">
      <span className={`time-slider-label ${!restored ? "active" : ""} mono`}>
        {t("time.weathered")}
      </span>
      <button
        className={`time-slider-track ${restored ? "restored" : ""}`}
        onClick={() => setEra(restored ? "damaged" : "restored")}
        aria-label={t("time.toggle")}
      >
        <span className="time-slider-thumb" />
      </button>
      <span className={`time-slider-label ${restored ? "active" : ""} mono`}>
        {t("time.restored")}
      </span>
    </div>
  );
}
