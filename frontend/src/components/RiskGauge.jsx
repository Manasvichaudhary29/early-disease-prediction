import React from "react";

export function RiskGauge({ probability = 0, category = "Low" }) {
  const clampedProb = Math.max(0, Math.min(1, probability));
  const percentage = Math.round(clampedProb * 100);

  // Center and radius
  const cx = 100;
  const cy = 100;
  const r = 68;

  // Rotation in degrees: 0% = 0 deg (pointing left to 9 o'clock), 100% = 180 deg (pointing right to 3 o'clock)
  const rotationDeg = (percentage / 100) * 180;

  let badgeClass = "badge-low";
  let gaugeColor = "#10b981";
  let labelColor = "#34d399";
  if (category === "Moderate" || (percentage >= 35 && percentage < 65)) {
    badgeClass = "badge-moderate";
    gaugeColor = "#f59e0b";
    labelColor = "#fbbf24";
  } else if (category === "High" || percentage >= 65) {
    badgeClass = "badge-high";
    gaugeColor = "#f43f5e";
    labelColor = "#fb7185";
  }

  // Ticks at 0%, 25%, 50%, 75%, 100%
  const ticks = [0, 25, 50, 75, 100].map(pct => {
    const angleRad = Math.PI * (1 - pct / 100);
    const rInner = 84;
    const rOuter = 90;
    return {
      pct,
      x1: cx + rInner * Math.cos(angleRad),
      y1: cy - rInner * Math.sin(angleRad),
      x2: cx + rOuter * Math.cos(angleRad),
      y2: cy - rOuter * Math.sin(angleRad)
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <svg width="240" height="135" viewBox="0 0 200 120" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Guide Ticks */}
        {ticks.map(t => (
          <line
            key={t.pct}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(148, 163, 184, 0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Background Inactive Arc */}
        <path
          d="M 25 100 A 75 75 0 0 1 175 100"
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Foreground Colored Active Arc */}
        <path
          d="M 25 100 A 75 75 0 0 1 175 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="235.6"
          strokeDashoffset={235.6 - (235.6 * (percentage / 100))}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />

        {/* Rotating Needle Group: starts pointing Left (0%) and rotates clockwise to Right (100%) */}
        <g
          style={{
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: "100px 100px",
            transition: "transform 0.9s cubic-bezier(0.34, 1.3, 0.64, 1)"
          }}
        >
          {/* Needle Shaft */}
          <line
            x1={cx}
            y1={cy}
            x2={cx - r}
            y2={cy}
            stroke={gaugeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
          />
          {/* Needle Center Pivot */}
          <circle cx={cx} cy={cy} r="6.5" fill={gaugeColor} />
          <circle cx={cx} cy={cy} r="2.5" fill="#ffffff" />
        </g>

        {/* Arc Labels */}
        <text x="20" y="116" fill="#94a3b8" fontSize="8" fontWeight="600">0%</text>
        <text x="94" y="18" fill="#94a3b8" fontSize="8" fontWeight="600">50%</text>
        <text x="170" y="116" fill="#94a3b8" fontSize="8" fontWeight="600">100%</text>
      </svg>

      <div style={{ textAlign: "center", marginTop: "0.25rem" }}>
        <div style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          transition: "color 0.4s ease"
        }}>
          {percentage}%
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
          Calculated Disease Risk Probability
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <span className={`badge ${badgeClass}`} style={{ fontSize: "0.85rem", padding: "0.35rem 0.9rem" }}>
            {category.toUpperCase()} RISK
          </span>
          <span style={{ fontSize: "0.75rem", color: labelColor, fontWeight: 600 }}>
            {percentage < 35 ? "• Optimal Biomarkers" : percentage < 65 ? "• Clinical Follow-up Advised" : "• Elevated Risk Alert"}
          </span>
        </div>
      </div>
    </div>
  );
}
