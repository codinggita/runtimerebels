import React, { useState } from "react";
import { CheckCircle, Copy, Check } from "lucide-react";

export default function ActivityFeed({ activities }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="bmw-card" style={{ marginTop: "32px" }}>
      <h2 className="bmw-label-uppercase" style={{ fontSize: "14px", marginBottom: "24px" }}>
        Live Autopilot Activity Feed
      </h2>

      {activities.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--bmw-muted)" }}>
          No recent conversational events detected. Start chatting with your channels to see updates!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {activities.map((act) => (
            <div
              key={act.id}
              style={{
                borderBottom: "1px solid var(--bmw-hairline)",
                paddingBottom: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Feed Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "2px 8px",
                      backgroundColor:
                        act.platform === "telegram"
                          ? "rgba(34, 158, 217, 0.15)"
                          : act.platform === "discord"
                          ? "rgba(88, 101, 242, 0.15)"
                          : "rgba(234, 67, 53, 0.15)",
                      color:
                        act.platform === "telegram"
                          ? "#229ED9"
                          : act.platform === "discord"
                          ? "#5865F2"
                          : "#EA4335",
                    }}
                  >
                    {act.platform}
                  </span>
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "var(--bmw-ink)" }}>
                    {act.sender}
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--bmw-muted)" }}>{act.timestamp}</span>
              </div>

              {/* Grid content comparison */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {/* User query */}
                <div style={{ backgroundColor: "var(--bmw-surface-soft)", padding: "16px" }}>
                  <span className="bmw-label-uppercase" style={{ fontSize: "11px", color: "var(--bmw-muted)", display: "block", marginBottom: "4px" }}>
                    User Query
                  </span>
                  <p className="bmw-body-md" style={{ margin: 0, color: "var(--bmw-ink)" }}>
                    "{act.query}"
                  </p>
                </div>

                {/* Clone reply */}
                <div
                  style={{
                    backgroundColor: "var(--bmw-canvas)",
                    border: "1px solid var(--bmw-hairline-strong)",
                    padding: "16px",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <span className="bmw-label-uppercase" style={{ fontSize: "11px", color: "var(--bmw-blue)" }}>
                      Autopilot Response
                    </span>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      {act.verified && (
                        <span style={{ color: "var(--bmw-success)", display: "flex", alignItems: "center", gap: "2px", fontSize: "11px", fontWeight: "700" }}>
                          <CheckCircle size={12} /> FACT CHECKED
                        </span>
                      )}
                      <button
                        onClick={() => handleCopy(act.id, act.reply)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: copiedId === act.id ? "var(--bmw-success)" : "var(--bmw-muted)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                        }}
                      >
                        {copiedId === act.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === act.id ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <p className="bmw-body-md" style={{ margin: 0, color: "var(--bmw-ink)", fontStyle: "italic" }}>
                    "{act.reply}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
