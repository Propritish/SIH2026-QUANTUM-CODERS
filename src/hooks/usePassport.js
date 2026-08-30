import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../utils/api.js";

// Synchronizes stamps with MongoDB via /api/passport/*, scoped to the
// logged-in tourist. Login is mandatory app-wide, so there's no
// anonymous/local-only mode here — see api/routes/passportRoutes.js.
export default function usePassport(auth) {
  const [stamps, setStamps] = useState({}); // { [monumentSlug]: true }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!auth.user) {
      setStamps({});
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/api/passport/history", { token: auth.token() });
      const badges = {};
      (data.passportBadges || []).forEach((slug) => {
        badges[slug] = true;
      });
      setStamps(badges);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    load();
  }, [load]);

  const unlock = useCallback(
    async (monumentSlug, distanceMeters) => {
      if (!auth.user) return;
      // optimistic update
      setStamps((prev) => (prev[monumentSlug] ? prev : { ...prev, [monumentSlug]: true }));
      try {
        const data = await apiFetch("/api/passport/unlock-stamp", {
          method: "POST",
          token: auth.token(),
          body: { monumentId: monumentSlug, distanceMeters },
        });
        const badges = {};
        (data.passportBadges || []).forEach((slug) => {
          badges[slug] = true;
        });
        setStamps(badges);
      } catch (err) {
        console.error("unlock-stamp failed:", err);
      }
    },
    [auth]
  );

  return { stamps, unlock, loading, error, refresh: load, count: Object.keys(stamps).length };
}
