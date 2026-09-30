import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { DiabetesPredict } from "./pages/DiabetesPredict";
import { HeartPredict } from "./pages/HeartPredict";
import { KidneyPredict } from "./pages/KidneyPredict";
import { PredictionHistory } from "./pages/PredictionHistory";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ModelMetrics } from "./pages/ModelMetrics";
import "./index.css";

function AppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "diabetes":
        return <DiabetesPredict setActiveTab={setActiveTab} />;
      case "heart":
        return <HeartPredict setActiveTab={setActiveTab} />;
      case "kidney":
        return <KidneyPredict setActiveTab={setActiveTab} />;
      case "history":
        return <PredictionHistory setActiveTab={setActiveTab} />;
      case "models":
        return <ModelMetrics />;
      case "login":
        return <Login setActiveTab={setActiveTab} />;
      case "register":
        return <Register setActiveTab={setActiveTab} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer style={{
        borderTop: "1px solid var(--border-color)",
        padding: "1.25rem 1.5rem",
        textAlign: "center",
        fontSize: "0.8rem",
        color: "var(--text-muted)"
      }}>
        PulsePredict AI &nbsp;·&nbsp; Explainable ML-Based Early Disease Risk Prediction &nbsp;·&nbsp;
        <span style={{ color: "var(--accent-rose)" }}>⚠ For educational use only — not a medical device</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
