import React, { useEffect, useMemo, useState } from "react";
import { Lock } from "lucide-react";
import "./ArViewer.css";

// Local fallback used when a monument document doesn't have a hosted
// models.damagedUrl/restoredUrl yet (see scripts/seed.js). Resolves without
// requiring the binary to exist at build time — the dev/prod server just
// 404s until the real file is added under src/assets/models/.
function localModelUrl(slug, era) {
  return new URL(`../../assets/models/${slug}_${era}.glb`, import.meta.url).href;
}

// Core WebAR Surface Tracking, wrapping Google's <model-viewer>.
export default function ArViewer({ monument, era, unlocked }) {
  const useSketchfab = monument.slug === "konark" && (era === "restored" || era === "damaged");
  const sketchfabModel = era === "restored"
    ? {
        title: "Konark Sun Temple 3D model",
        embed: "https://sketchfab.com/models/f7b47d96fc144eef87fcc97988f477df/embed",
        modelUrl: "https://sketchfab.com/3d-models/konark-sun-temple-f7b47d96fc144eef87fcc97988f477df",
        modelName: "Konark Sun Temple",
        creatorUrl: "https://sketchfab.com/notyourtypicalshashank",
        creator: "notyourtypicalshashank",
      }
    : {
        title: "Sun Temple Konark 3D model",
        embed: "https://sketchfab.com/models/6cc905be2ae34e8091eb1eaa84a17738/embed?ui_theme=dark",
        modelUrl: "https://sketchfab.com/3d-models/sun-temple-konark-6cc905be2ae34e8091eb1eaa84a17738",
        modelName: "Sun Temple Konark",
        creatorUrl: "https://sketchfab.com/moniln9",
        creator: "moniln",
      };
  const remoteUrl = era === "restored" ? monument.models?.restoredUrl : monument.models?.damagedUrl;
  const localUrl = useMemo(() => localModelUrl(monument.slug, era), [monument.slug, era]);
  const [useLocalModel, setUseLocalModel] = useState(!remoteUrl);
  const [modelFailed, setModelFailed] = useState(false);

  useEffect(() => {
    setUseLocalModel(!remoteUrl);
    setModelFailed(false);
  }, [remoteUrl, monument.slug, era]);

  const src = useLocalModel ? localUrl : remoteUrl;

  function handleModelError() {
    if (!useLocalModel && localUrl !== remoteUrl) {
      setUseLocalModel(true);
      return;
    }
    setModelFailed(true);
  }

  return (
    <div className="ar-viewer">
      {!unlocked && (
        <div className="ar-viewer-lock">
          <Lock size={22} />
          <p>Check in near {monument.title} to load the model</p>
        </div>
      )}

      {useSketchfab ? (
        <>
          <iframe className="sketchfab-viewer" title={sketchfabModel.title} src={sketchfabModel.embed} allow="autoplay; fullscreen; xr-spatial-tracking" allowFullScreen />
          <p className="ar-viewer-attribution">
            <a href={sketchfabModel.modelUrl} target="_blank" rel="noreferrer">{sketchfabModel.modelName}</a>{" "}
            by <a href={sketchfabModel.creatorUrl} target="_blank" rel="noreferrer">{sketchfabModel.creator}</a>{" on "}
            <a href="https://sketchfab.com" target="_blank" rel="noreferrer">Sketchfab</a>
          </p>
        </>
      ) : (
      <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <model-viewer
        src={src}
        alt={`${monument.title} — ${era} state`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="0.9"
        onError={handleModelError}
        style={{ width: "100%", height: "260px" }}
      >
        <div className="ar-viewer-fallback" slot="poster">
          {modelFailed ? "Model could not be loaded" : `Loading ${era} model…`}
        </div>
      </model-viewer>
      </>
      )}

      {!useSketchfab && <p className="ar-viewer-path mono">
        {src} · drag to orbit
      </p>}
    </div>
  );
}
