import React from "react";

export function RiskGauge({ probability = 0, category = "Low" }) {
  const percentage = Math.round(probability * 100);
  
  // Angle from -90 to +90 degrees for a 180-degree semi-circle gauge
  const angle = -90 + (percentage / 100) * 180;
  
  // Needle coordinates on semi-circle of radius 80
  const rad = (angle * Math.PI) / 180;
  const cx = 100;
  const cy = 100;
  const r = 68;
  const nx = cx + r * Math.sin(rad + Math.PI / 2);
  const ny = cy - r * Math.cos(rad + Math.PI / 2);

  let badgeClass = "badge-low";
  let gaugeColor = "#10b981";
  if (category === "Moderate" || (percentage >= 35 && percentage < 65)) {
    badgeClass = "badge-moderate";
    gaugeColor = "#f59e0b";
  } else if (category === "High" || percentage >= 65) {
    badgeClass = "badge-high";
    gaugeColor = "#f43f5e";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <svg width="220" height="130" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Background Arc */}
        <path
          d="M 25 100 A 75 75 0 0 1 175 100"
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Foreground Colored Arc */}
        <path
          d="M 25 100 A 75 75 0 0 1 175 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="235.6"
          strokeDashoffset={235.6 - (235.6 * (percentage / 100))}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />

        {/* Needle Line */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={gaugeColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />

        {/* Center Pivot Point */}
        <circle cx={cx} cy={cy} r="6" fill={gaugeColor} />
        <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" />
      </svg>

      <div style={{ textAlign: "center", marginTop: "-0.5rem" }}>
        <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.03em" }}>
          {percentage}%
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          Calculated Disease Risk Probability
        </div>
        <div>
          <span className={`badge ${badgeClass}`} style={{ fontSize: "0.85rem", padding: "0.35rem 0.9rem" }}>
            {category.toUpperCase()} RISK
          </span>
        </div>
      </div>
    </div>
  );
}
