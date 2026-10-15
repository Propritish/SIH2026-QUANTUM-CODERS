import React from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./SearchBar.css";

// Reusable search input — icon-prefixed, with a clear (×) button once
// there's a query. Used on DiscoverPage (filter monuments/map markers)
// and PassportPage (filter the stamp grid).
export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  const { t } = useLanguage();
  return (
    <div className="search-bar">
      <Search size={16} className="search-bar-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button className="search-bar-clear" onClick={() => onChange("")} aria-label={t("search.clear")}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
