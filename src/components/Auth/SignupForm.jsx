import React, { useState } from "react";
import { Loader2, Mail, Lock, User, ArrowRight, KeyRound } from "lucide-react";
import "./Auth.css";

// Shared account creation form for tourists and setup-key-protected admins.
export default function SignupForm({ onSubmit, submitting, error, adminMode = false }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, password, setupKey });
  };

  return (
    <div className="auth-card">
      <h2>{adminMode ? "Create admin account" : "Create your passport"}</h2>
      <p className="auth-subtitle">
        {adminMode ? "Enter the setup key provided by your site owner." : "Sign up to start collecting heritage stamps."}
      </p>
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
        {adminMode && (
          <label className="auth-field">
            <span className="auth-field-label">Admin setup key</span>
            <span className="auth-field-input">
              <KeyRound size={16} />
              <input
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                required
                autoComplete="off"
              />
            </span>
          </label>
        )}
        {error && <div className="auth-error">{error}</div>}
        <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
          {submitting ? <Loader2 size={15} className="auth-spin" /> : <ArrowRight size={15} />}
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
