import React from "react";
import { Radio, MapPin, Unlock, Lock, Navigation, Sparkles, Compass } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Geofence.css";

const STATUS_CONFIG = {
  idle: { className: "idle", key: "geofence.idle", Icon: Radio },
  locating: { className: "idle", key: "geofence.locating", Icon: Compass },
  far: { className: "far", key: "geofence.far", Icon: MapPin },
  near: { className: "near", key: "geofence.near", Icon: Unlock },
  denied: { className: "far", key: "geofence.denied", Icon: Lock },
  unsupported: { className: "far", key: "geofence.unsupported", Icon: Lock },
};

export default function GeofenceTrigger({ status, distance, source, target, onLocate, onSimulate }) {
  const { t } = useLanguage();
  const { className, key, Icon } = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const safeTarget = target ?? { lat: 0, lng: 0 };
  const targetLat = Number.isFinite(safeTarget.lat) ? safeTarget.lat : 0;
  const targetLng = Number.isFinite(safeTarget.lng) ? safeTarget.lng : 0;

  return (
    <div className={`geofence geofence-${className}`}>
      <div className="geofence-status">
        <Icon size={18} />
        <div>
          <div className="geofence-text">{t(key)}</div>
          {distance != null && (
            <div className="geofence-distance mono">
              {t("geofence.distance", { distance: Math.round(distance), lat: targetLat.toFixed(4), lng: targetLng.toFixed(4) })}
              {source && ` · ${t(source === "server" ? "geofence.server" : "geofence.device")}`}
            </div>
          )}
        </div>
      </div>
      <div className="geofence-actions">
        <button className="btn btn-primary" onClick={onLocate}>
          <Navigation size={13} /> {t("geofence.useLocation")}
        </button>
        <button className="btn btn-outline" onClick={onSimulate}>
          <Sparkles size={13} /> {t("geofence.simulate")}
        </button>
      </div>
    </div>
  );
}
