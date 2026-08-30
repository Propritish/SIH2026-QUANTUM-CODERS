import React, { useEffect, useMemo, useState } from "react";
import { Map as MapIcon } from "lucide-react";
import DiscoveryMap from "../components/DiscoveryMap/DiscoveryMap.jsx";
import MonumentSpotlight from "../components/MonumentSpotlight/MonumentSpotlight.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import { apiFetch } from "../utils/api.js";
import "./DiscoverPage.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live in AR" },
  { id: "soon", label: "Coming soon" },
];

// Browse every monument on a map — gold wheels are live in AR now,
// grey wheels are coming soon to this route. Search + filter chips
// narrow both the map markers and the spotlight card strip together.
export default function DiscoverPage() {
  const [monuments, setMonuments] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    apiFetch("/api/monuments")
      .then(setMonuments)
      .catch((err) => setError(err.message));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return monuments.filter((m) => {
      if (filter === "live" && !m.live) return false;
      if (filter === "soon" && m.live) return false;
      if (!q) return true;
      return (
        (m.title || "").toLowerCase().includes(q) ||
        (m.era || "").toLowerCase().includes(q) ||
        (m.blurb || "").toLowerCase().includes(q)
      );
    });
  }, [monuments, query, filter]);

  return (
    <div className="discover-page">
      <div className="discover-hero">
        <div className="discover-hero-icon">
          <MapIcon size={20} />
        </div>
        <div>
          <h2 className="discover-title">Discover Odisha's Heritage</h2>
          <p className="mono discover-subtitle">
            {monuments.length > 0
              ? `${monuments.filter((m) => m.live).length} live in AR · ${monuments.length} monuments on the map`
              : "Loading the heritage route…"}
          </p>
        </div>
      </div>

      <div className="discover-controls">
        <SearchBar value={query} onChange={setQuery} placeholder="Search monuments, eras, places…" />
        <div className="discover-chips">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`discover-chip ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mono discovery-map-error">Couldn't load monuments: {error}</p>}

      <DiscoveryMap monuments={filtered} />
      <MonumentSpotlight monuments={filtered} />
    </div>
  );
}
