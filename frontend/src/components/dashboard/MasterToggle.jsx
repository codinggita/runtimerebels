import React from "react";
import { AlertTriangle, Power } from "lucide-react";

export default function MasterToggle({ isMasterOn, onToggle }) {
  return (
    <div
      className="bmw-card-dark"
      style={{
        borderLeft: isMasterOn
          ? "4px solid var(--bmw-success)"
          : "4px solid var(--bmw-error)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 32px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          style={{
            background: isMasterOn
              ? "rgba(34, 197, 94, 0.15)"
              : "rgba(220, 38, 38, 0.15)",
            color: isMasterOn ? "var(--bmw-success)" : "var(--bmw-error)",
            padding: "16px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Power size={28} />
        </div>
        <div>
          <h2
            className="bmw-label-uppercase"
            style={{
              fontSize: "16px",
              color: "var(--bmw-on-dark)",
              margin: 0,
              letterSpacing: "2px",
            }}
          >
            MASTER AUTOPILOT CONTROL
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--bmw-on-dark-soft)",
              margin: "4px 0 0 0",
              fontWeight: "300",
            }}
          >
            {isMasterOn
              ? "Autopilot clone is active. Monitoring incoming channels and replying."
              : "System paused. Autopilot is silent and will not auto-reply on any platform."}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {!isMasterOn && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--bmw-warning)",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            <AlertTriangle size={14} />
            Kill Switch Active
          </div>
        )}
        <button
          onClick={onToggle}
          style={{
            backgroundColor: isMasterOn ? "var(--bmw-success)" : "var(--bmw-error)",
            color: "var(--bmw-on-dark)",
            border: "none",
            borderRadius: "0",
            padding: "14px 28px",
            fontWeight: "700",
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: isMasterOn
              ? "0 4px 14px rgba(34, 197, 94, 0.3)"
              : "0 4px 14px rgba(220, 38, 38, 0.3)",
          }}
        >
          {isMasterOn ? "PAUSE CLONE" : "RESUME CLONE"}
        </button>
      </div>
    </div>
  );
}
