import jwt from "jsonwebtoken";

// Verifies the "Authorization: Bearer <token>" header (the frontend stores
// this token in localStorage after login/register — see src/hooks/useAuth.js)
// and attaches the decoded payload to req.user, or responds 401.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Use after requireAuth to additionally restrict a route to one role,
// e.g. router.post("/", requireAuth, requireRole("admin"), handler).
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: `Requires "${role}" role` });
    }
    next();
  };
}
