import { useCallback, useMemo, useState } from "react";
import { apiFetch } from "../utils/api.js";

const TOKEN_KEY = "odisha-ar-heritage:token";
const USER_KEY = "odisha-ar-heritage:user";

function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Handles JWT auth session & state. The token is kept in localStorage
// (not a cookie) and attached manually as a Bearer header by apiFetch —
// matches the "JWT stored in localStorage" flow in the architecture doc.
export default function useAuth() {
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(false);

  const persist = (token, user) => {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    setUser(user);
  };

  const login = useCallback(async (email, password, expectedRole) => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password, expectedRole },
      });
      persist(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { name, email, password },
      });
      persist(data.token, data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const token = useCallback(() => window.localStorage.getItem(TOKEN_KEY), []);

  // Memoized so the object reference only changes when user/loading
  // actually change -- login/register/logout/token are already stable
  // via useCallback. Without this, consumers like usePassport(auth)
  // that depend on the whole `auth` object in a useEffect would re-run
  // that effect on every single render (a new object every time), which
  // cascades into React's "Maximum update depth exceeded" loop guard.
  return useMemo(
    () => ({ user, loading, login, register, logout, token }),
    [user, loading, login, register, logout, token]
  );
}
