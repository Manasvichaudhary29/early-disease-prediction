import React, { useState } from "react";
import { UserPlus, AlertCircle, CheckCircle2, Loader2, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Register({ setActiveTab }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.full_name.trim()) { setError("Full name is required."); return; }
    if (!form.email) { setError("Email is required."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      await register(form.email, form.full_name, form.password);
      setActiveTab("dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = form.password.length === 0 ? null
    : form.password.length < 8 ? "weak"
    : form.password.length < 12 ? "medium" : "strong";

  const strengthColor = { weak: "#f43f5e", medium: "#f59e0b", strong: "#10b981" };
  const strengthWidth = { weak: "33%", medium: "66%", strong: "100%" };

  return (
    <div className="animate-fade-in" style={{
      display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh"
    }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "14px",
            background: "linear-gradient(135deg, #10b981, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 0 24px rgba(16,185,129,0.4)"
          }}>
            <Activity color="#fff" size={28} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.4rem" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Start tracking your health risk assessments
          </p>
        </div>

        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)",
            borderRadius: "var(--radius-md)", padding: "0.75rem 1rem",
            color: "#fb7185", fontSize: "0.875rem", marginBottom: "1.25rem"
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullname">Full Name</label>
            <input
              id="fullname"
              type="text"
              className="form-input"
              placeholder="e.g., Priya Sharma"
              value={form.full_name}
              onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              autoComplete="new-password"
              required
            />
            {passwordStrength && (
              <div style={{ marginTop: "0.4rem" }}>
                <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.1)" }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    width: strengthWidth[passwordStrength],
                    background: strengthColor[passwordStrength],
                    transition: "all 0.3s"
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: strengthColor[passwordStrength], marginTop: "0.2rem", display: "block" }}>
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)} password
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              type="password"
              className="form-input"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
              autoComplete="new-password"
              required
            />
            {form.confirm && form.password === form.confirm && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.3rem", fontSize: "0.775rem", color: "#10b981" }}>
                <CheckCircle2 size={13} /> Passwords match
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem", padding: "0.8rem" }}
            disabled={loading}
          >
            {loading ? <><Loader2 size={16} className="spin" /> Creating account…</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <button
            onClick={() => setActiveTab("login")}
            style={{ background: "none", border: "none", color: "var(--accent-cyan)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}
          >
            Sign in →
          </button>
        </div>
      </div>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
