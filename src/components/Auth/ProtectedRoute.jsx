import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Auth guard wrapper. Redirects to the tourist login page (mandatory —
// there's no anonymous browsing of Explorer/Passport) if nobody's logged
// in, or away entirely if a role restriction doesn't match.
export default function ProtectedRoute({ user, role, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}
