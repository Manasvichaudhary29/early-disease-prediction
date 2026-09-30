import React from "react";
import { AlertCircle } from "lucide-react";

export function MedicalDisclaimer() {
  return (
    <div style={{
      background: "rgba(245, 158, 11, 0.08)",
      border: "1px solid rgba(245, 158, 11, 0.25)",
      borderRadius: "var(--radius-md)",
      padding: "0.85rem 1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.85rem",
      marginTop: "1.5rem"
    }}>
      <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
      <div style={{ fontSize: "0.8rem", color: "#e2e8f0", lineHeight: 1.45 }}>
        <strong>Academic Research & Screening Disclaimer:</strong> This machine learning system is designed solely for preliminary risk screening and educational research. It is <em>not</em> an FDA-approved or certified clinical diagnostic device. Always seek direct consultation with licensed medical healthcare providers for clinical diagnosis.
      </div>
    </div>
  );
}
