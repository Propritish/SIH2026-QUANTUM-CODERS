import React from "react";
import "./TimeSlider.css";

// Damaged vs Restored toggle
export default function TimeSlider({ era, setEra }) {
  const restored = era === "restored";
  return (
    <div className="time-slider">
      <span className={`time-slider-label ${!restored ? "active" : ""} mono`}>
        2026 · weathered
      </span>
      <button
        className={`time-slider-track ${restored ? "restored" : ""}`}
        onClick={() => setEra(restored ? "damaged" : "restored")}
        aria-label="Toggle between present-day and restored view"
      >
        <span className="time-slider-thumb" />
      </button>
      <span className={`time-slider-label ${restored ? "active" : ""} mono`}>
        1250 CE · restored
      </span>
    </div>
  );
}
