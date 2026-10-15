import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations.js";

const LANGUAGE_KEY = "odisha-ar-heritage:language";
const LanguageContext = createContext(null);

function readLanguage() {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    return saved && translations[saved] ? saved : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readLanguage);
  const setLang = useCallback((nextLang) => {
    if (!translations[nextLang]) return;
    setLangState(nextLang);
    try {
      window.localStorage.setItem(LANGUAGE_KEY, nextLang);
    } catch {
      // Language still changes for the current session if storage is unavailable.
    }
  }, []);

  const t = useCallback((key, values = {}) => {
    const template = translations[lang]?.[key] ?? translations.en[key] ?? key;
    return template.replace(/\{([^}]+)\}/g, (_, name) => values[name] ?? `{${name}}`);
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  useEffect(() => {
    document.documentElement.lang = lang === "or" ? "or" : lang === "hi" ? "hi" : "en";
  }, [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
