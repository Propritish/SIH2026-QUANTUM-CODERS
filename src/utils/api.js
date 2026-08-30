// Small fetch wrapper: attaches the JWT (if given) as a Bearer token,
// JSON-encodes the body, and throws on non-2xx so callers can just
// try/catch instead of checking res.ok everywhere.
export async function apiFetch(path, { method = "GET", token, body } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}
