process.env.NEXT_PUBLIC_API_URL ||
"https://causal-funnel-analytics.onrender.com"

export async function fetchSessions() {
  const res = await fetch(`${BASE}/api/events/sessions`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  const data = await res.json();
  return data.sessions;
}

export async function fetchSessionEvents(sessionId) {
  const res = await fetch(`${BASE}/api/events/session/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch session events");
  const data = await res.json();
  return data.events;
}

export async function fetchHeatmap(url) {
  const res = await fetch(`${BASE}/api/events/heatmap?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("Failed to fetch heatmap data");
  const data = await res.json();
  return data;
}

export async function fetchPages() {
  const res = await fetch(`${BASE}/api/events/pages`);
  if (!res.ok) throw new Error("Failed to fetch pages");
  const data = await res.json();
  return data.pages;
}