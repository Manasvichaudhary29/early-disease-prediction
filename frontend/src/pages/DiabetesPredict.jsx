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

  const loadPreset = (type) => {
    if (type === "healthy") {
      setFormData({
        Pregnancies: 1,
        Glucose: 92.0,
        BloodPressure: 70.0,
        SkinThickness: 18.0,
        Insulin: 65.0,
        BMI: 22.4,
        DiabetesPedigreeFunction: 0.21,
        Age: 26
      });
    } else if (type === "borderline") {
      setFormData({
        Pregnancies: 3,
        Glucose: 138.0,
        BloodPressure: 82.0,
        SkinThickness: 28.0,
        Insulin: 130.0,
        BMI: 31.8,
        DiabetesPedigreeFunction: 0.52,
        Age: 44
      });
    } else if (type === "high") {
      setFormData({
        Pregnancies: 6,
        Glucose: 178.0,
        BloodPressure: 90.0,
        SkinThickness: 35.0,
        Insulin: 210.0,
        BMI: 38.5,
        DiabetesPedigreeFunction: 1.15,
        Age: 52
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("Please sign in or register to submit predictions and log assessment records.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.predictDiabetes(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || "Prediction request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Droplets size={24} color="#f59e0b" />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc" }}>
              Diabetes Mellitus Risk Screening
            </h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Pima Indians Diabetes Pipeline • Median Imputation + Feature Standardization + SHAP XAI
          </p>
        </div>

        {/* Demo Presets for College Presentation */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Demo Presets:</span>
          <button className="btn btn-secondary" style={{ fontSize: "0.775rem", padding: "0.35rem 0.7rem" }} onClick={() => loadPreset("healthy")}>
            Normal
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "0.775rem", padding: "0.35rem 0.7rem" }} onClick={() => loadPreset("borderline")}>
            Borderline
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "0.775rem", padding: "0.35rem 0.7rem" }} onClick={() => loadPreset("high")}>
            Elevated Risk
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
        <div className="glass-card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#f8fafc" }}>
            Patient Clinical Biomarkers
          </h3>

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
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(30, 41, 59, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem"
              }}>
                <Sparkles size={28} color="var(--accent-cyan)" />
              </div>
              <h4 style={{ color: "#f8fafc", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                Ready to Analyze
              </h4>
              <p style={{ fontSize: "0.875rem", maxWidth: "340px", margin: "0 auto" }}>
                Enter clinical variables or select a demo preset above, then click compute to generate risk estimates with full SHAP local feature attributions.
              </p>
            </div>
          )}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
