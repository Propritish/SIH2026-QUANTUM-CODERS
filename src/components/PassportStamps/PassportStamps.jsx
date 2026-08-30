import React, { useEffect, useMemo, useState } from "react";
import { Award } from "lucide-react";
import StampCard from "./StampCard.jsx";
import ProgressRing from "../ProgressRing/ProgressRing.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { apiFetch } from "../../utils/api.js";
import "./PassportStamps.css";

// Unlocked stamp grid — pulls the monument catalogue from GET /api/monuments
// and cross-references it against the account's unlockedStamps (from
// GET /api/passport/history, loaded by usePassport). A progress ring
// leads as the hero, and a search bar narrows the grid by name/era.
export default function PassportStamps({ unlockedStamps }) {
  const [monuments, setMonuments] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    apiFetch("/api/monuments")
      .then(setMonuments)
      .catch(() => setMonuments([]));
  }, []);

  const unlockedCount = monuments.filter((m) => unlockedStamps[m.slug]).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return monuments;
    return monuments.filter(
      (m) => m.title.toLowerCase().includes(q) || (m.era || "").toLowerCase().includes(q)
    );
  }, [monuments, query]);

  return (
    <div>
      <div className="passport-header">
        <ProgressRing value={unlockedCount} total={monuments.length} />
        <div>
          <h2 className="passport-title">Heritage Passport</h2>
          <p className="passport-subtitle mono">
            {unlockedCount} of {monuments.length} wheels collected
          </p>
        </div>
        <Award size={22} className="passport-header-award" />
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Search your stamps…" />

      <div className="stamp-grid">
        {filtered.map((m) => (
          <StampCard key={m.slug} monument={m} unlocked={!!unlockedStamps[m.slug]} />
        ))}
      </div>
      {filtered.length === 0 && <p className="mono passport-empty">No stamps match your search.</p>}

      <p className="mono passport-footnote">
        hooks/usePassport.js — synced with MongoDB via /api/passport/*
      </p>
    </div>
  );
}
