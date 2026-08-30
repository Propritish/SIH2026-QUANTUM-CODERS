import React from "react";
import PassportStamps from "../components/PassportStamps/PassportStamps.jsx";

// Tourist travel history view
export default function PassportPage({ passport }) {
  return (
    <div className="page">
      <PassportStamps unlockedStamps={passport.stamps} />
    </div>
  );
}
