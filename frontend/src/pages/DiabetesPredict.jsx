import React, { useState } from "react";
import { Droplets, Sparkles, Send, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { RiskGauge } from "../components/RiskGauge";
import { ShapWaterfallChart } from "../components/ShapWaterfallChart";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export function DiabetesPredict({ setActiveTab }) {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    Pregnancies: 2,
    Glucose: 135.0,
    BloodPressure: 78.0,
    SkinThickness: 24.0,
    Insulin: 110.0,
    BMI: 31.2,
    DiabetesPedigreeFunction: 0.45,
    Age: 40
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const runPrediction = async (dataToSubmit) => {
    setError(null);
    if (!isAuthenticated) {
      setError("Please sign in or register to submit predictions and log assessment records.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.predictDiabetes(dataToSubmit);
      setResult(res);
    } catch (err) {
      setError(err.message || "Prediction request failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type) => {
    let presetData = null;
    if (type === "healthy") {
      presetData = {
        Pregnancies: 1,
        Glucose: 92.0,
        BloodPressure: 70.0,
        SkinThickness: 18.0,
        Insulin: 65.0,
        BMI: 22.4,
        DiabetesPedigreeFunction: 0.21,
        Age: 26
      };
    } else if (type === "borderline") {
      presetData = {
        Pregnancies: 3,
        Glucose: 130.0,
        BloodPressure: 80.0,
        SkinThickness: 26.0,
        Insulin: 120.0,
        BMI: 29.8,
        DiabetesPedigreeFunction: 0.45,
        Age: 42
      };
    } else if (type === "high") {
      presetData = {
        Pregnancies: 6,
        Glucose: 178.0,
        BloodPressure: 90.0,
        SkinThickness: 35.0,
        Insulin: 210.0,
        BMI: 38.5,
        DiabetesPedigreeFunction: 1.15,
        Age: 52
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
      {/* Header with 3D Thumbnail & Presets */}
      <div className="glass-card" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.75rem",
        flexWrap: "wrap",
        gap: "1.25rem",
        borderRadius: "20px",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(35, 25, 15, 0.7) 100%)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div className="organ-preview-box" style={{ width: "70px", height: "70px", borderRadius: "16px", flexShrink: 0 }}>
            <img src="/diabetes_3d.jpg" alt="Diabetes 3D" className="organ-image" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className="pulse-indicator"></span>
              <span className="badge badge-moderate">99.3% Model Accuracy</span>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
              Diabetes Mellitus Risk Screening
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              5,000 Patient Clinical Cohort • Fasting Plasma Glucose, Insulin Resistance & SHAP XAI
            </p>
          </div>
        </div>

        {/* Demo Presets Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Quick Presets:</span>
          <button className="preset-button" onClick={() => loadPreset("healthy")}>
            🌱 Healthy (92 mg/dL)
          </button>
          <button className="preset-button" onClick={() => loadPreset("borderline")}>
            ⚠️ Borderline (138 mg/dL)
          </button>
          <button className="preset-button" onClick={() => loadPreset("high")} style={{ borderColor: "rgba(244, 63, 94, 0.4)", color: "#fb7185" }}>
            🚨 High Risk (178 mg/dL)
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
            <strong>Session Notice:</strong> You are currently exploring in guest mode. Log in or create an account to record your health history.
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
        {/* Input Form Card */}
        <div className="glass-card" style={{ borderRadius: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
              Patient Clinical Biomarkers
            </h3>
            <span style={{ fontSize: "0.75rem", color: "#38bdf8", background: "rgba(6, 182, 212, 0.1)", padding: "0.2rem 0.6rem", borderRadius: "9999px" }}>
              8 Clinical Parameters
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Glucose Level (mg/dL)</label>
                <input
                  type="number"
                  name="Glucose"
                  className="form-input"
                  min="40"
                  max="300"
                  step="0.1"
                  value={formData.Glucose}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">Fasting plasma tolerance (40 - 300)</div>
              </div>

              <div className="form-group">
                <label className="form-label">Body Mass Index (BMI)</label>
                <input
                  type="number"
                  name="BMI"
                  className="form-input"
                  min="10"
                  max="70"
                  step="0.1"
                  value={formData.BMI}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">kg/m² (18.5 - 24.9 normal)</div>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Pressure (mm Hg)</label>
                <input
                  type="number"
                  name="BloodPressure"
                  className="form-input"
                  min="30"
                  max="180"
                  step="1"
                  value={formData.BloodPressure}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">Diastolic resting (mm Hg)</div>
              </div>

              <div className="form-group">
                <label className="form-label">Patient Age (Years)</label>
                <input
                  type="number"
                  name="Age"
                  className="form-input"
                  min="18"
                  max="110"
                  step="1"
                  value={formData.Age}
                  onChange={handleChange}
                  required
                />
                <div className="form-hint">Adults (&gt;= 18 years)</div>
              </div>

              <div className="form-group">
                <label className="form-label">2-Hr Serum Insulin (μU/ml)</label>
                <input
                  type="number"
                  name="Insulin"
                  className="form-input"
                  min="0"
                  max="850"
                  step="1"
                  value={formData.Insulin}
                  onChange={handleChange}
                />
                <div className="form-hint">Serum concentration</div>
              </div>

              <div className="form-group">
                <label className="form-label">Skinfold Thickness (mm)</label>
                <input
                  type="number"
                  name="SkinThickness"
                  className="form-input"
                  min="0"
                  max="100"
                  step="0.5"
                  value={formData.SkinThickness}
                  onChange={handleChange}
                />
                <div className="form-hint">Triceps skin fold</div>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Pregnancies</label>
                <input
                  type="number"
                  name="Pregnancies"
                  className="form-input"
                  min="0"
                  max="20"
                  step="1"
                  value={formData.Pregnancies}
                  onChange={handleChange}
                />
                <div className="form-hint">0 if not applicable</div>
              </div>

              <div className="form-group">
                <label className="form-label">Pedigree Genetic Function</label>
                <input
                  type="number"
                  name="DiabetesPedigreeFunction"
                  className="form-input"
                  min="0.05"
                  max="2.5"
                  step="0.01"
                  value={formData.DiabetesPedigreeFunction}
                  onChange={handleChange}
                />
                <div className="form-hint">Family history score (0.05 - 2.5)</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} /> Calculating Probability & SHAP Attribution...
                </>
              ) : (
                <>
                  <Send size={18} /> Compute Diabetes Risk Profile
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
                <img src="/diabetes_3d.jpg" alt="Metabolic Telemetry" className="organ-image" />
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
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>CURRENT GLUCOSE:</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: formData.Glucose >= 126 ? "#fb7185" : formData.Glucose >= 100 ? "#fbbf24" : "#34d399" }}>
                    {formData.Glucose} mg/dL
                  </span>
                </div>
              </div>

              <h4 style={{ color: "#f8fafc", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
                Live Physiological Preview
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", maxWidth: "360px", margin: "0 auto 1.25rem", lineHeight: 1.5 }}>
                Current input: <strong>{formData.Glucose >= 126 ? "Elevated Glucose" : formData.Glucose >= 100 ? "Impaired Fasting" : "Optimal Fasting"}</strong> • BMI <strong>{formData.BMI} ({formData.BMI >= 30 ? "Obese" : formData.BMI >= 25 ? "Overweight" : "Normal"})</strong>. Click below to compute SHAP attributions.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Insulin: {formData.Insulin} μU/ml
                </span>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  BP: {formData.BloodPressure} mmHg
                </span>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Age: {formData.Age} yrs
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
