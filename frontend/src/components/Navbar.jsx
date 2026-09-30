import React from "react";
import { Activity, ShieldAlert, History, BrainCircuit, UserCheck, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Navbar({ activeTab, setActiveTab }) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header style={{
      background: "rgba(15, 23, 42, 0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0.85rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab("dashboard")}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
        >
          <div style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(6, 182, 212, 0.4)"
          }}>
            <Activity color="#ffffff" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "#f8fafc" }}>
              PulsePredict <span style={{ color: "var(--accent-cyan)", fontSize: "0.8rem", background: "rgba(6,182,212,0.15)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(6,182,212,0.3)" }}>AI</span>
            </div>
            <div style={{ fontSize: "0.725rem", color: "var(--text-muted)" }}>
              Explainable Clinical Risk Engine
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button 
            className={`btn ${activeTab === "dashboard" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button 
            className={`btn ${activeTab === "diabetes" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}
            onClick={() => setActiveTab("diabetes")}
          >
            Diabetes
          </button>

          <button 
            className={`btn ${activeTab === "heart" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}
            onClick={() => setActiveTab("heart")}
          >
            Heart Disease
          </button>

          <button 
            className={`btn ${activeTab === "kidney" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}
            onClick={() => setActiveTab("kidney")}
          >
            Kidney (CKD)
          </button>

          {isAuthenticated && (
            <button 
              className={`btn ${activeTab === "history" ? "btn-primary" : "btn-secondary"}`}
              style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}
              onClick={() => setActiveTab("history")}
            >
              <History size={16} /> History
            </button>
          )}

          <button 
            className={`btn ${activeTab === "models" ? "btn-primary" : "btn-secondary"}`}
            style={{ fontSize: "0.85rem", padding: "0.5rem 0.9rem" }}
            onClick={() => setActiveTab("models")}
          >
            <BrainCircuit size={16} /> Model Metrics
          </button>
        </nav>

        {/* User Account / Auth Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                background: "rgba(30, 41, 59, 0.6)",
                padding: "0.35rem 0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)"
              }}>
                <UserCheck size={15} color="var(--accent-emerald)" />
                <span>{user?.full_name?.split(" ")[0]}</span>
              </div>
              <button 
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem", color: "var(--text-muted)" }}
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button 
                onClick={() => setActiveTab("login")}
                className="btn btn-secondary"
                style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
              >
                <LogIn size={15} /> Login
              </button>
              <button 
                onClick={() => setActiveTab("register")}
                className="btn btn-primary"
                style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
              >
                <UserPlus size={15} /> Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
