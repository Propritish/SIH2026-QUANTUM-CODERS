import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./DiscoveryMap.css";

const ODISHA_CENTER = [20.4, 85.3];

// A small sun-wheel divIcon, reusing the app's signature motif as the map
// pin instead of Leaflet's default marker (also sidesteps the classic
// broken-default-icon-path issue bundlers have with Leaflet).
function wheelIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="34" height="34">
      <circle cx="20" cy="20" r="15" fill="none" stroke="${color}" stroke-width="4"/>
      <circle cx="20" cy="20" r="4" fill="${color}"/>
      <line x1="20" y1="5" x2="20" y2="35" stroke="${color}" stroke-width="2"/>
      <line x1="5" y1="20" x2="35" y2="20" stroke="${color}" stroke-width="2"/>
      <line x1="9.4" y1="9.4" x2="30.6" y2="30.6" stroke="${color}" stroke-width="2"/>
      <line x1="30.6" y1="9.4" x2="9.4" y2="30.6" stroke="${color}" stroke-width="2"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "wheel-marker",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -14],
  });
}

const LIVE_ICON = wheelIcon("#C9963C");
const SOON_ICON = wheelIcon("#8A7860");

// Fits the map viewport to whatever monuments are showing, so filtering
// down to a search result re-frames the map instead of leaving it zoomed
// out to the whole state.
function FitToMarkers({ monuments }) {
  const map = useMap();
  useEffect(() => {
    if (!monuments.length) return;
    const bounds = monuments.map((m) => [m.location.coordinates[1], m.location.coordinates[0]]);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }, [monuments, map]);
  return null;
}

// Plots the given monuments on a Leaflet + OpenStreetMap map. Live sites
// (Konark today) get a gold wheel and a translucent circle showing the
// actual geofence radius used by useGeofence; upcoming sites get a muted
// grey wheel. Monument list is owned by the parent (DiscoverPage) so the
// map, search bar, and spotlight cards all reflect the same filtered set.
export default function DiscoveryMap({ monuments }) {
  return (
    <div className="discovery-map-wrap">
      <MapContainer center={ODISHA_CENTER} zoom={7} scrollWheelZoom className="discovery-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {monuments.map((m) => (
          <React.Fragment key={m._id || m.slug || m.id}>
            <Marker
              position={[m.location.coordinates[1], m.location.coordinates[0]]}
              icon={m.live ? LIVE_ICON : SOON_ICON}
            >
              <Popup>
                <div className="discovery-popup">
                  <strong>{m.title}</strong>
                  <div className="discovery-popup-era">{m.era}</div>
                  <p>{m.blurb}</p>
                  {m.live ? (
                    <Link to="/explorer" className="discovery-popup-link">
                      Explore in AR →
                    </Link>
                  ) : (
                    <span className="discovery-popup-soon">Coming to this AR route</span>
                  )}
                </div>
              </Popup>
            </Marker>
            {m.live && (
              <Circle
                center={[m.location.coordinates[1], m.location.coordinates[0]]}
                radius={m.radiusMeters || 800}
                pathOptions={{ color: "#C9963C", fillColor: "#C9963C", fillOpacity: 0.12, weight: 1.5 }}
              />
            )}
          </React.Fragment>
        ))}
        {monuments.length > 0 && <FitToMarkers monuments={monuments} />}
      </MapContainer>
      {monuments.length === 0 && (
        <div className="discovery-map-empty">
          <p>No monuments match your search.</p>
        </div>
      )}
    </div>
  );
}
