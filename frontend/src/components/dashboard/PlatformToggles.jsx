import React from "react";
import { MessageCircle, MessageSquare, Mail } from "lucide-react";

export default function PlatformToggles({
  activePlatforms,
  isMasterOn,
  onTogglePlatform,
}) {
  const platforms = [
    {
      id: "telegram",
      name: "Telegram Bot",
      desc: "Autoreply via webhook subscription listener",
      icon: <MessageCircle size={20} />,
      color: "#229ED9",
    },
    {
      id: "discord",
      name: "Discord Bot",
      desc: "Autoreply via gateway client socket",
      icon: <MessageSquare size={20} />,
      color: "#5865F2",
    },
    {
      id: "gmail",
      name: "Gmail Dispatcher",
      desc: "Autoreply via Google Pub/Sub updates",
      icon: <Mail size={20} />,
      color: "#EA4335",
    },
  ];

  return (
    <div className="bmw-card">
      <h2
        className="bmw-label-uppercase"
        style={{ fontSize: "14px", marginBottom: "20px", display: "block" }}
      >
        Platform Channels Configuration
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          opacity: isMasterOn ? 1 : 0.45,
          pointerEvents: isMasterOn ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      >
        {platforms.map((plat) => {
          const isEnabled = activePlatforms.includes(plat.id);
          return (
            <div
              key={plat.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--bmw-hairline)",
                paddingBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    backgroundColor: isEnabled ? plat.color : "var(--bmw-surface-strong)",
                    color: isEnabled ? "#fff" : "var(--bmw-muted)",
                    padding: "10px",
                    borderRadius: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  {plat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--bmw-ink)" }}>
                    {plat.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--bmw-muted)" }}>
                    {plat.desc}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Status pill badge */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    padding: "4px 8px",
                    backgroundColor: isEnabled ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 107, 107, 0.1)",
                    color: isEnabled ? "var(--bmw-success)" : "var(--bmw-muted)",
                    border: isEnabled
                      ? "1px solid rgba(34, 197, 94, 0.2)"
                      : "1px solid rgba(107, 107, 107, 0.2)",
                  }}
                >
                  {isEnabled ? "Online" : "Inactive"}
                </span>

                <button
                  onClick={() => onTogglePlatform(plat.id)}
                  disabled={!isMasterOn}
                  className="bmw-btn-secondary"
                  style={{
                    padding: "8px 16px",
                    fontSize: "11px",
                    letterSpacing: "1px",
                    borderColor: isEnabled ? "var(--bmw-ink)" : "var(--bmw-hairline-strong)",
                    backgroundColor: isEnabled ? "var(--bmw-surface-strong)" : "transparent",
                  }}
                >
                  {isEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
