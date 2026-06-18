"use client";
import { useState, useEffect, useRef } from "react";
import { fetchHeatmap, fetchPages } from "@/lib/api";

export default function HeatmapView() {
  const [pages, setPages] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchPages()
      .then((p) => {
        setPages(p);
        if (p.length > 0) setSelectedUrl(p[0]);
      })
      .catch(console.error)
      .finally(() => setPagesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUrl) return;
    setLoading(true);
    fetchHeatmap(selectedUrl)
      .then((data) => setClicks(data.clicks || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedUrl]);

  // Draw heatmap on canvas
  useEffect(() => {
    if (!canvasRef.current || clicks.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw background grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Normalize coordinates to canvas size
    // Assume events were captured on a viewport; we scale relative to canvas
    const screenW = 1440, screenH = 900; // assumed base viewport
    const scaleX = W / screenW;
    const scaleY = H / screenH;

    // Draw density blobs
    clicks.forEach((click) => {
      const cx = (click.coordinates.x || 0) * scaleX;
      const cy = (click.coordinates.y || 0) * scaleY;
      const radius = 40;

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, "rgba(124, 106, 247, 0.5)");
      gradient.addColorStop(0.4, "rgba(124, 106, 247, 0.15)");
      gradient.addColorStop(1, "rgba(124, 106, 247, 0)");

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });

    // Draw individual dots on top
    clicks.forEach((click) => {
      const cx = (click.coordinates.x || 0) * scaleX;
      const cy = (click.coordinates.y || 0) * scaleY;

      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(167, 139, 250, 0.9)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    });
  }, [clicks]);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Click Heatmap</h2>

        {pagesLoading ? (
          <div style={{ height: 36, width: 280, background: "var(--surface)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }} />
        ) : pages.length === 0 ? (
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>No pages tracked yet.</span>
        ) : (
          <select
            value={selectedUrl}
            onChange={(e) => setSelectedUrl(e.target.value)}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "8px 12px",
              color: "var(--text-primary)", fontSize: 13,
              fontFamily: "var(--font-sans)", flex: 1, maxWidth: 420,
              outline: "none",
            }}
          >
            {pages.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        )}

        <div style={{
          marginLeft: "auto",
          fontSize: 12, color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)", padding: "6px 12px",
        }}>
          {clicks.length} clicks recorded
        </div>
      </div>

      {/* Canvas heatmap */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        position: "relative",
      }}>
        {loading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(10,10,15,0.7)", zIndex: 10,
            fontSize: 13, color: "var(--text-muted)",
          }}>
            Loading heatmap data…
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {clicks.length === 0 && !loading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            color: "var(--text-muted)", gap: 8,
          }}>
            <div style={{ fontSize: 36 }}>🖱️</div>
            <div style={{ fontSize: 13 }}>No click data for this page yet.</div>
            <div style={{ fontSize: 12 }}>Click around the demo page to populate the heatmap.</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: "1.5rem", marginTop: "1rem",
        alignItems: "center", flexWrap: "wrap",
      }}>
        {[
          { label: "Low density", color: "rgba(124,106,247,0.2)" },
          { label: "Medium density", color: "rgba(124,106,247,0.5)" },
          { label: "High density", color: "rgba(124,106,247,0.9)" },
          { label: "Exact click", color: "#fff" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}