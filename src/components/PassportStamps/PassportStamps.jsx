import React, { useEffect, useMemo, useState } from "react";
import { Award } from "lucide-react";
import StampCard from "./StampCard.jsx";
import ProgressRing from "../ProgressRing/ProgressRing.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";
import { apiFetch } from "../../utils/api.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./PassportStamps.css";

// Unlocked stamp grid — pulls the monument catalogue from GET /api/monuments
// and cross-references it against the account's unlockedStamps (from
// GET /api/passport/history, loaded by usePassport). A progress ring
// leads as the hero, and a search bar narrows the grid by name/era.
export default function PassportStamps({ unlockedStamps }) {
  const { t } = useLanguage();
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
          <h2 className="passport-title">{t("passport.title")}</h2>
          <p className="passport-subtitle mono">
            {t("passport.count", { unlocked: unlockedCount, total: monuments.length })}
          </p>
        </div>
        <Award size={22} className="passport-header-award" />
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder={t("passport.search")} />

      <div className="stamp-grid">
        {filtered.map((m) => (
          <StampCard key={m.slug} monument={m} unlocked={!!unlockedStamps[m.slug]} />
        ))}
      </div>
      {filtered.length === 0 && <p className="mono passport-empty">{t("passport.empty")}</p>}

      <p className="mono passport-footnote">
        {t("passport.saved")}
      </p>
    </div>
  );
}
