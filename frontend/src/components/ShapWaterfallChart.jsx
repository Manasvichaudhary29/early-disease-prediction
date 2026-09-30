import React from "react";
import { ArrowUpRight, ArrowDownRight, Info, Brain } from "lucide-react";

export function ShapWaterfallChart({ factors = [] }) {
  if (!factors || factors.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "1.5rem" }}>
        No explanation attributions available for this prediction.
      </div>
    );
  }

  // Find max absolute impact to normalize bar lengths
  const maxImpact = Math.max(...factors.map(f => Math.abs(f.impact)), 0.01);

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Brain size={18} color="var(--accent-cyan)" />
          <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc" }}>
            SHAP Explainability: Key Biomarker Contributions
          </h4>
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Game-Theoretic Local Attribution
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {factors.map((item, idx) => {
          const isRisk = item.direction === "increases_risk" || item.impact > 0;
          const barWidthPercent = Math.min(Math.max((Math.abs(item.impact) / maxImpact) * 100, 8), 100);
          const barColor = isRisk ? "#f43f5e" : "#10b981";
          const bgColor = isRisk ? "rgba(244, 63, 94, 0.12)" : "rgba(16, 185, 129, 0.12)";

          return (
            <div key={idx} style={{
              background: "rgba(15, 23, 42, 0.5)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem 1rem",
              transition: "transform 0.15s ease"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  {isRisk ? (
                    <ArrowUpRight size={16} color="#f43f5e" />
                  ) : (
                    <ArrowDownRight size={16} color="#10b981" />
                  )}
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#f1f5f9" }}>
                    {item.display_name}
                  </span>
                  <span style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    background: "rgba(30, 41, 59, 0.7)",
                    padding: "1px 6px",
                    borderRadius: "4px"
                  }}>
                    Input: {String(item.user_value)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: barColor,
                    background: bgColor,
                    padding: "2px 8px",
                    borderRadius: "4px"
                  }}>
                    {isRisk ? "+ Risk" : "Protective"} ({item.impact > 0 ? `+${item.impact}` : item.impact})
                  </span>
                </div>
              </div>

              {/* Impact Bar */}
              <div style={{
                height: "6px",
                width: "100%",
                background: "rgba(51, 65, 85, 0.4)",
                borderRadius: "3px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${barWidthPercent}%`,
                  background: barColor,
                  borderRadius: "3px",
                  transition: "width 0.6s ease"
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: "1rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.5rem",
        background: "rgba(6, 182, 212, 0.06)",
        border: "1px solid rgba(6, 182, 212, 0.2)",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 1rem",
        fontSize: "0.775rem",
        color: "var(--text-secondary)"
      }}>
        <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <span>
          <strong>How to read SHAP values:</strong> Positive impact factors (Red) statistically pushed the model toward predicting higher disease risk for this specific profile. Protective factors (Green) decreased the calculated likelihood.
        </span>
      </div>
    </div>
  );
}
