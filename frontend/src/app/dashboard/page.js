// frontend/src/app/dashboard/page.js
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SessionsView from "@/components/SessionsView";
import HeatmapView from "@/components/HeatmapView";

const TABS = ["Sessions", "Heatmap"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Sessions");

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{
            fontSize: "1.75rem", fontWeight: 800,
            letterSpacing: "-0.04em", marginBottom: "0.25rem",
          }}>
            Analytics Dashboard
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Real-time session tracking and click heatmap visualization
          </p>
        </div>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: "4px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "4px",
          marginBottom: "2rem", width: "fit-content",
        }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", borderRadius: "var(--radius-sm)",
              border: "none", fontWeight: 600, fontSize: 13,
              cursor: "pointer", transition: "all 0.15s",
              background: activeTab === tab
                ? "linear-gradient(135deg, var(--accent), #a78bfa)"
                : "transparent",
              color: activeTab === tab ? "#fff" : "var(--text-secondary)",
              boxShadow: activeTab === tab ? "0 2px 8px var(--accent-glow)" : "none",
            }}>
              {tab === "Sessions" ? "⚡ Sessions" : "🗺️ Heatmap"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem",
        }}>
          {activeTab === "Sessions" ? <SessionsView /> : <HeatmapView />}
        </div>
      </main>
    </>
  );
}