import React from "react";
import "./ProgressRing.css";

// Small circular progress indicator — used as the Passport page's hero,
// showing stamps collected out of the total monument count.
export default function ProgressRing({ value, total, size = 92 }) {
  const pct = total > 0 ? value / total : 0;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border-warm)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="progress-ring-fill"
        />
      </svg>
      <div className="progress-ring-label">
        <strong>{value}</strong>
        <span>/ {total}</span>
      </div>
    </div>
  );
}
