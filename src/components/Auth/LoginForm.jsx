import React, { useState } from "react";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import "./Auth.css";

// Sign-in form. Reused for both the tourist login (LoginPage, inside the
// hero-split layout) and the admin login (embedded directly in AdminPage).
export default function LoginForm({ onSubmit, submitting, error, title, subtitle, submitLabel = "Log in" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="auth-card">
      <h2>{title}</h2>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </span>
        </label>
        {error && <div className="auth-error">{error}</div>}
        <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
          {submitting ? <Loader2 size={15} className="auth-spin" /> : <ArrowRight size={15} />}
          {submitting ? "Signing in…" : submitLabel}
        </button>
      </form>
    </div>
  );
}
