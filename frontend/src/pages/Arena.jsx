import React, { useState, useEffect } from "react";
import { Cpu, Send, Check, AlertCircle, RefreshCw } from "lucide-react";
import { api } from "../lib/api";

export default function Arena() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Raw responses from backend API
  const [rawClone, setRawClone] = useState("");
  const [rawChatGPT, setRawChatGPT] = useState("");

  // Animated streaming responses shown in UI
  const [streamedClone, setStreamedClone] = useState("");
  const [streamedChatGPT, setStreamedChatGPT] = useState("");

  // Helper to simulate typing animation stream
  const animateText = (text, setStreamedState) => {
    let index = 0;
    setStreamedState("");
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamedState((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 12); // Fast corporate speed typing
    
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setSubmitted(true);
    setStreamedClone("");
    setStreamedChatGPT("");

    try {
      const data = await api.comparePrompt(prompt);
      setRawClone(data.clone);
      setRawChatGPT(data.chatgpt);
      
      // Start typing simulation streams
      animateText(data.clone, setStreamedClone);
      animateText(data.chatgpt, setStreamedChatGPT);
    } catch (err) {
      console.warn("API offline, using custom mockup response compare panels.");
      const demoClone = "tbh kinda cool but also weird? ngl just hope it doesn't break my server configs lol. let's check it later";
      const demoGPT = "Artificial intelligence technology represents a significant advancement in personal automation. However, it is essential to monitor connection statuses and coordinate deployments carefully to prevent configuration drift.";
      
      setRawClone(demoClone);
      setRawChatGPT(demoGPT);
      
      animateText(demoClone, setStreamedClone);
      animateText(demoGPT, setStreamedChatGPT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "2px solid var(--bmw-ink)",
          paddingBottom: "18px",
          marginBottom: "32px",
        }}
      >
        <div>
          <span className="bmw-label-uppercase" style={{ color: "var(--bmw-blue)", fontSize: "14px" }}>
            TURING MATCHUP
          </span>
          <h1 style={{ margin: "4px 0 0 0", fontSize: "32px", fontWeight: "700", color: "var(--bmw-ink)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Turing Test Arena
          </h1>
        </div>
      </div>

      <div className="bmw-card" style={{ padding: "32px" }}>
        <p className="bmw-body-md" style={{ marginBottom: "24px", color: "var(--bmw-body-strong)" }}>
          Test your Autopilot conversational clone side-by-side with standard AI models to visually inspect the difference in voice dials, temporal cues, and casing formatting.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <input
            type="text"
            className="bmw-input"
            placeholder="Type a prompt to test (e.g., 'Are you free to write code tonight?')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            style={{ flex: 1, height: "50px", fontSize: "15px" }}
          />
          <button
            type="submit"
            className="bmw-btn-primary"
            disabled={loading || !prompt.trim()}
            style={{ display: "flex", alignItems: "center", gap: "10px", height: "50px", padding: "0 32px" }}
          >
            {loading ? <RefreshCw className="spin" size={16} /> : <Send size={16} />}
            TEST TONE
          </button>
        </form>

        {/* Comparison Split Panels */}
        {submitted && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>
            
            {/* Left Panel: Autopilot Clone */}
            <div
              style={{
                border: "2px solid var(--bmw-blue)",
                padding: "24px",
                backgroundColor: "var(--bmw-canvas)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "20px",
                  backgroundColor: "var(--bmw-blue)",
                  color: "#fff",
                  padding: "2px 10px",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Your Identity Clone
              </div>
              
              <div style={{ minHeight: "150px", marginTop: "10px" }}>
                {streamedClone ? (
                  <p
                    className="bmw-body-md"
                    style={{
                      fontStyle: "italic",
                      color: "var(--bmw-ink)",
                      whiteSpace: "pre-line",
                      lineHeight: "1.6",
                    }}
                  >
                    "{streamedClone}"
                  </p>
                ) : (
                  <span style={{ color: "var(--bmw-muted)" }}>
                    {loading ? "Waiting for clone reasoning..." : "Pending input..."}
                  </span>
                )}
              </div>

              {/* Traits indicators */}
              {streamedClone === rawClone && rawClone && (
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--bmw-hairline)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "rgba(28, 105, 212, 0.1)", color: "var(--bmw-blue)", fontWeight: "700", textTransform: "uppercase" }}>
                    Tone: Casual / Dial 2
                  </span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "rgba(28, 105, 212, 0.1)", color: "var(--bmw-blue)", fontWeight: "700", textTransform: "uppercase" }}>
                    Slangs: Used (tbh, lol, ngl)
                  </span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "rgba(28, 105, 212, 0.1)", color: "var(--bmw-blue)", fontWeight: "700", textTransform: "uppercase" }}>
                    Casing: Lowercase split
                  </span>
                </div>
              )}
            </div>

            {/* Right Panel: Generic Assistant */}
            <div
              style={{
                border: "1px solid var(--bmw-hairline-strong)",
                padding: "24px",
                backgroundColor: "var(--bmw-surface-soft)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "20px",
                  backgroundColor: "var(--bmw-muted)",
                  color: "#fff",
                  padding: "2px 10px",
                  fontSize: "11px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Generic ChatGPT
              </div>

              <div style={{ minHeight: "150px", marginTop: "10px" }}>
                {streamedChatGPT ? (
                  <p
                    className="bmw-body-md"
                    style={{
                      color: "var(--bmw-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    "{streamedChatGPT}"
                  </p>
                ) : (
                  <span style={{ color: "var(--bmw-muted)" }}>
                    {loading ? "Waiting for assistant..." : "Pending input..."}
                  </span>
                )}
              </div>

              {/* Traits indicators */}
              {streamedChatGPT === rawChatGPT && rawChatGPT && (
                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "16px",
                    borderTop: "1px solid var(--bmw-hairline)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "rgba(107, 107, 107, 0.1)", color: "var(--bmw-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                    Tone: Formal / Standard
                  </span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "rgba(107, 107, 107, 0.1)", color: "var(--bmw-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                    Slangs: None
                  </span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", backgroundColor: "rgba(107, 107, 107, 0.1)", color: "var(--bmw-muted)", fontWeight: "700", textTransform: "uppercase" }}>
                    Sentence Case: Proper
                  </span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
