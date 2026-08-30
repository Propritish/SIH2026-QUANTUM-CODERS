import React, { useState } from "react";
import { Upload, Plus, Loader2, AlertTriangle, Landmark, Inbox } from "lucide-react";
import ModelUploader from "./ModelUploader.jsx";
import { apiFetch } from "../../utils/api.js";
import "./AdminPortal.css";

const EMPTY = { title: "", lat: "", lng: "", era: "", modelUrl: "", fileName: "" };

// Admin Upload Portal — writes new records via POST /api/monuments
// (admin-only, enforced server-side by requireRole("admin")). Falls back
// to an in-memory "uploads" list, clearly flagged as local-only, if the
// API call fails — e.g. backend not running, or the token expired.
export default function AdminPortal({ auth, uploads, addUpload }) {
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.lat || !form.lng) return;
    setSaving(true);
    setError(null);

    const payload = { title: form.title, era: form.era, lat: form.lat, lng: form.lng, modelUrl: form.modelUrl };

    try {
      const monument = await apiFetch("/api/monuments", {
        method: "POST",
        token: auth.token(),
        body: payload,
      });
      addUpload({
        ...monument,
        uploadedAt: new Date(monument.createdAt || Date.now()).toISOString().slice(0, 16).replace("T", " "),
      });
      setOffline(false);
    } catch (err) {
      setOffline(true);
      setError(err.message);
      addUpload({
        ...payload,
        slug: form.title.toLowerCase().replace(/\s+/g, "-"),
        uploadedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        _local: true,
      });
    } finally {
      setSaving(false);
      setSaved(true);
      setForm(EMPTY);
      setTimeout(() => setSaved(false), 2200);
    }
  };

  const jsonPreview = JSON.stringify(
    {
      title: form.title || "…",
      location: { lat: Number(form.lat) || 0, lng: Number(form.lng) || 0 },
      era: form.era || "…",
      modelUrl: form.modelUrl || "…",
    },
    null,
    2
  );

  return (
    <div className="admin-portal">
      <div className="admin-portal-form card">
        <div className="admin-portal-form-header">
          <Upload size={16} />
          <h3>Add a monument record</h3>
        </div>
        <div className="admin-portal-fields">
          <label className="admin-field">
            <span className="admin-field-label">Monument title</span>
            <input value={form.title} onChange={set("title")} placeholder="e.g. Lingaraj Temple" />
          </label>
          <label className="admin-field">
            <span className="admin-field-label">Era</span>
            <input value={form.era} onChange={set("era")} placeholder="e.g. 11th century" />
          </label>
          <div className="admin-field-row">
            <label className="admin-field">
              <span className="admin-field-label">Latitude</span>
              <input value={form.lat} onChange={set("lat")} placeholder="20.2381" inputMode="decimal" />
            </label>
            <label className="admin-field">
              <span className="admin-field-label">Longitude</span>
              <input value={form.lng} onChange={set("lng")} placeholder="85.8341" inputMode="decimal" />
            </label>
          </div>
          <label className="admin-field">
            <span className="admin-field-label">Hosted .glb URL (optional)</span>
            <input value={form.modelUrl} onChange={set("modelUrl")} placeholder="https://…" />
          </label>
          <ModelUploader
            fileName={form.fileName}
            onSelect={(fileName) => setForm((f) => ({ ...f, fileName }))}
          />
          <button className="btn btn-primary" onClick={submit} disabled={saving}>
            {saving ? <Loader2 size={14} className="admin-portal-spin" /> : <Plus size={14} />}
            {saving ? "Saving…" : "Save to MongoDB"}
          </button>
          {saved && !offline && <span className="admin-portal-saved">Saved to monuments collection.</span>}
          {saved && offline && (
            <span className="admin-portal-warning">
              <AlertTriangle size={13} /> API unreachable — kept locally only ({error}).
            </span>
          )}
        </div>
      </div>

      <div className="admin-portal-output">
        <div className="card-dark admin-portal-preview">
          <div className="mono admin-portal-preview-label">live preview · POST /api/monuments</div>
          <pre>{jsonPreview}</pre>
        </div>
        <div className="card admin-portal-history">
          <div className="admin-portal-history-title">
            <Landmark size={13} /> Uploaded this session ({uploads.length})
          </div>
          {uploads.length === 0 && (
            <div className="admin-portal-empty">
              <Inbox size={22} />
              <p>Nothing added yet — new records will appear here.</p>
            </div>
          )}
          {uploads.map((u, i) => (
            <div key={i} className="admin-portal-history-row">
              <span>
                {u.title}
                {u._local && <span className="admin-portal-local-tag mono"> local only</span>}
              </span>
              <span className="mono">{u.uploadedAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
