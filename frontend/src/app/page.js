"use client";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Script from "next/script";

export default function DemoPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      function getCookie(name) {
        const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : null;
      }
      const id = getCookie("cf_session_id") || localStorage.getItem("cf_session_id") || "—";
      const el = document.getElementById("session-display");
      if (el) el.textContent = id;
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    { emoji: "📊", title: "Session Tracking", desc: "Every visit gets a unique session ID stored in a cookie." },
    { emoji: "🖱️", title: "Click Capture", desc: "X/Y coordinates of every click are recorded in real time." },
    { emoji: "🗺️", title: "Heatmap Ready", desc: "Click data is normalized and sent to power the heatmap view." },
    { emoji: "⚡", title: "Batch Flushing", desc: "Events are queued and sent in batches for efficiency." },
    { emoji: "🔄", title: "SPA Support", desc: "Call window.CausalFunnel.trackPageView() on route change." },
    { emoji: "🛡️", title: "Beacon API", desc: "Events are sent on page unload using navigator.sendBeacon." },
  ];

  return (
    <>
      <Script src="/tracker.js" strategy="afterInteractive" />
      <Navbar />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .demo-card { transition: border-color 0.2s, transform 0.2s; }
        .demo-card:hover { border-color: var(--accent) !important; transform: translateY(-2px); }
      `}</style>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--accent-dim)", border: "1px solid var(--accent-glow)",
            borderRadius: "999px", padding: "6px 16px", marginBottom: "1.5rem",
            fontSize: 12, color: "var(--accent)", fontWeight: 600,
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            <span style={{
              width: 6, height: 6, background: "var(--accent)",
              borderRadius: "50%", animation: "pulse 1.5s infinite",
              display: "inline-block",
            }} />
            Tracking Active
          </div>

          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
            letterSpacing: "-0.04em", lineHeight: 1.1,
            background: "linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: "1.25rem",
          }}>
            Every click tells<br />a story
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: 17, maxWidth: 480, margin: "0 auto 2rem" }}>
            This demo page is being tracked in real time. Click anywhere, explore the cards below, then check your{" "}
            <a href="/dashboard" style={{ color: "var(--accent)", borderBottom: "1px solid var(--accent-glow)" }}>
              analytics dashboard
            </a>.
          </p>

          <a href="/dashboard" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            color: "#fff", padding: "12px 28px",
            borderRadius: "var(--radius)", fontWeight: 600, fontSize: 14,
            letterSpacing: "-0.01em", boxShadow: "0 0 24px var(--accent-glow)",
          }}>
            View Dashboard →
          </a>
        </div>

        {/* Cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem", marginBottom: "4rem",
        }}>
          {cards.map((card) => (
            <div key={card.title} className="demo-card" style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "1.5rem", cursor: "pointer",
            }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{card.emoji}</div>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>{card.title}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Session ID */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1.25rem 1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Your Session ID
            </div>
            <div id="session-display" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)" }}>
              Loading…
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Events are batched and sent every 2s</div>
        </div>
      </main>
    </>
  );
}