import React, { useState } from "react";
import { Activity, Sparkles, Send, RefreshCw, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { RiskGauge } from "../components/RiskGauge";
import { ShapWaterfallChart } from "../components/ShapWaterfallChart";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export function KidneyPredict({ setActiveTab }) {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    age: 50,
    bp: 80.0,
    sg: 1.020,
    al: 0,
    su: 0,
    rbc: "normal",
    pc: "normal",
    pcc: "notpresent",
    ba: "notpresent",
    bgr: 110.0,
    bu: 34.0,
    sc: 1.0,
    sod: 139.0,
    pot: 4.2,
    hemo: 15.2,
    pcv: 44.0,
    wc: 7500.0,
    rc: 5.1,
    htn: "no",
    dm: "no",
    cad: "no",
    appet: "good",
    pe: "no",
    ane: "no"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot", "hemo", "pcv", "wc", "rc"];
    
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value
    }));
  };

  const runPrediction = async (dataToSubmit) => {
    setError(null);
    if (!isAuthenticated) {
      setError("Please sign in or register to record predictions in the database.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.predictKidney(dataToSubmit);
      setResult(res);
    } catch (err) {
      setError(err.message || "Kidney prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (type) => {
    let presetData = null;
    if (type === "healthy") {
      presetData = {
        age: 32,
        bp: 70.0,
        sg: 1.025,
        al: 0,
        su: 0,
        rbc: "normal",
        pc: "normal",
        pcc: "notpresent",
        ba: "notpresent",
        bgr: 95.0,
        bu: 24.0,
        sc: 0.8,
        sod: 142.0,
        pot: 4.1,
        hemo: 16.0,
        pcv: 48.0,
        wc: 6400.0,
        rc: 5.4,
        htn: "no",
        dm: "no",
        cad: "no",
        appet: "good",
        pe: "no",
        ane: "no"
      };
    } else if (type === "mild") {
      presetData = {
        age: 55,
        bp: 80.0,
        sg: 1.015,
        al: 1,
        su: 0,
        rbc: "normal",
        pc: "normal",
        pcc: "notpresent",
        ba: "notpresent",
        bgr: 125.0,
        bu: 44.0,
        sc: 1.4,
        sod: 137.0,
        pot: 4.4,
        hemo: 13.5,
        pcv: 39.0,
        wc: 8200.0,
        rc: 4.6,
        htn: "yes",
        dm: "no",
        cad: "no",
        appet: "good",
        pe: "no",
        ane: "no"
      };
    } else if (type === "severe") {
      presetData = {
        age: 64,
        bp: 90.0,
        sg: 1.010,
        al: 3,
        su: 2,
        rbc: "abnormal",
        pc: "abnormal",
        pcc: "present",
        ba: "notpresent",
        bgr: 210.0,
        bu: 92.0,
        sc: 3.6,
        sod: 130.0,
        pot: 5.2,
        hemo: 9.2,
        pcv: 28.0,
        wc: 11400.0,
        rc: 3.2,
        htn: "yes",
        dm: "yes",
        cad: "yes",
        appet: "poor",
        pe: "yes",
        ane: "yes"
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
      {/* Header with 3D Kidney Visual & Presets */}
      <div className="glass-card" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.75rem",
        flexWrap: "wrap",
        gap: "1.25rem",
        borderRadius: "20px",
        border: "1px solid rgba(6, 182, 212, 0.3)",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 30, 45, 0.7) 100%)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div className="organ-preview-box" style={{ width: "70px", height: "70px", borderRadius: "16px", flexShrink: 0 }}>
            <img src="/kidney_3d.jpg" alt="Kidney 3D" className="organ-image" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span className="pulse-indicator"></span>
              <span className="badge badge-low">99.0% Accuracy • Gradient Boosting</span>
            </div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", fontFamily: "'Outfit', sans-serif" }}>
              Chronic Kidney Disease (CKD) Risk Screening
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              5,000 Patient Clinical Cohort • Glomerular Filtration, Albuminuria, Serum Creatinine & SHAP XAI
            </p>
          </div>
        </div>

        {/* Demo Presets Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>Quick Presets:</span>
          <button className="preset-button" onClick={() => loadPreset("healthy")}>
            🌱 Normal (0.85 Cr)
          </button>
          <button className="preset-button" onClick={() => loadPreset("mild")}>
            ⚠️ Borderline (1.4 Cr)
          </button>
          <button className="preset-button" onClick={() => loadPreset("severe")} style={{ borderColor: "rgba(244, 63, 94, 0.4)", color: "#fb7185" }}>
            🚨 High Risk (3.6 Cr)
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
            <strong>Session Notice:</strong> Guest mode active. Sign in to log predictions and track longitudinal trends.
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
            Renal Diagnostic Panel (24 Biomarkers)
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Demographics & Blood Pressure */}
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              1. Hemodynamics & General
            </div>
            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Patient Age</label>
                <input type="number" name="age" className="form-input" min="1" max="110" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Pressure (mm Hg)</label>
                <input type="number" name="bp" className="form-input" min="50" max="180" value={formData.bp} onChange={handleChange} required />
              </div>
            </div>

            {/* Section 2: Urine Analysis */}
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              2. Urine Analysis
            </div>
            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Specific Gravity</label>
                <select name="sg" className="form-select" value={formData.sg} onChange={handleChange}>
                  <option value={1.005}>1.005</option>
                  <option value={1.010}>1.010</option>
                  <option value={1.015}>1.015</option>
                  <option value={1.020}>1.020</option>
                  <option value={1.025}>1.025</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Albumin (Proteinuria)</label>
                <select name="al" className="form-select" value={formData.al} onChange={handleChange}>
                  <option value={0}>0 (Nil)</option>
                  <option value={1}>1 (Trace)</option>
                  <option value={2}>2 (Moderate)</option>
                  <option value={3}>3 (Severe)</option>
                  <option value={4}>4 (Heavy)</option>
                  <option value={5}>5 (Extreme)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Sugar / Glucose in Urine</label>
                <select name="su" className="form-select" value={formData.su} onChange={handleChange}>
                  <option value={0}>0 (Nil)</option>
                  <option value={1}>1 (+)</option>
                  <option value={2}>2 (++)</option>
                  <option value={3}>3 (+++)</option>
                  <option value={4}>4 (++++)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Red Blood Cells in Urine</label>
                <select name="rbc" className="form-select" value={formData.rbc} onChange={handleChange}>
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pus Cells in Urine</label>
                <select name="pc" className="form-select" value={formData.pc} onChange={handleChange}>
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bacteria</label>
                <select name="ba" className="form-select" value={formData.ba} onChange={handleChange}>
                  <option value="notpresent">Not Present</option>
                  <option value="present">Present</option>
                </select>
              </div>
            </div>

            {/* Section 3: Blood Chemistry */}
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              3. Blood Chemistry & Filtration
            </div>
            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Serum Creatinine (mg/dL)</label>
                <input type="number" name="sc" className="form-input" min="0.4" max="25" step="0.1" value={formData.sc} onChange={handleChange} required />
                <div className="form-hint">Key glomerular filtration metric</div>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Urea (mg/dL)</label>
                <input type="number" name="bu" className="form-input" min="10" max="300" step="0.1" value={formData.bu} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Glucose Random</label>
                <input type="number" name="bgr" className="form-input" min="50" max="450" step="1" value={formData.bgr} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Hemoglobin (gms)</label>
                <input type="number" name="hemo" className="form-input" min="3" max="20" step="0.1" value={formData.hemo} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Serum Sodium (mEq/L)</label>
                <input type="number" name="sod" className="form-input" min="110" max="165" step="0.1" value={formData.sod} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Serum Potassium (mEq/L)</label>
                <input type="number" name="pot" className="form-input" min="2.5" max="8.0" step="0.1" value={formData.pot} onChange={handleChange} required />
              </div>
            </div>

            {/* Section 4: Clinical History */}
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent-cyan)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
              4. Clinical History & Symptoms
            </div>
            <div className="grid-3" style={{ marginBottom: "1.25rem" }}>
              <div className="form-group">
                <label className="form-label">Hypertension</label>
                <select name="htn" className="form-select" value={formData.htn} onChange={handleChange}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Diabetes</label>
                <select name="dm" className="form-select" value={formData.dm} onChange={handleChange}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pedal Edema</label>
                <select name="pe" className="form-select" value={formData.pe} onChange={handleChange}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} /> Analyzing Renal Panel...
                </>
              ) : (
                <>
                  <Send size={18} /> Compute Chronic Kidney Disease Risk
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
                <img src="/kidney_3d.jpg" alt="Renal Telemetry" className="organ-image" />
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
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>SERUM CREATININE:</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: formData.sc >= 1.5 ? "#fb7185" : formData.sc >= 1.2 ? "#fbbf24" : "#34d399" }}>
                    {formData.sc} mg/dL
                  </span>
                </div>
              </div>

              <h4 style={{ color: "#f8fafc", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", fontFamily: "'Outfit', sans-serif" }}>
                Renal Telemetry Ready
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", maxWidth: "360px", margin: "0 auto 1.25rem", lineHeight: 1.5 }}>
                Current input: <strong>{formData.sc >= 1.5 ? "Elevated Creatinine (CKD Suspect)" : formData.sc >= 1.2 ? "Borderline Filtration" : "Normal Creatinine Clearance"}</strong> • Albumin <strong>Grade {formData.al}</strong>. Click below to run AI prediction.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Blood Urea: {formData.bu} mg/dL
                </span>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Spec Gravity: {formData.sg}
                </span>
                <span className="telemetry-pill" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                  Hemoglobin: {formData.hemo} g/dL
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
