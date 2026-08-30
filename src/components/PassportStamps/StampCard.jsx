import React from "react";
import { Lock } from "lucide-react";
import "./PassportStamps.css";

// One shared badge design (locked/unlocked) reused across every monument —
// swap in per-monument artwork here once real stamp icons exist.
const unlockedIcon = new URL("../../assets/stamps/konark_unlocked.png", import.meta.url).href;
const lockedIcon = new URL("../../assets/stamps/konark_locked.png", import.meta.url).href;

// Individual badge rendering
export default function StampCard({ monument, unlocked }) {
  return (
    <div className={`stamp-card ${unlocked ? "unlocked" : "locked"}`}>
      <div className="stamp-card-icon-wrap">
        <img src={unlocked ? unlockedIcon : lockedIcon} alt="" className="stamp-card-icon" />
        {!unlocked && (
          <div className="stamp-card-lock-overlay">
            <Lock size={16} />
          </div>
        )}
      </div>
      <div className="stamp-card-name">{monument.title}</div>
      <div className="stamp-card-era mono">{monument.era}</div>
      <div className="stamp-card-blurb">{monument.blurb}</div>
      {!unlocked && !monument.live && <span className="stamp-card-soon mono">coming to this AR route</span>}
    </div>
  );
}
