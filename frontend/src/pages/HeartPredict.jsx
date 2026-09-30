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

  const loadPreset = (type) => {
    if (type === "healthy") {
      setFormData({
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
      });
    } else if (type === "moderate") {
      setFormData({
        age: 54,
        sex: 1,
        cp: 1,
        trestbps: 134.0,
        chol: 242.0,
        fbs: 0,
        restecg: 1,
        thalach: 150.0,
        exang: 0,
        oldpeak: 1.2,
        slope: 1,
        ca: 1,
        thal: 2
      });
    } else if (type === "high") {
      setFormData({
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
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("Please sign in or register to submit predictions and record assessments.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.predictHeart(formData);
      setResult(res);
    } catch (err) {
      setError(err.message || "Heart prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Heart size={24} color="#f43f5e" />
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc" }}>
              Cardiovascular & Heart Disease Risk Screening
            </h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            UCI Cleveland Heart Disease Pipeline • Categorical Encoding + Standardized Scalers + SHAP XAI
          </p>
        </div>

        {/* Demo Presets */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Demo Presets:</span>
          <button className="btn btn-secondary" style={{ fontSize: "0.775rem", padding: "0.35rem 0.7rem" }} onClick={() => loadPreset("healthy")}>
            Normal
          </button>
          <button className="btn btn-secondary" style={{ fontSize: "0.775rem", padding: "0.35rem 0.7rem" }} onClick={() => loadPreset("moderate")}>
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
                <Sparkles size={28} color="#f43f5e" />
              </div>
              <h4 style={{ color: "#f8fafc", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                Ready to Analyze
              </h4>
              <p style={{ fontSize: "0.875rem", maxWidth: "340px", margin: "0 auto" }}>
                Fill out the cardiovascular parameters above or choose a preset to evaluate risk with clinical feature attributions.
              </p>
            </div>
          )}
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
