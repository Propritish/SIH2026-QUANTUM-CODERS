import React from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";

// Reusable search input — icon-prefixed, with a clear (×) button once
// there's a query. Used on DiscoverPage (filter monuments/map markers)
// and PassportPage (filter the stamp grid).
export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
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
        <button className="search-bar-clear" onClick={() => onChange("")} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
