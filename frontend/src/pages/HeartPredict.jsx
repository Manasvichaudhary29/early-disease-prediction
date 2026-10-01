import React, { useState } from "react";
import { Heart, Sparkles, Send, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { RiskGauge } from "../components/RiskGauge";
import { ShapWaterfallChart } from "../components/ShapWaterfallChart";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export function HeartPredict({ setActiveTab }) {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    age: 56,
    sex: 1,
    cp: 1,
    trestbps: 130.0,
    chol: 236.0,
    fbs: 0,
    restecg: 1,
    thalach: 160.0,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const runPrediction = async (dataToSubmit) => {
    setError(null);
    if (!isAuthenticated) {
      setError("Please sign in or register to submit predictions and record assessments.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.predictHeart(dataToSubmit);
      setResult(res);
    } catch (err) {
      setError(err.message || "Heart prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type) => {
    let presetData = null;
    if (type === "healthy") {
      presetData = {
        age: 38,
        sex: 0,
        cp: 2,
        trestbps: 115.0,
        chol: 185.0,
        fbs: 0,
        restecg: 0,
        thalach: 172.0,
        exang: 0,
        oldpeak: 0.2,
        slope: 0,
        ca: 0,
        thal: 1
      };
    } else if (type === "moderate") {
      presetData = {
        age: 54,
        sex: 1,
        cp: 1,
        trestbps: 134.0,
        chol: 238.0,
        fbs: 0,
        restecg: 1,
        thalach: 152.0,
        exang: 0,
        oldpeak: 1.0,
        slope: 1,
        ca: 0,
        thal: 2
      };
    } else if (type === "high") {
      presetData = {
        age: 63,
        sex: 1,
        cp: 0,
        trestbps: 165.0,
        chol: 295.0,
        fbs: 1,
        restecg: 2,
        thalach: 122.0,
        exang: 1,
        oldpeak: 2.8,
        slope: 2,
        ca: 2,
        thal: 3
      };
    }

    if (presetData) {
      setFormData(presetData);
      if (isAuthenticated) {
        runPrediction(presetData);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runPrediction(formData);
  };

  return (
    <div className="animate-fade-in">
      {/* Header with 3D Heart Visual & Presets */}
      <div className="glass-card" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.75rem",
        flexWrap: "wrap",
        gap: "1.25rem",
        borderRadius: "20px",
        border: "1px solid rgba(244, 63, 94, 0.3)",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(35, 15, 25, 0.7) 100%)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div className="organ-preview-box" style={{ width: "70px", height: "70px", borderRadius: "16px", flexShrink: 0 }}>
            <img src="/heart_3d.jpg" alt="Heart 3D" className="organ-image" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className="pulse-indicator"></span>
              <span className="badge badge-high">99.0% Model Accuracy • 99.78% Recall</span>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
              Cardiovascular & Heart Disease Risk Screening
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              5,000 Patient Clinical Cohort • Coronary Ischemia, Fluoroscopy, ST Depression & SHAP XAI
            </p>
          </div>
        </div>

        {/* Demo Presets Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Quick Presets:</span>
          <button className="preset-button" onClick={() => loadPreset("healthy")}>
            🌱 Normal (115 BP)
          </button>
          <button className="preset-button" onClick={() => loadPreset("moderate")}>
            ⚠️ Borderline (134 BP)
          </button>
          <button className="preset-button" onClick={() => loadPreset("high")} style={{ borderColor: "rgba(244, 63, 94, 0.4)", color: "#fb7185" }}>
            🚨 High Risk (155 BP)
          </button>
        </div>
      </div>

      {!isAuthenticated && (
        <div style={{
          background: "rgba(6, 182, 212, 0.1)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "var(--radius-md)",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem"
        }}>
          <div style={{ fontSize: "0.875rem", color: "#e2e8f0" }}>
            <strong>Session Notice:</strong> You are currently in guest mode. Sign in to log predictions and track longitudinal trends.
          </div>
          <button className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }} onClick={() => setActiveTab("login")}>
            Sign In Now
          </button>
        </div>
      )}

      {error && (
        <div style={{
          background: "rgba(244, 63, 94, 0.12)",
          border: "1px solid rgba(244, 63, 94, 0.3)",
          borderRadius: "var(--radius-md)",
          padding: "1rem",
          color: "#fca5a5",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          <AlertCircle size={18} color="#f43f5e" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid-2">
        {/* Form Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#f8fafc" }}>
            Cardiovascular Diagnostic Indicators
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  min="20"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sex</label>
                <select name="sex" className="form-select" value={formData.sex} onChange={handleChange}>
                  <option value={1}>Male</option>
                  <option value={0}>Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Chest Pain Type</label>
                <select name="cp" className="form-select" value={formData.cp} onChange={handleChange}>
                  <option value={0}>Typical Angina</option>
                  <option value={1}>Atypical Angina</option>
                  <option value={2}>Non-Anginal Pain</option>
                  <option value={3}>Asymptomatic</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Resting Blood Pressure</label>
                <input
                  type="number"
                  name="trestbps"
                  className="form-input"
                  min="80"
                  max="220"
                  value={formData.trestbps}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">mm Hg on admission</div>
              </div>

              <div className="form-group">
                <label className="form-label">Serum Cholesterol</label>
                <input
                  type="number"
                  name="chol"
                  className="form-input"
                  min="100"
                  max="580"
                  value={formData.chol}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">mg/dL (&lt;200 desirable)</div>
              </div>

              <div className="form-group">
                <label className="form-label">Fasting Blood Sugar &gt; 120</label>
                <select name="fbs" className="form-select" value={formData.fbs} onChange={handleChange}>
                  <option value={0}>False (&le; 120 mg/dL)</option>
                  <option value={1}>True (&gt; 120 mg/dL)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Resting ECG</label>
                <select name="restecg" className="form-select" value={formData.restecg} onChange={handleChange}>
                  <option value={0}>Normal</option>
                  <option value={1}>ST-T Wave Abnormality</option>
                  <option value={2}>Left Ventricular Hypertrophy</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Max Heart Rate (thalach)</label>
                <input
                  type="number"
                  name="thalach"
                  className="form-input"
                  min="60"
                  max="220"
                  value={formData.thalach}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">Exercise peak bpm</div>
              </div>

              <div className="form-group">
                <label className="form-label">Exercise Induced Angina</label>
                <select name="exang" className="form-select" value={formData.exang} onChange={handleChange}>
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">ST Depression (oldpeak)</label>
                <input
                  type="number"
                  name="oldpeak"
                  className="form-input"
                  min="0.0"
                  max="7.0"
                  step="0.1"
                  value={formData.oldpeak}
                  onChange={handleChange}
                />
                <div className="form-hint">Exercise vs rest ST change</div>
              </div>

              <div className="form-group">
                <label className="form-label">ST Segment Slope</label>
                <select name="slope" className="form-select" value={formData.slope} onChange={handleChange}>
                  <option value={0}>Upsloping</option>
                  <option value={1}>Flat</option>
                  <option value={2}>Downsloping</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Major Fluoroscopy Vessels</label>
                <select name="ca" className="form-select" value={formData.ca} onChange={handleChange}>
                  <option value={0}>0 Vessels</option>
                  <option value={1}>1 Vessel</option>
                  <option value={2}>2 Vessels</option>
                  <option value={3}>3 Vessels</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Thalassemia Status</label>
                <select name="thal" className="form-select" value={formData.thal} onChange={handleChange}>
                  <option value={1}>Normal Blood Flow</option>
                  <option value={2}>Fixed Perfusion Defect</option>
                  <option value={3}>Reversible Defect</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} /> Analyzing Cardiovascular Markers...
                </>
              ) : (
                <>
                  <Send size={18} /> Compute Heart Disease Risk
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {result ? (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <RiskGauge probability={result.risk_probability} category={result.risk_category} />
              </div>

              <ShapWaterfallChart factors={result.top_factors} />
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
              <div className="organ-preview-box" style={{ width: "100%", maxHeight: "240px", borderRadius: "18px", margin: "0 auto 1.5rem" }}>
                <img src="/heart_3d.jpg" alt="Cardiovascular Telemetry" className="organ-image" />
                <div style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  right: "12px",
                  background: "rgba(15, 23, 42, 0.85)",
                  backdropFilter: "blur(10px)",
                  padding: "0.5rem 0.8rem",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>RESTING BP:</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: formData.trestbps >= 140 ? "#fb7185" : formData.trestbps >= 130 ? "#fbbf24" : "#34d399" }}>
                    {formData.trestbps} mmHg
                  </span>
                </div>
              </div>

              <h4 style={{ color: "#f8fafc", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
                Hemodynamic Telemetry Ready
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", maxWidth: "360px", margin: "0 auto 1.25rem", lineHeight: 1.5 }}>
                Current input: <strong>{formData.trestbps >= 140 ? "Hypertensive (Stage 2)" : formData.trestbps >= 130 ? "Stage 1 Hypertension" : "Optimal Blood Pressure"}</strong> • Chol <strong>{formData.chol} mg/dL</strong>. Click below to run the AI engine.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Max HR: {formData.thalach} bpm
                </span>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  ST Dep: {formData.oldpeak} mm
                </span>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Chest Pain: Type {formData.cp}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
