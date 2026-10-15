import React, { useEffect, useMemo, useState } from "react";
import DiscoveryMap from "../components/DiscoveryMap/DiscoveryMap.jsx";
import MonumentSpotlight from "../components/MonumentSpotlight/MonumentSpotlight.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import { apiFetch } from "../utils/api.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import "./DiscoverPage.css";

const FILTERS = [
  { id: "all", label: "filter.all" },
  { id: "live", label: "filter.live" },
  { id: "soon", label: "filter.soon" },
];

export default function DiscoverPage() {
  const { t } = useLanguage();
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
      <section className="discover-hero">
        <div className="discover-hero-content">
          <h2 className="discover-title">{t("discover.title")}</h2>
          <p className="discover-subtitle">
            {monuments.length > 0
              ? t("discover.summary", { live: monuments.filter((m) => m.live).length, total: monuments.length })
              : t("discover.tagline")}
          </p>
          <div className="discover-controls">
            <SearchBar value={query} onChange={setQuery} placeholder={t("discover.search")} />
            <div className="discover-chips">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`discover-chip ${filter === f.id ? "active" : ""}`}
                  onClick={() => setFilter(f.id)}
                >
                  {t(f.label)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="discover-results">
        {error && <p className="mono discovery-map-error">{t("discover.error", { error })}</p>}
        <DiscoveryMap monuments={filtered} />
        <MonumentSpotlight monuments={filtered} />
      </div>
    </div>
  );
}
