import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Clock } from "lucide-react";
import "./MonumentSpotlight.css";

// Horizontally-scrolling strip of monument cards beneath the Discover
// map — gives search results a browsable list form, not just pins to
// hunt for on the map itself.
export default function MonumentSpotlight({ monuments }) {
  if (monuments.length === 0) return null;

  return (
    <div className="spotlight-row">
      {monuments.map((m) => (
        <div key={m._id || m.slug || m.id} className={`spotlight-card ${m.live ? "live" : ""}`}>
          <div className="spotlight-card-top">
            <span className="spotlight-card-title">{m.title}</span>
            {m.live ? (
              <span className="spotlight-chip spotlight-chip-live">
                <Sparkles size={11} /> Live in AR
              </span>
            ) : (
              <span className="spotlight-chip spotlight-chip-soon">
                <Clock size={11} /> Coming soon
              </span>
            )}
          </div>
          <div className="mono spotlight-card-era">{m.era}</div>
          <p className="spotlight-card-blurb">{m.blurb}</p>
          {m.live && (
            <Link to="/explorer" className="spotlight-card-link">
              Explore in AR →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
