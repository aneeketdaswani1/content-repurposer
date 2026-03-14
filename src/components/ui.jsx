import React from 'react';

export function CircularProgress({ value, size = 64, strokeWidth = 5, color = "#FBBF24", label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}>{label}</span>
      {sublabel && <span style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "-4px" }}>{sublabel}</span>}
    </div>
  );
}

export function PlatformBar({ platform, score, color, isBest }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", minWidth: "80px" }}>
        {isBest && "🏆 "}{platform}
      </span>
      <div style={{ flex: 1, height: "8px", background: "#F3F4F6", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%", background: isBest
            ? "linear-gradient(90deg, #FBBF24, #F59E0B)" : color,
          borderRadius: "4px", transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color: isBest ? "#D97706" : "#6B7280", minWidth: "32px", textAlign: "right" }}>
        {score}
      </span>
    </div>
  );
}

export function EntityTag({ text, type }) {
  const colors = {
    PERSON: { bg: "#DBEAFE", color: "#1D4ED8" },
    ORG: { bg: "#D1FAE5", color: "#059669" },
    TECH: { bg: "#FEE2E2", color: "#DC2626" },
    LOCATION: { bg: "#FEF3C7", color: "#D97706" },
    DATE: { bg: "#E0E7FF", color: "#4338CA" },
    CONCEPT: { bg: "#F3E8FF", color: "#7C3AED" },
  };
  const c = colors[type] || colors.CONCEPT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 10px",
      background: c.bg, color: c.color, borderRadius: "6px", fontSize: "11px", fontWeight: 600,
    }}>
      {text}<span style={{ opacity: 0.6, fontSize: "9px" }}>{type}</span>
    </span>
  );
}

export function KeywordPill({ word }) {
  return (
    <span style={{
      padding: "4px 12px", background: "#1a1a2e", color: "#FBBF24",
      borderRadius: "100px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px",
    }}>{word}</span>
  );
}

export function MetricCard({ icon, label, value, detail, color = "#1a1a2e" }) {
  return (
    <div style={{
      padding: "16px", background: "#FFFFFF", borderRadius: "14px",
      border: "1px solid #E5E7EB", flex: "1", minWidth: "140px",
    }}>
      <div style={{ fontSize: "18px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ fontSize: "16px", fontWeight: 700, color }}>{value}</div>
      {detail && <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px" }}>{detail}</div>}
    </div>
  );
}