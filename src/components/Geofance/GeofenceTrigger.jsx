import React from "react";
import { Radio, MapPin, Unlock, Lock, Navigation, Sparkles, Compass } from "lucide-react";
import "./Geofence.css";

const STATUS_CONFIG = {
  idle: { className: "idle", text: "Not checked yet", Icon: Radio },
  locating: { className: "idle", text: "Reading your location…", Icon: Compass },
  far: { className: "far", text: "Too far from the temple to unlock AR", Icon: MapPin },
  near: { className: "near", text: "You're within range — AR unlocked", Icon: Unlock },
  denied: { className: "far", text: "Location permission was denied", Icon: Lock },
  unsupported: { className: "far", text: "Geolocation isn't supported on this device", Icon: Lock },
};

// GPS Geofenced Trigger — checks proximity to a monument and reports status
export default function GeofenceTrigger({ status, distance, source, target, onLocate, onSimulate }) {
  const { className, text, Icon } = STATUS_CONFIG[status] || STATUS_CONFIG.idle;

  return (
    <div className={`geofence geofence-${className}`}>
      <div className="geofence-status">
        <Icon size={18} />
        <div>
          <div className="geofence-text">{text}</div>
          {distance != null && (
            <div className="geofence-distance mono">
              {Math.round(distance)} m from target ({target.lat.toFixed(4)}, {target.lng.toFixed(4)})
              {source && ` · ${source === "server" ? "verified via $geoNear" : "computed on device"}`}
            </div>
          )}
        </div>
      </div>
      <div className="geofence-actions">
        <button className="btn btn-primary" onClick={onLocate}>
          <Navigation size={13} /> Use my location
        </button>
        <button className="btn btn-outline" onClick={onSimulate}>
          <Sparkles size={13} /> Simulate arrival
        </button>
      </div>
    </div>
  );
}
