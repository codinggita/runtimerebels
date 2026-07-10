import React from "react";
import { Shield, Radio, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bmw-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* BMW inspired clean branding */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "2px solid var(--bmw-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--bmw-blue)",
              fontWeight: "800",
              fontSize: "16px",
            }}
          >
            D
          </div>
          <div>
            <span
              className="bmw-label-uppercase"
              style={{ fontSize: "14px", color: "var(--bmw-ink)" }}
            >
              DIGITAL TWIN
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "300",
                color: "var(--bmw-muted)",
                marginLeft: "6px",
              }}
            >
              | Autopilot
            </span>
          </div>
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* Autopilot Status Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Radio size={16} color="var(--bmw-success)" className="pulse" />
          <span
            className="bmw-label-uppercase"
            style={{ fontSize: "11px", color: "var(--bmw-success)" }}
          >
            Online
          </span>
        </div>

        <div
          style={{
            borderLeft: "1px solid var(--bmw-hairline)",
            height: "24px",
          }}
        />

        {token ? (
          <>
            {/* User profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "var(--bmw-surface-strong)",
                  borderRadius: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "13px",
                  color: "var(--bmw-ink)",
                }}
              >
                U
              </div>
              <span
                className="bmw-label-uppercase"
                style={{ fontSize: "12px", color: "var(--bmw-ink)" }}
              >
                {user?.email || "User"}
              </span>
            </div>
            
            <button 
              onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--bmw-muted)" }}
              className="bmw-label-uppercase hover:text-white"
            >
              <LogOut size={16} /> <span style={{ fontSize: "11px" }}>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link to="/login" className="bmw-label-uppercase" style={{ fontSize: "12px", color: "var(--bmw-ink)" }}>
              Log In
            </Link>
            <Link to="/signup" className="bmw-btn-primary" style={{ padding: "8px 16px", fontSize: "12px" }}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
