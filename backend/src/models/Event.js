const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      index: true,
    },
    event_type: {
      type: String,
      enum: ["page_view", "click"],
      required: true,
    },
    page_url: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    coordinates: {
      x: { type: Number },
      y: { type: Number },
    },
    metadata: {
      userAgent: { type: String },
      referrer: { type: String },
      screenWidth: { type: Number },
      screenHeight: { type: Number },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt managed by Mongo
  }
);

// Compound index for heatmap queries
eventSchema.index({ page_url: 1, event_type: 1 });

module.exports = mongoose.model("Event", eventSchema);