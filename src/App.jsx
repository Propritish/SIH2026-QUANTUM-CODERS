import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import ProtectedRoute from "./components/Auth/ProtectedRoute.jsx";
import WelcomeSplash from "./components/WelcomeSplash/WelcomeSplash.jsx";
import ExplorerPage from "./pages/ExplorerPage.jsx";
import PassportPage from "./pages/PassportPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DiscoverPage from "./pages/DiscoverPage.jsx";
import usePassport from "./hooks/usePassport.js";
import useAuth from "./hooks/useAuth.js";

const SEEN_KEY = "odisha-ar-heritage:splash-seen";

// Router configuration & Protected Routes
export default function App() {
  const [lang, setLang] = useState("en");
  const [showSplash, setShowSplash] = useState(
    () => window.sessionStorage.getItem(SEEN_KEY) !== "true"
  );
  const auth = useAuth();
  const passport = usePassport(auth);

  if (showSplash) {
    return <WelcomeSplash onDone={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-shell">
      <Navbar lang={lang} setLang={setLang} stampCount={passport.count} user={auth.user} onLogout={auth.logout} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to={auth.user ? "/discover" : "/login"} replace />} />
          <Route path="/login" element={<LoginPage auth={auth} />} />

          {/* Mandatory tourist login for the AR experience + passport */}
          <Route
            path="/discover"
            element={
              <ProtectedRoute user={auth.user}>
                <DiscoverPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explorer"
            element={
              <ProtectedRoute user={auth.user}>
                <ExplorerPage lang={lang} passport={passport} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/passport"
            element={
              <ProtectedRoute user={auth.user}>
                <PassportPage passport={passport} />
              </ProtectedRoute>
            }
          />

          {/* Admin gates itself internally — shows a login form until an
              admin account is authenticated, see pages/AdminPage.jsx */}
          <Route path="/admin" element={<AdminPage auth={auth} />} />
        </Routes>
      </main>
      <footer className="app-footer">odisha-ar-heritage · React + Vite + Express · deploy target: Vercel</footer>
    </div>
  );
}
