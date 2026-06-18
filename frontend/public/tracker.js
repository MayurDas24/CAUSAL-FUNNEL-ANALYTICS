(function () {
  "use strict";

  const API_URL = "https://causal-funnel-analytics.onrender.com/api/events";
  const BATCH_INTERVAL = 2000; // flush every 2 seconds

  // ── Session ID ────────────────────────────────────────────────────────────
  function getSessionId() {
    const COOKIE_NAME = "cf_session_id";
    // try cookie first
    const match = document.cookie.match(new RegExp("(?:^|; )" + COOKIE_NAME + "=([^;]*)"));
    if (match) return decodeURIComponent(match[1]);

    // fallback: localStorage
    let id = localStorage.getItem(COOKIE_NAME);
    if (!id) {
      id = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(COOKIE_NAME, id);
    }

    // persist in cookie (30 min session)
    const expires = new Date(Date.now() + 30 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(id)}; expires=${expires}; path=/; SameSite=Lax`;
    return id;
  }

  const SESSION_ID = getSessionId();
  let eventQueue = [];
  let flushTimer = null;

  // ── Event builder ─────────────────────────────────────────────────────────
  function buildEvent(type, extra) {
    return {
      session_id: SESSION_ID,
      event_type: type,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      },
      ...extra,
    };
  }

  // ── Queue & flush ─────────────────────────────────────────────────────────
  function enqueue(event) {
    eventQueue.push(event);
    if (!flushTimer) {
      flushTimer = setTimeout(flush, BATCH_INTERVAL);
    }
  }

 function flush() {
  flushTimer = null;

  if (eventQueue.length === 0) return;

  const batch = eventQueue.splice(0);

  const payload = JSON.stringify({
    events: batch,
  });

  fetch(API_URL + "/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
    keepalive: true,
  })
    .then((res) => res.json())
    .then((data) => console.log("Batch Sent:", data))
    .catch((err) => console.error(err));
}

  // Flush on page hide / unload
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);

  // ── Trackers ──────────────────────────────────────────────────────────────
  function trackPageView() {
    enqueue(buildEvent("page_view"));
  }

  function trackClicks() {
    document.addEventListener("click", function (e) {
      enqueue(
        buildEvent("click", {
          coordinates: { x: Math.round(e.clientX), y: Math.round(e.clientY) },
        })
      );
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  trackPageView();
  trackClicks();

  // Expose for SPA route changes
  window.CausalFunnel = {
    trackPageView,
    track: (type, extra) => enqueue(buildEvent(type, extra)),
  };
})();