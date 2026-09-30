import React, { useState } from "react";
import { LogIn, AlertCircle, Loader2, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login({ setActiveTab }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      setActiveTab("dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh"
    }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "56px", height: "56px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 0 24px rgba(6,182,212,0.4)"
          }}>
            <Activity color="#fff" size={28} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.4rem" }}>
            Sign in to PulsePredict
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Access your disease risk assessment history
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
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
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
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Your password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem", padding: "0.8rem" }}
            disabled={loading}
          >
            {loading ? <><Loader2 size={16} className="spin" /> Signing in…</> : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <button
            onClick={() => setActiveTab("register")}
            style={{ background: "none", border: "none", color: "var(--accent-cyan)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}
          >
            Create one →
          </button>
        </div>

        {/* Quick demo hint */}
        <div style={{
          marginTop: "1.5rem",
          padding: "0.75rem",
          background: "rgba(6,182,212,0.08)",
          border: "1px solid rgba(6,182,212,0.2)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.8rem",
          color: "var(--text-secondary)"
        }}>
          💡 <strong>First time?</strong> Register a free account to save your predictions and view history.
        </div>
      </div>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
