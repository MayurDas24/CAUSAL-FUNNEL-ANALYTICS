# 🚀 CausalFunnel Analytics

> A lightweight product analytics platform for session tracking, user journey visualization, and click heatmap analytics.

Built as a full-stack analytics solution that captures user interactions in real time, stores them efficiently, and visualizes user behavior through an interactive dashboard.

---

## 🌐 Live Demo

### Frontend
https://causal-funnel-analytics-1.onrender.com

### Backend API
https://causal-funnel-analytics.onrender.com

---

## 📖 Overview

Modern products need visibility into how users interact with their applications.

CausalFunnel Analytics provides:

- Session tracking
- User journey analysis
- Click heatmap generation
- Event batching
- Real-time analytics dashboard
- MongoDB-backed event storage

The platform captures user behavior directly from the browser, processes events through a scalable backend API, and presents actionable insights through a modern dashboard.

---

## ✨ Features

### 📊 Session Tracking

Every visitor receives a unique session identifier.

Track:

- Session duration
- Total events
- Page views
- Click interactions
- Pages visited

---

### 🖱️ Click Tracking

Capture:

- X/Y click coordinates
- Timestamp
- Associated page
- Session information

Useful for:

- UX analysis
- Conversion optimization
- Feature engagement measurement

---

### 🛤️ User Journey Visualization

View complete user timelines:

```text
PAGE_VIEW
 ↓
CLICK
 ↓
CLICK
 ↓
PAGE_VIEW
 ↓
CLICK
```

Analyze:

- Navigation flow
- Interaction patterns
- Drop-off points

---

### 🔥 Interactive Heatmap

Visualize click density across pages.

Features:

- Page-specific filtering
- Click intensity visualization
- Real-time updates
- Dynamic page selection

---

### ⚡ Event Batching

Events are buffered client-side and sent periodically.

Benefits:

- Reduced network overhead
- Improved performance
- Lower API load
- Production-ready event ingestion

---

## 🏗️ System Architecture

```text
┌──────────────────┐
│   Browser SDK    │
│                  │
│ • Page Views     │
│ • Click Events   │
│ • Session IDs    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Express Backend │
│                  │
│ • Event APIs     │
│ • Aggregations   │
│ • Analytics      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    MongoDB       │
│                  │
│ • Events         │
│ • Sessions       │
│ • Heatmap Data   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Next.js Dashboard│
│                  │
│ • Sessions       │
│ • User Journey   │
│ • Heatmaps       │
└──────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- JavaScript
- CSS
- Canvas-based Heatmap Rendering

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Deployment

- Render
- MongoDB Atlas

---

## 📂 Project Structure

```text
causal-funnel-analytics/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── config/
│   │   └── server.js
│
└── tracker.js
```

---

## 📡 API Endpoints

### Store Single Event

```http
POST /api/events
```

### Store Event Batch

```http
POST /api/events/batch
```

### Get Session Analytics

```http
GET /api/events/sessions
```

Example Response:

```json
{
  "session_id": "sess_abc123",
  "total_events": 25,
  "page_views": 5,
  "clicks": 20
}
```

### Get Session Timeline

```http
GET /api/events/session/:sessionId
```

### Get Heatmap Data

```http
GET /api/events/heatmap?url=<page_url>
```

### Get Tracked Pages

```http
GET /api/events/pages
```

---

## 🔄 Event Flow

### 1. User Opens Page

```text
PAGE_VIEW event created
```

### 2. User Clicks

```text
CLICK event created
```

Example:

```json
{
  "event_type": "click",
  "coordinates": {
    "x": 436,
    "y": 433
  }
}
```

### 3. Events Batched

```text
Queued in memory
↓
Sent every 2 seconds
```

### 4. Stored in MongoDB

```text
Events Collection
↓
Indexed
↓
Aggregated
```

### 5. Dashboard Visualizes Data

```text
Sessions
↓
Journey Timeline
↓
Heatmap
```

---

## 📊 Sample Analytics

Example Session:

```text
Session ID:
sess_vb2t53tyy8mqj9gkcx

Events: 38
Page Views: 6
Clicks: 32
Duration: 17m 30s
```

---

## 🔒 Scalability Considerations

Implemented:

- Event batching
- Indexed MongoDB queries
- Session aggregation pipelines
- Client-side buffering
- Efficient heatmap querying

Potential Future Improvements:

- Redis event queue
- Kafka ingestion pipeline
- Multi-page heatmap support
- User authentication
- Real-time WebSocket analytics

---

## 🚀 Local Setup

### Clone Repository

```bash
git clone <repo-url>
cd causal-funnel-analytics
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
MONGO_URI=<mongodb_connection_string>
PORT=5000
```

Run:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run:

```bash
npm run dev
```

---

## 🎯 Key Learnings

This project involved designing and implementing:

- Browser-side event instrumentation
- Session management
- Analytics aggregation pipelines
- Heatmap visualization
- Full-stack deployment
- Production database integration
- Real-time behavioral analytics

---

## 👨‍💻 Author

**Mayur R Das**

B.Tech Computer & Communication Engineering  
MIT Manipal

GitHub: https://github.com/MayurDas24

---

