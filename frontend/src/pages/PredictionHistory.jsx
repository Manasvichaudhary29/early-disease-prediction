import React, { useEffect, useState } from "react";
import { History, Filter, Eye, X, Calendar, Activity, Heart, Droplets } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ShapWaterfallChart } from "../components/ShapWaterfallChart";

export function PredictionHistory({ setActiveTab }) {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      const diseaseFilter = selectedDisease === "all" ? null : selectedDisease;
      api.getHistory(diseaseFilter)
        .then(res => setHistory(res))
        .catch(err => console.error("History fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, selectedDisease]);

  if (!isAuthenticated) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
        <History size={40} color="var(--accent-cyan)" style={{ margin: "0 auto 1rem" }} />
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
          Authentication Required
        </h3>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Please sign in to view your stored longitudinal prediction history and past SHAP feature explanations.
        </p>
        <button className="btn btn-primary" onClick={() => setActiveTab("login")}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <History size={24} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc" }}>
              Longitudinal Assessment History
            </h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Track historical predictions, model versions, and persistent SHAP explanations over time.
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "diabetes", "heart", "kidney"].map(d => (
            <button
              key={d}
              className={`btn ${selectedDisease === d ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", textTransform: "capitalize" }}
              onClick={() => setSelectedDisease(d)}
            >
              {d === "all" ? "All Diseases" : d}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ color: "var(--text-muted)" }}>Loading historical records...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            No prediction assessments found for this filter.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab("diabetes")}>
            Run Your First Assessment
          </button>
        </div>
      ) : (
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.85rem 0.75rem" }}>Condition</th>
                <th style={{ padding: "0.85rem 0.75rem" }}>Probability</th>
                <th style={{ padding: "0.85rem 0.75rem" }}>Risk Tier</th>
                <th style={{ padding: "0.85rem 0.75rem" }}>Model Ver.</th>
                <th style={{ padding: "0.85rem 0.75rem" }}>Date & Time</th>
                <th style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((rec) => {
                const isDiabetes = rec.disease_type === "diabetes";
                const isHeart = rec.disease_type === "heart";

                return (
                  <tr key={rec.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {isDiabetes ? <Droplets size={16} color="#f59e0b" /> :
                         isHeart ? <Heart size={16} color="#f43f5e" /> :
                         <Activity size={16} color="#06b6d4" />}
                        <span style={{ fontWeight: 600, textTransform: "capitalize", color: "#f8fafc" }}>
                          {rec.disease_type}
                        </span>
                      </div>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", fontWeight: 700, fontSize: "0.95rem" }}>
                      {Math.round(rec.risk_probability * 100)}%
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem" }}>
                      <span className={`badge ${
                        rec.risk_category === "High" ? "badge-high" :
                        rec.risk_category === "Moderate" ? "badge-moderate" : "badge-low"
                      }`}>
                        {rec.risk_category}
                      </span>
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      v{rec.model_version}
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                      {new Date(rec.created_at).toLocaleString()}
                    </td>

                    <td style={{ padding: "0.85rem 0.75rem", textAlign: "right" }}>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: "0.775rem", padding: "0.3rem 0.65rem" }}
                        onClick={() => setSelectedRecord(rec)}
                      >
                        <Eye size={14} /> View SHAP
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for SHAP Details */}
      {selectedRecord && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1.5rem"
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: "650px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative"
          }}>
            <button
              onClick={() => setSelectedRecord(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.25rem", textTransform: "capitalize" }}>
              {selectedRecord.disease_type} Risk Breakdown
            </h3>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Assessed on {new Date(selectedRecord.created_at).toLocaleString()}
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                flex: 1,
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid var(--border-color)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)"
              }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Risk Probability</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
                  {Math.round(selectedRecord.risk_probability * 100)}%
                </div>
              </div>

              <div style={{
                flex: 1,
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid var(--border-color)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)"
              }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Risk Tier</div>
                <div style={{ marginTop: "0.25rem" }}>
                  <span className={`badge ${
                    selectedRecord.risk_category === "High" ? "badge-high" :
                    selectedRecord.risk_category === "Moderate" ? "badge-moderate" : "badge-low"
                  }`}>
                    {selectedRecord.risk_category} RISK
                  </span>
                </div>
              </div>
            </div>

            {selectedRecord.shap_summary && selectedRecord.shap_summary.length > 0 && (
              <ShapWaterfallChart factors={selectedRecord.shap_summary} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
