"use client";
import { useState, useEffect } from "react";
import { fetchSessions, fetchSessionEvents } from "@/lib/api";

function formatDuration(secs) {
  if (!secs || secs < 0) return "< 1s";
  if (secs < 60) return `${Math.round(secs)}s`;
  return `${Math.floor(secs / 60)}m ${Math.round(secs % 60)}s`;
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function SessionsView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSelectSession(session) {
    setSelected(session);
    setEventsLoading(true);
    try {
      const evts = await fetchSessionEvents(session.session_id);
      setEvents(evts);
    } catch (e) {
      console.error(e);
    } finally {
      setEventsLoading(false);
    }
  }

  const badge = (label, color, dim) => (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "2px 8px",
      borderRadius: "999px", background: dim, color: color,
      letterSpacing: "0.03em",
    }}>{label}</span>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "1.5rem", alignItems: "start" }}>

      {/* Sessions list */}
      <div>
        <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Sessions</h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            {sessions.length} total
          </span>
        </div>

        {loading ? (
          <SkeletonList />
        ) : sessions.length === 0 ? (
          <EmptyState msg="No sessions yet. Open the demo page to start tracking." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sessions.map((s) => (
              <button key={s.session_id} onClick={() => handleSelectSession(s)} style={{
                background: selected?.session_id === s.session_id ? "var(--accent-dim)" : "var(--surface)",
                border: `1px solid ${selected?.session_id === s.session_id ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "var(--radius)",
                padding: "1rem 1.25rem",
                textAlign: "left",
                color: "var(--text-primary)",
                cursor: "pointer",
                transition: "all 0.15s",
                width: "100%",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)" }}>
                    {s.session_id.slice(0, 20)}…
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(s.last_seen)}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {badge(`${s.total_events} events`, "var(--text-primary)", "var(--surface-2)")}
                  {badge(`${s.page_views} views`, "var(--accent)", "var(--accent-dim)")}
                  {badge(`${s.clicks} clicks`, "var(--green)", "var(--green-dim)")}
                  {badge(formatDuration(s.duration_seconds), "var(--amber)", "var(--amber-dim)")}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Journey detail */}
      {selected && (
        <div>
          <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>User Journey</h2>
            <button onClick={() => setSelected(null)} style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "4px 12px",
              color: "var(--text-secondary)", fontSize: 12,
            }}>✕ Close</button>
          </div>

          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "1rem",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--text-muted)", marginBottom: "1rem",
            wordBreak: "break-all",
          }}>
            {selected.session_id}
          </div>

          {eventsLoading ? (
            <SkeletonList count={4} />
          ) : events.length === 0 ? (
            <EmptyState msg="No events found for this session." />
          ) : (
            <div style={{ position: "relative" }}>
              {/* timeline line */}
              <div style={{
                position: "absolute", left: 15, top: 0, bottom: 0,
                width: 1, background: "var(--border)",
              }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {events.map((ev, i) => (
                  <div key={ev._id || i} style={{
                    display: "flex", gap: "1rem", paddingLeft: "2.5rem",
                    position: "relative",
                  }}>
                    {/* dot */}
                    <div style={{
                      position: "absolute", left: 9, top: 12,
                      width: 13, height: 13, borderRadius: "50%",
                      background: ev.event_type === "click" ? "var(--green)" : "var(--accent)",
                      border: "2px solid var(--bg)",
                      zIndex: 1,
                    }} />
                    <div style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "0.75rem 1rem",
                      flex: 1,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{
                          fontSize: 12, fontWeight: 600,
                          color: ev.event_type === "click" ? "var(--green)" : "var(--accent)",
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>
                          {ev.event_type}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                          {new Date(ev.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", wordBreak: "break-all" }}>
                        {ev.page_url}
                      </div>
                      {ev.coordinates && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
                          x: {ev.coordinates.x}, y: {ev.coordinates.y}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1rem 1.25rem",
          height: 80, animation: "shimmer 1.4s ease infinite",
          opacity: 0.6,
        }} />
      ))}
      <style>{`@keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:.3} }`}</style>
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px dashed var(--border)",
      borderRadius: "var(--radius)", padding: "3rem 2rem",
      textAlign: "center", color: "var(--text-muted)", fontSize: 13,
    }}>
      {msg}
    </div>
  );
}