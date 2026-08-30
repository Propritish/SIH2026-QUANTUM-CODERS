import React, { useState } from "react";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import "./Auth.css";

// Account creation form — tourists only (see api/routes/authRoutes.js;
// admin accounts aren't created through the UI).
export default function SignupForm({ onSubmit, submitting, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <div className="auth-card">
      <h2>Create your passport</h2>
      <p className="auth-subtitle">Sign up to start collecting heritage stamps.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field-label">Full name</span>
          <span className="auth-field-input">
            <User size={16} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ananya Rao" required autoComplete="name" />
          </span>
        </label>
        <label className="auth-field">
          <span className="auth-field-label">Email</span>
          <span className="auth-field-input">
            <Mail size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </span>
        </label>
        <label className="auth-field">
          <span className="auth-field-label">Password</span>
          <span className="auth-field-input">
            <Lock size={16} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </span>
        </label>
        {error && <div className="auth-error">{error}</div>}
        <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
          {submitting ? <Loader2 size={15} className="auth-spin" /> : <ArrowRight size={15} />}
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
