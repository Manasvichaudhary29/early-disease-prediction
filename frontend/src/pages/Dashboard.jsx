import React, { useEffect, useState } from "react";
import { Activity, Heart, Droplets, ArrowRight, BrainCircuit, History, Shield, Zap, Sparkles, ChevronRight, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export function Dashboard({ setActiveTab }) {
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [activeOrgan, setActiveOrgan] = useState("heart"); // "heart" | "kidney" | "diabetes"

  useEffect(() => {
    if (isAuthenticated) {
      api.getHistory()
        .then(res => setHistory(res.slice(0, 4)))
        .catch(err => console.error("Error loading history:", err));
    }
  }, [isAuthenticated]);

  const organDetails = {
    heart: {
      title: "Cardiovascular System",
      subtitle: "Coronary artery & hemodynamic risk evaluation",
      image: "/heart_3d.jpg",
      route: "heart",
      color: "#f43f5e",
      metrics: [
        { label: "Resting Heart Rate", value: "74 BPM", sub: "Sinus Rhythm" },
        { label: "Normal Blood Pressure", value: "120/80", sub: "Optimal Hemodynamics" },
        { label: "Cardiac Output", value: "4.8 L/min", sub: "Normal Stroke Vol." },
        { label: "Oxygen Saturation", value: "98% SpO2", sub: "Normal Perfusion" },
      ]
    },
    kidney: {
      title: "Renal Filtration System",
      subtitle: "Glomerular function & chronic kidney disease staging",
      image: "/kidney_3d.jpg",
      route: "kidney",
      color: "#06b6d4",
      metrics: [
        { label: "Glomerular Filtration", value: "118 mL/min", sub: "Stage 1: Normal GFR" },
        { label: "Serum Creatinine", value: "0.85 mg/dL", sub: "Optimal Clearance" },
        { label: "Albumin / Proteinuria", value: "Nil (0)", sub: "No Microalbuminuria" },
        { label: "Electrolyte Balance", value: "140 mEq/L", sub: "Sodium / Potassium Stable" },
      ]
    },
    diabetes: {
      title: "Metabolic & Endocrine System",
      subtitle: "Glucose regulation, insulin sensitivity & beta-cell function",
      image: "/diabetes_3d.jpg",
      route: "diabetes",
      color: "#f59e0b",
      metrics: [
        { label: "Fasting Blood Glucose", value: "95 mg/dL", sub: "Euglycemic Range" },
        { label: "Estimated HbA1c", value: "5.4%", sub: "Optimal 90-Day Avg" },
        { label: "Insulin Regulation", value: "Active", sub: "Normal Homeostasis" },
        { label: "Metabolic Pedigree", value: "Low Risk", sub: "Genetic Family Index" },
      ]
    }
  };

  const currentOrgan = organDetails[activeOrgan];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: "2rem" }}>
      
      {/* Top Hero Section: Split Layout with Doctor & Holographic Telemetry */}
      <div className="glass-card" style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(18, 38, 70, 0.85) 100%)",
        border: "1px solid rgba(56, 189, 248, 0.25)",
        borderRadius: "24px",
        padding: "2.5rem 2rem",
        marginBottom: "2.5rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(6, 182, 212, 0.15)"
      }}>
        {/* Ambient background glow orbs */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "2.5rem",
          alignItems: "center"
        }} className="hero-split-grid">
          
          {/* Left Text & Action Column */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "rgba(6, 182, 212, 0.12)", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "0.35rem 0.9rem", borderRadius: "9999px", fontSize: "0.825rem", color: "#38bdf8", marginBottom: "1.25rem" }}>
              <span className="pulse-indicator"></span>
              <span style={{ fontWeight: 600 }}>Live AI Clinical Intelligence • 99% Benchmark Accuracy</span>
            </div>

            <h1 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1rem"
            }}>
              Next-Gen Early Disease Risk Screening
            </h1>

            <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.75rem", maxWidth: "600px" }}>
              Welcome{user ? `, ${user.full_name}` : ""}. Screen patient risk across 
              <strong style={{ color: "#f1f5f9" }}> Cardiovascular</strong>, 
              <strong style={{ color: "#f1f5f9" }}> Diabetes</strong>, and 
              <strong style={{ color: "#f1f5f9" }}> Renal</strong> systems using tuned machine learning pipelines with 
              transparent SHAP feature attribution.
            </p>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: "0.75rem 1.4rem", fontSize: "0.925rem", borderRadius: "14px" }}
                onClick={() => setActiveTab("heart")}
              >
                <Heart size={18} /> Heart Screening <ArrowRight size={16} />
              </button>
              <button 
                className="btn btn-outline" 
                style={{ padding: "0.75rem 1.4rem", fontSize: "0.925rem", borderRadius: "14px" }}
                onClick={() => setActiveTab("diabetes")}
              >
                <Droplets size={18} color="#f59e0b" /> Diabetes Risk
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: "0.75rem 1.4rem", fontSize: "0.925rem", borderRadius: "14px" }}
                onClick={() => setActiveTab("kidney")}
              >
                <Activity size={18} color="#06b6d4" /> Kidney Health
              </button>
            </div>

            {/* Live animated SVG ECG Waveform line */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Telemetry</span>
              <svg width="240" height="32" viewBox="0 0 240 32" style={{ overflow: "visible" }}>
                <path 
                  d="M0,16 L40,16 L48,16 L54,4 L60,28 L66,10 L72,18 L78,16 L120,16 L128,16 L134,4 L140,28 L146,10 L152,18 L158,16 L240,16" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="ecg-line-path"
                />
              </svg>
              <span style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>Active Pulse</span>
            </div>
          </div>

          {/* Right Column: Hero Doctor Graphic with Floating Glass Telemetry Widgets */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div className="organ-preview-box" style={{ width: "100%", maxWidth: "380px", aspectRatio: "4/3", borderRadius: "24px" }}>
              <img 
                src="/hero_doctor.jpg" 
                alt="AI Health Care Specialist" 
                className="organ-image"
                style={{ objectPosition: "center 20%" }}
              />

              {/* Floating Glassmorphism Badge 1: Top Left */}
              <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 2 }}>
                <div className="telemetry-pill">
                  <span className="pulse-indicator"></span>
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>HEART RATE</div>
                    <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.85rem" }}>74 BPM</div>
                  </div>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 2: Bottom Right */}
              <div style={{ position: "absolute", bottom: "12px", right: "12px", zIndex: 2 }}>
                <div className="telemetry-pill" style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}>
                  <Shield size={16} color="#34d399" />
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>CLINICAL ACCURACY</div>
                    <div style={{ fontWeight: 800, color: "#34d399", fontSize: "0.85rem" }}>99.3% Conf.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Interactive 3D Showcase (matching user reference center screen) */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc" }}>
              Interactive 3D Physiological Telemetry
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
              Select an organ to inspect real-time clinical parameters and baseline diagnostics.
            </p>
          </div>

          {/* Organ Switcher Tabs */}
          <div style={{
            display: "inline-flex",
            background: "rgba(15, 23, 42, 0.8)",
            padding: "0.3rem",
            borderRadius: "14px",
            border: "1px solid rgba(148, 163, 184, 0.15)"
          }}>
            <button
              onClick={() => setActiveOrgan("heart")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: activeOrgan === "heart" ? "rgba(244, 63, 94, 0.2)" : "transparent",
                color: activeOrgan === "heart" ? "#fb7185" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Heart size={16} /> Cardiovascular
            </button>
            <button
              onClick={() => setActiveOrgan("kidney")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: activeOrgan === "kidney" ? "rgba(6, 182, 212, 0.2)" : "transparent",
                color: activeOrgan === "kidney" ? "#38bdf8" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Activity size={16} /> Renal (Kidneys)
            </button>
            <button
              onClick={() => setActiveOrgan("diabetes")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: activeOrgan === "diabetes" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                color: activeOrgan === "diabetes" ? "#fbbf24" : "#94a3b8",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <Droplets size={16} /> Glucose / Metabolic
            </button>
          </div>
        </div>

        {/* 3D Showcase Card */}
        <div className="glass-card" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: "2rem",
          alignItems: "center",
          border: `1px solid ${currentOrgan.color}40`,
          borderRadius: "24px",
          background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(24, 34, 58, 0.75) 100%)",
          boxShadow: `0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${currentOrgan.color}15`
        }}>
          {/* 3D Organ Render Frame */}
          <div className="organ-preview-box" style={{ aspectRatio: "1/1", width: "100%", maxHeight: "360px", margin: "0 auto" }}>
            <img 
              src={currentOrgan.image} 
              alt={currentOrgan.title} 
              className="organ-image" 
            />
            <div style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              right: "16px",
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(12px)",
              padding: "0.6rem 1rem",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>{currentOrgan.title}</span>
              <span style={{ fontSize: "0.75rem", color: currentOrgan.color, fontWeight: 700 }}>Active Analysis</span>
            </div>
          </div>

          {/* Telemetry Stats & Launch Screening */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: currentOrgan.color, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              <Zap size={15} /> Real-Time Biomarker Telemetry
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
              {currentOrgan.title}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
              {currentOrgan.subtitle}
            </p>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid-2" style={{ gap: "1rem", marginBottom: "1.75rem" }}>
              {currentOrgan.metrics.map((m, idx) => (
                <div key={idx} style={{
                  background: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  padding: "0.9rem",
                  borderRadius: "14px",
                  transition: "border-color 0.2s"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.25rem" }}>{m.label}</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>{m.value}</div>
                  <div style={{ fontSize: "0.7rem", color: currentOrgan.color, marginTop: "0.2rem" }}>{m.sub}</div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "0.85rem", borderRadius: "14px", fontSize: "0.95rem" }}
              onClick={() => setActiveTab(currentOrgan.route)}
            >
              Analyze {currentOrgan.title} Risk <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Target Screening Modules Cards */}
      <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "1.25rem", color: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
        Target Disease Screening Modules
      </h3>

      <div className="grid-3" style={{ marginBottom: "3rem" }}>
        
        {/* Diabetes Module Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "20px" }}>
          <div>
            <div className="organ-preview-box" style={{ height: "180px", marginBottom: "1.25rem" }}>
              <img src="/diabetes_3d.jpg" alt="Diabetes 3D" className="organ-image" />
              <span className="badge badge-moderate" style={{ position: "absolute", top: "10px", right: "10px" }}>
                99.3% Acc
              </span>
            </div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Diabetes Mellitus
            </h4>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "1rem" }}>
              Evaluates plasma glucose, fasting insulin, BMI, blood pressure, and maternal pedigree factors.
            </p>
            <div style={{ fontSize: "0.775rem", color: "#64748b", marginBottom: "1.25rem" }}>
              <strong>5,000 Patient Cohort</strong> • Tuned Balanced Classifier
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setActiveTab("diabetes")}>
            Launch Diabetes Screening <ArrowRight size={15} />
          </button>
        </div>

        {/* Heart Disease Module Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "20px" }}>
          <div>
            <div className="organ-preview-box" style={{ height: "180px", marginBottom: "1.25rem" }}>
              <img src="/heart_3d.jpg" alt="Heart 3D" className="organ-image" />
              <span className="badge badge-high" style={{ position: "absolute", top: "10px", right: "10px" }}>
                99.0% Acc
              </span>
            </div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Heart Disease
            </h4>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "1rem" }}>
              Analyzes coronary ischemia risk, ST depression, resting ECG, chest pain, and vessel fluoroscopy.
            </p>
            <div style={{ fontSize: "0.775rem", color: "#64748b", marginBottom: "1.25rem" }}>
              <strong>5,000 Patient Cohort</strong> • 99.78% Clinical Recall
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setActiveTab("heart")}>
            Launch Heart Screening <ArrowRight size={15} />
          </button>
        </div>

        {/* Kidney Disease Module Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "20px" }}>
          <div>
            <div className="organ-preview-box" style={{ height: "180px", marginBottom: "1.25rem" }}>
              <img src="/kidney_3d.jpg" alt="Kidney 3D" className="organ-image" />
              <span className="badge badge-low" style={{ position: "absolute", top: "10px", right: "10px" }}>
                99.0% Acc
              </span>
            </div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.5rem" }}>
              Chronic Kidney Disease
            </h4>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "1rem" }}>
              Screens nephrotic indicators, serum creatinine, urea, albuminuria, specific gravity, and electrolytes.
            </p>
            <div style={{ fontSize: "0.775rem", color: "#64748b", marginBottom: "1.25rem" }}>
              <strong>5,000 Patient Cohort</strong> • Gradient Boosting
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setActiveTab("kidney")}>
            Launch Kidney Screening <ArrowRight size={15} />
          </button>
        </div>

      </div>

      {/* Patient Assessment History */}
      {isAuthenticated && history.length > 0 && (
        <div className="glass-card" style={{ marginBottom: "2.5rem", borderRadius: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <History size={20} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc" }}>
                Recent Patient Screening History
              </h4>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }} onClick={() => setActiveTab("history")}>
              View All History <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Disease Condition</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Predicted Probability</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}>Stratified Tier</th>
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
