import React, { useEffect, useState } from "react";
import { Check, Compass } from "lucide-react";
import GeofenceTrigger from "../components/Geofence/GeofenceTrigger.jsx";
import ArViewer from "../components/ArViewer/ArViewer.jsx";
import TimeSlider from "../components/TimeSlider/TimeSlider.jsx";
import MonumentInfo from "../components/MonumentInfo/MonumentInfo.jsx";
import AudioGuide from "../components/AudioGuide/AudioGuide.jsx";
import useGeofence from "../hooks/useGeofence.js";
import { apiFetch } from "../utils/api.js";
import "./ExplorerPage.css";

const SLUG = "konark"; // this route is scoped to the Konark site

// Main WebAR experience view + Geofence banner. This genuinely is a
// sequential flow (check in -> explore in AR -> learn -> listen), so
// numbered step labels are used deliberately here, unlike other pages.
export default function ExplorerPage({ lang, passport }) {
  const [monument, setMonument] = useState(null);
  const [era, setEra] = useState("restored");
  const [audioLang, setAudioLang] = useState(lang);

  useEffect(() => {
    apiFetch(`/api/monuments/${SLUG}`)
      .then(setMonument)
      .catch(() => setMonument(null));
  }, []);

  const target = monument
    ? { lat: monument.location.coordinates[1], lng: monument.location.coordinates[0] }
    : { lat: 0, lng: 0 };
  const geofence = useGeofence(SLUG, target, monument?.radiusMeters || 800);

  const unlocked = !!passport.stamps[SLUG];

  useEffect(() => {
    if (geofence.status === "near") passport.unlock(SLUG, geofence.distance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geofence.status]);

  if (!monument) {
    return (
      <div className="explorer-page">
        <p className="mono">Loading monument data…</p>
      </div>
    );
  }

  return (
    <div className="explorer-page">
      <div className="explorer-hero">
        <div className="explorer-hero-icon">
          <Compass size={20} />
        </div>
        <div>
          <h2 className="explorer-hero-title">{monument.title}</h2>
          <p className="mono explorer-hero-subtitle">{monument.era} · in-AR heritage walk</p>
        </div>
      </div>

      <div className="explorer-step">
        <span className="explorer-step-label mono">Step 1 · Check in</span>
        <GeofenceTrigger
          status={geofence.status}
          distance={geofence.distance}
          source={geofence.source}
          target={target}
          onLocate={geofence.locate}
          onSimulate={geofence.simulate}
        />
      </div>

      <div className="explorer-step">
        <span className="explorer-step-label mono">Step 2 · Explore in AR</span>
        <ArViewer monument={monument} era={era} unlocked={unlocked} />
        <TimeSlider era={era} setEra={setEra} />
      </div>

      <div className="explorer-step">
        <span className="explorer-step-label mono">Step 3 · Learn the history</span>
        <MonumentInfo monument={monument} era={era} />
      </div>

      <div className="explorer-step">
        <span className="explorer-step-label mono">Step 4 · Listen along</span>
        <AudioGuide monument={monument} era={era} lang={audioLang} setLang={setAudioLang} />
      </div>

      {unlocked && (
        <div className="explorer-unlocked">
          <Check size={15} />
          <span>{monument.title.split(" ")[0]} stamp added to your passport.</span>
        </div>
      )}
    </div>
  );
}
