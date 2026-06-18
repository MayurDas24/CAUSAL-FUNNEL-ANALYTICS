const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// POST /api/events — receive and store a single event
router.post("/", async (req, res) => {
  try {
    const { session_id, event_type, page_url, timestamp, coordinates, metadata } = req.body;

    if (!session_id || !event_type || !page_url) {
      return res.status(400).json({ error: "session_id, event_type, and page_url are required." });
    }

    const event = new Event({
      session_id,
      event_type,
      page_url,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      coordinates: coordinates || undefined,
      metadata: metadata || undefined,
    });

    await event.save();
    return res.status(201).json({ success: true, id: event._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/events/batch — receive and store multiple events at once
router.post("/batch", async (req, res) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "events array is required." });
    }

    const docs = events.map((e) => ({
      session_id: e.session_id,
      event_type: e.event_type,
      page_url: e.page_url,
      timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
      coordinates: e.coordinates || undefined,
      metadata: e.metadata || undefined,
    }));

    const inserted = await Event.insertMany(docs, { ordered: false });
    return res.status(201).json({ success: true, count: inserted.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/events/sessions — list all sessions with event counts
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
          page_views: {
            $sum: { $cond: [{ $eq: ["$event_type", "page_view"] }, 1, 0] },
          },
          clicks: {
            $sum: { $cond: [{ $eq: ["$event_type", "click"] }, 1, 0] },
          },
          first_seen: { $min: "$timestamp" },
          last_seen: { $max: "$timestamp" },
          pages_visited: { $addToSet: "$page_url" },
        },
      },
      {
        $project: {
          session_id: "$_id",
          total_events: 1,
          page_views: 1,
          clicks: 1,
          first_seen: 1,
          last_seen: 1,
          duration_seconds: {
            $divide: [{ $subtract: ["$last_seen", "$first_seen"] }, 1000],
          },
          pages_visited: { $size: "$pages_visited" },
        },
      },
      { $sort: { last_seen: -1 } },
    ]);

    return res.json({ success: true, sessions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/events/session/:sessionId — all events for a specific session
router.get("/session/:sessionId", async (req, res) => {
  try {
    const events = await Event.find({ session_id: req.params.sessionId })
      .sort({ timestamp: 1 })
      .lean();

    return res.json({ success: true, events });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/events/heatmap?url=<page_url> — click data for a page
router.get("/heatmap", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "url query param is required." });

    const clicks = await Event.find({
      event_type: "click",
      page_url: url,
      "coordinates.x": { $exists: true },
    })
      .select("coordinates timestamp session_id -_id")
      .lean();

    // Get all tracked pages for the dropdown
    const pages = await Event.distinct("page_url");

    return res.json({ success: true, clicks, pages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/events/pages — get all distinct tracked pages
router.get("/pages", async (req, res) => {
  try {
    const pages = await Event.distinct("page_url");
    return res.json({ success: true, pages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;