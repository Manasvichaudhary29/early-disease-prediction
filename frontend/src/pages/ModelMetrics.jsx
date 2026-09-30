import React, { useEffect, useState } from "react";
import { BrainCircuit, CheckCircle, TrendingUp, Target, AlertTriangle, Loader2 } from "lucide-react";
import { api } from "../services/api";

function MetricBar({ value, max = 1, color }) {
  return (
    <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${Math.min(100, (value / max) * 100).toFixed(1)}%`,
        background: color,
        borderRadius: "3px",
        transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)"
      }} />
    </div>
  );
}

function DiseaseCard({ title, icon, color, accentBg, data }) {
  if (!data) return null;
  const best = data.best_algorithm;
  const metrics = data.metrics || {};
  const allModels = data.all_models || {};

  return (
    <div className="glass-card animate-fade-in" style={{ marginBottom: "1.5rem" }}>
      {/* Card Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: accentBg, border: `1px solid ${color}40`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontWeight: 700, color: "#f8fafc", fontSize: "1.15rem" }}>{title}</h3>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Best model: <span style={{ color, fontWeight: 600 }}>{best?.replace(/_/g, " ")}</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>
            <CheckCircle size={11} /> {(metrics.accuracy * 100)?.toFixed(1)}% Acc
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
        {[
          { label: "Accuracy", value: metrics.accuracy, color: "#06b6d4" },
          { label: "Precision", value: metrics.precision, color: "#3b82f6" },
          { label: "Recall", value: metrics.recall, color: "#10b981" },
          { label: "F1 Score", value: metrics.f1_score, color: "#f59e0b" }
        ].map(m => (
          <div key={m.label} style={{
            padding: "0.9rem",
            background: "rgba(15,23,42,0.5)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)"
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>{m.label}</div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: m.color, marginBottom: "0.4rem" }}>
              {m.value != null ? `${(m.value * 100).toFixed(1)}%` : "—"}
            </div>
            <MetricBar value={m.value || 0} color={m.color} />
          </div>
        ))}
      </div>

      {/* AUC & CV Score */}
      {(metrics.roc_auc || metrics.cv_accuracy_mean) && (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {metrics.roc_auc && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "var(--radius-md)", padding: "0.5rem 0.9rem",
              fontSize: "0.85rem"
            }}>
              <TrendingUp size={15} color="#10b981" />
              <span style={{ color: "var(--text-secondary)" }}>ROC-AUC:</span>
              <strong style={{ color: "#10b981" }}>{(metrics.roc_auc * 100).toFixed(1)}%</strong>
            </div>
          )}
          {metrics.cv_accuracy_mean && (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)",
              borderRadius: "var(--radius-md)", padding: "0.5rem 0.9rem",
              fontSize: "0.85rem"
            }}>
              <Target size={15} color="#06b6d4" />
              <span style={{ color: "var(--text-secondary)" }}>5-Fold CV:</span>
              <strong style={{ color: "#06b6d4" }}>{(metrics.cv_accuracy_mean * 100).toFixed(1)}%</strong>
            </div>
          )}
        </div>
      )}

      {/* All candidate models */}
      {allModels && Object.keys(allModels).length > 1 && (
        <details style={{ marginTop: "1.25rem" }}>
          <summary style={{
            cursor: "pointer", fontSize: "0.85rem", color: "var(--text-secondary)",
            padding: "0.5rem 0", borderTop: "1px solid var(--border-color)",
            userSelect: "none"
          }}>
            All candidate models ({Object.keys(allModels).length})
          </summary>
          <div style={{ marginTop: "0.75rem", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Model</th>
                  <th style={{ padding: "0.5rem", textAlign: "center" }}>Accuracy</th>
                  <th style={{ padding: "0.5rem", textAlign: "center" }}>F1</th>
                  <th style={{ padding: "0.5rem", textAlign: "center" }}>ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(allModels).map(([name, m]) => (
                  <tr key={name} style={{
                    borderBottom: "1px solid rgba(148,163,184,0.06)",
                    background: name === best ? "rgba(6,182,212,0.06)" : "transparent"
                  }}>
                    <td style={{ padding: "0.6rem 0.5rem", fontWeight: name === best ? 700 : 400, color: name === best ? "#38bdf8" : "var(--text-secondary)" }}>
                      {name === best && "★ "}{name.replace(/_/g, " ")}
                    </td>
                    <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>{m.accuracy != null ? `${(m.accuracy * 100).toFixed(1)}%` : "—"}</td>
                    <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>{m.f1_score != null ? `${(m.f1_score * 100).toFixed(1)}%` : "—"}</td>
                    <td style={{ padding: "0.6rem 0.5rem", textAlign: "center" }}>{m.roc_auc != null ? `${(m.roc_auc * 100).toFixed(1)}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}


export function ModelMetrics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getModelMetrics()
      .then(setData)
      .catch(err => setError(err.message || "Failed to load model metrics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "1rem" }}>
      <Loader2 size={40} color="var(--accent-cyan)" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ color: "var(--text-secondary)" }}>Loading model benchmarks…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
      <AlertTriangle size={40} color="#f59e0b" style={{ marginBottom: "1rem" }} />
      <h3 style={{ color: "#f8fafc", marginBottom: "0.5rem" }}>Metrics Unavailable</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{error}</p>
      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.5rem" }}>
        Ensure the backend is running and models have been trained.
      </p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem" }}>
          <BrainCircuit size={24} color="var(--accent-cyan)" />
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f8fafc" }}>Model Algorithm Benchmarks</h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Performance evaluation of all candidate ML algorithms across three disease pipelines using 5-fold cross-validation, accuracy, precision, recall, F1, and ROC-AUC metrics.
        </p>
      </div>

      {data && (
        <>
          <DiseaseCard
            title="Diabetes Mellitus"
            icon={<span style={{ fontSize: "1.3rem" }}>🩸</span>}
            color="#f59e0b"
            accentBg="rgba(245,158,11,0.15)"
            data={data.diabetes}
          />
          <DiseaseCard
            title="Heart Disease (Cardiovascular)"
            icon={<span style={{ fontSize: "1.3rem" }}>❤️</span>}
            color="#f43f5e"
            accentBg="rgba(244,63,94,0.15)"
            data={data.heart}
          />
          <DiseaseCard
            title="Chronic Kidney Disease"
            icon={<span style={{ fontSize: "1.3rem" }}>🫘</span>}
            color="#06b6d4"
            accentBg="rgba(6,182,212,0.15)"
            data={data.kidney}
          />
        </>
      )}

      {/* Academic Note */}
      <div className="glass-card" style={{
        background: "rgba(59,130,246,0.06)",
        border: "1px solid rgba(59,130,246,0.2)",
        marginTop: "1rem"
      }}>
        <h4 style={{ color: "#93c5fd", marginBottom: "0.5rem", fontSize: "0.95rem" }}>📐 Evaluation Methodology</h4>
        <ul style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.7, paddingLeft: "1.2rem" }}>
          <li>All models evaluated using stratified 5-fold cross-validation</li>
          <li>Datasets: Pima Indians Diabetes (NIDDK), UCI Cleveland Heart Disease, UCI CKD Repository</li>
          <li>Pipeline includes StandardScaler preprocessing → GridSearchCV hyperparameter tuning → selected classifier</li>
          <li>SHAP (SHapley Additive exPlanations) used for post-hoc feature attribution on all predictions</li>
          <li>Models serialized with scikit-learn joblib for reproducible inference</li>
        </ul>
      </div>
    </div>
  );
}
