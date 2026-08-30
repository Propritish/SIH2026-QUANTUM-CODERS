import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import LoginForm from "../components/Auth/LoginForm.jsx";
import AdminPortal from "../components/AdminPortal/Adminportal.jsx";
import "./AdminPage.css";

// Protected upload dashboard view — gates itself: shows the admin login
// form until auth.user is an "admin" account, then shows AdminPortal.
export default function AdminPage({ auth }) {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const addUpload = (u) => setUploads((arr) => [u, ...arr]);

  const handleLogin = async ({ email, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await auth.login(email, password, "admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!auth.user || auth.user.role !== "admin") {
    return (
      <div className="page auth-page">
        <LoginForm
          onSubmit={handleLogin}
          submitting={submitting}
          error={error}
          title="Admin sign in"
          subtitle="Restricted to the curator team."
        />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <div className="admin-hero-icon">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="admin-hero-title">Curator Dashboard</h2>
          <p className="mono admin-hero-subtitle">Signed in as {auth.user.name || auth.user.email}</p>
        </div>
      </div>
      <AdminPortal auth={auth} uploads={uploads} addUpload={addUpload} />
    </div>
  );
}
