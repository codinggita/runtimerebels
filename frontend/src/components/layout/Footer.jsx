import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { MessageSquare, Globe, Link, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ 
      width: "100%", 
      borderTop: "1px solid var(--bmw-hairline)", 
      marginTop: "auto",
      backgroundColor: "var(--bmw-surface-soft)",
      color: "var(--bmw-ink)",
      paddingTop: "60px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "60px", marginBottom: "40px" }}>
          
          {/* Brand Section */}
          <div style={{ flex: "0 1 350px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid var(--bmw-blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--bmw-blue)",
                fontWeight: "800",
                fontSize: "18px",
              }}>
                D
              </div>
              <div>
                <span className="bmw-label-uppercase" style={{ fontSize: "16px", color: "var(--bmw-ink)", letterSpacing: "1px" }}>
                  DIGITAL TWIN
                </span>
                <span style={{ fontSize: "16px", fontWeight: "300", color: "var(--bmw-muted)", marginLeft: "6px" }}>
                  | Autopilot
                </span>
              </div>
            </div>
            <p className="bmw-body-md" style={{ color: "var(--bmw-muted)", marginBottom: "24px" }}>
              Automating your personal identity with cutting-edge AI. We create seamless, intelligent conversational clones that speak with your exact tone and voice.
            </p>
            <div style={{ display: "flex", gap: "16px", color: "var(--bmw-muted)" }}>
              <a href="#" style={{ color: "inherit", transition: "color 0.2s" }}><MessageSquare size={20} /></a>
              <a href="#" style={{ color: "inherit", transition: "color 0.2s" }}><Globe size={20} /></a>
              <a href="#" style={{ color: "inherit", transition: "color 0.2s" }}><Link size={20} /></a>
              <a href="#" style={{ color: "inherit", transition: "color 0.2s" }}><Mail size={20} /></a>
            </div>
          </div>

          {/* Links Section */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "80px" }}>
            <div>
              <h4 className="bmw-label-uppercase" style={{ color: "var(--bmw-ink)", marginBottom: "20px", fontSize: "14px" }}>Product</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><RouterLink to="/upload" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Upload Data</RouterLink></li>
                <li><RouterLink to="/arena" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Turing Arena</RouterLink></li>
                <li><RouterLink to="/approvals" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Approvals</RouterLink></li>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="bmw-label-uppercase" style={{ color: "var(--bmw-ink)", marginBottom: "20px", fontSize: "14px" }}>Resources</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Documentation</a></li>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>API Reference</a></li>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Blog</a></li>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="bmw-label-uppercase" style={{ color: "var(--bmw-ink)", marginBottom: "20px", fontSize: "14px" }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Privacy Policy</a></li>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Terms of Service</a></li>
                <li><a href="#" style={{ textDecoration: "none", color: "var(--bmw-muted)", fontSize: "15px" }}>Cookie Policy</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: "1px solid var(--bmw-hairline)", 
          padding: "24px 0", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <p className="bmw-body-sm" style={{ margin: 0, color: "var(--bmw-muted)" }}>
            © {new Date().getFullYear()} Digital Twin Autopilot. Built with corporate BMW design styling.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--bmw-success)", fontWeight: "600", textTransform: "uppercase" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", backgroundColor: "var(--bmw-success)", borderRadius: "50%" }}></span>
              All systems operational
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
