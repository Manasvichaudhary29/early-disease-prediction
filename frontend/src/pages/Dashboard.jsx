import React, { useEffect, useState } from "react";
import { Activity, Heart, Droplets, AlertTriangle, ShieldCheck, ArrowRight, BrainCircuit, History } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export function Dashboard({ setActiveTab }) {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.getHistory()
        .then(res => setHistory(res.slice(0, 5)))
        .catch(err => console.error("Error loading history:", err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  return (
    <div className="animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(18, 38, 70, 0.7) 100%)",
        border: "1px solid rgba(6, 182, 212, 0.25)",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "750px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.3)", padding: "0.3rem 0.8rem", borderRadius: "9999px", fontSize: "0.8rem", color: "#38bdf8", marginBottom: "1rem" }}>
            <BrainCircuit size={15} />
            <span>Multi-Pipeline Machine Learning & SHAP Explainability</span>
          </div>

          <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "0.75rem" }}>
            Early Disease Risk Stratification & Explainable AI
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Welcome{user ? `, ${user.full_name}` : ""}. Evaluate personal risk profiles across 
            <strong> Diabetes</strong>, <strong>Cardiovascular Disease</strong>, and <strong>Chronic Kidney Disease</strong> using 
            specialized machine learning pipelines that explain their decisions.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setActiveTab("diabetes")}>
              Assess Diabetes Risk <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab("models")}>
              View Algorithm Benchmarks
            </button>
          </div>
        </div>
      </div>

      {/* Disease Assessment Modules */}
      <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem", color: "#f8fafc" }}>
        Target Disease Screening Modules
      </h3>

      <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
        {/* Diabetes Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <Droplets color="#f59e0b" size={24} />
            </div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Diabetes Mellitus
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
              Evaluates glucose regulation, insulin response, BMI, blood pressure, and genetic pedigree to detect pre-diabetic states.
            </p>
            <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              <strong>Dataset:</strong> Pima Indians (NIDDK) • <strong>Model:</strong> Tuned Classifier
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setActiveTab("diabetes")}>
            Launch Screening <ArrowRight size={15} />
          </button>
        </div>

        {/* Heart Disease Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <Heart color="#f43f5e" size={24} />
            </div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Heart Disease
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
              Analyzes coronary artery factors including resting BP, chest pain etiology, cholesterol, ST depression, and ECG metrics.
            </p>
            <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              <strong>Dataset:</strong> UCI Cleveland • <strong>Model:</strong> Logistic Regression (86.9% Acc)
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setActiveTab("heart")}>
            Launch Screening <ArrowRight size={15} />
          </button>
        </div>

        {/* Kidney Disease Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(6, 182, 212, 0.15)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <Activity color="#06b6d4" size={24} />
            </div>
            <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Chronic Kidney Disease
            </h4>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
              Screens renal filtration indices including serum creatinine, blood urea, albuminuria, specific gravity, and electrolytes.
            </p>
            <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              <strong>Dataset:</strong> UCI CKD • <strong>Model:</strong> Tuned Classifier (92.5% Acc)
            </div>
          </div>
          <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setActiveTab("kidney")}>
            Launch Screening <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Recent History or Quick Stats */}
      {isAuthenticated && history.length > 0 && (
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <History size={18} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
                Recent Assessments
              </h4>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }} onClick={() => setActiveTab("history")}>
              View All History
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Disease</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Calculated Risk</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Category</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600, textTransform: "capitalize" }}>
                      {item.disease_type}
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", fontWeight: 700 }}>
                      {Math.round(item.risk_probability * 100)}%
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem" }}>
                      <span className={`badge ${
                        item.risk_category === "High" ? "badge-high" :
                        item.risk_category === "Moderate" ? "badge-moderate" : "badge-low"
                      }`}>
                        {item.risk_category}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 0.5rem", color: "var(--text-muted)" }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
