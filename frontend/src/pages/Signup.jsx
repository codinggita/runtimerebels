import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password, fullName);
      // Automatically log in after successful signup
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "var(--bmw-canvas)",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box"
    }}>
      <Navbar />
      <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div className="bmw-card" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="bmw-label-uppercase" style={{ textAlign: "center", marginBottom: "24px" }}>
            Initialize Autopilot
          </h2>
          {error && <div style={{ color: "var(--bmw-error)", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="bmw-label-uppercase" style={{ fontSize: "12px", color: "var(--bmw-muted)" }}>Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  backgroundColor: "var(--bmw-surface-strong)", 
                  border: "1px solid var(--bmw-hairline)",
                  color: "var(--bmw-ink)"
                }} 
              />
            </div>
            <div>
              <label className="bmw-label-uppercase" style={{ fontSize: "12px", color: "var(--bmw-muted)" }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  backgroundColor: "var(--bmw-surface-strong)", 
                  border: "1px solid var(--bmw-hairline)",
                  color: "var(--bmw-ink)"
                }} 
              />
            </div>
            <div>
              <label className="bmw-label-uppercase" style={{ fontSize: "12px", color: "var(--bmw-muted)" }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  backgroundColor: "var(--bmw-surface-strong)", 
                  border: "1px solid var(--bmw-hairline)",
                  color: "var(--bmw-ink)"
                }} 
              />
            </div>
            <button type="submit" className="bmw-btn-primary" style={{ marginTop: "8px" }}>
              Sign Up
            </button>
          </form>
          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--bmw-muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--bmw-blue)" }}>Log in</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
