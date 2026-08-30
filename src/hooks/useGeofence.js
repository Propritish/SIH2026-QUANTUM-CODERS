import { useCallback, useState } from "react";

/**
 * Tracks GPS location & Haversine distance to a monument.
 *
 * Proximity is checked two ways:
 *  1. Server-verified: GET /api/monuments/:slug/geofence-check, which runs
 *     MongoDB's $geoNear against the monument's 2dsphere index.
 *  2. Client fallback: if that request fails (backend not running, offline,
 *     `vite dev` without `npm run server`), the same distance is computed
 *     locally with the Haversine formula so the demo still works end-to-end.
 *
 * status: "idle" | "locating" | "near" | "far" | "denied" | "unsupported"
 */
function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function useGeofence(monumentSlug, target, radiusM = 800) {
  const [status, setStatus] = useState("idle");
  const [distance, setDistance] = useState(null);
  const [source, setSource] = useState(null); // "server" | "client"

  const evaluateOnClient = useCallback(
    (coords) => {
      const dist = haversineMeters(coords, target);
      setDistance(dist);
      setSource("client");
      setStatus(dist <= radiusM ? "near" : "far");
      return { withinRange: dist <= radiusM, distanceMeters: dist };
    },
    [target, radiusM]
  );

  const evaluate = useCallback(
    async (coords) => {
      try {
        const params = new URLSearchParams({ lat: coords.lat, lng: coords.lng });
        const res = await fetch(`/api/monuments/${monumentSlug}/geofence-check?${params}`);
        if (!res.ok) throw new Error(`geofence-check responded ${res.status}`);
        const data = await res.json();
        setDistance(data.distanceMeters);
        setSource("server");
        setStatus(data.withinRange ? "near" : "far");
        return data;
      } catch {
        return evaluateOnClient(coords);
      }
    },
    [monumentSlug, evaluateOnClient]
  );

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => evaluate({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [evaluate]);

  // For demoing away from the physical site: nudges the target coords by
  // a few metres so the distance check still runs for real.
  const simulate = useCallback(() => {
    setStatus("locating");
    setTimeout(() => {
      evaluate({ lat: target.lat + 0.0015, lng: target.lng + 0.001 });
    }, 600);
  }, [evaluate, target]);

  return { status, distance, source, locate, simulate };
}
