import React from "react";
import { Info } from "lucide-react";
import "./MonumentInfo.css";

// Historical Metadata Card
export default function MonumentInfo({ monument, era }) {
  const lat = monument.location?.coordinates?.[1];
  const lng = monument.location?.coordinates?.[0];

  return (
    <div className="monument-info">
      <div className="monument-info-header">
        <Info size={15} />
        <h3>{monument.title}</h3>
      </div>
      <p className="monument-info-desc">{monument.descriptions?.[era]}</p>
      <div className="monument-info-meta mono">
        {monument.era && <span>Built {monument.era}</span>}
        {monument.unesco && <span>UNESCO {monument.unesco}</span>}
        {lat != null && (
          <span>
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}
