# VOXENTRA — Intelligent Civic Complaint & Response Platform

> **LISTEN → UNDERSTAND → ROUTE → RESOLVE**  
> A voice-first full-stack civic reporting and municipal operations platform built for citizens and city administrators.

---

## 🌟 Key Features

### 1. Citizen Voice Assistant
- **Voice-First Complaint Registration**: Citizens speak naturally instead of filling complicated forms.
- **Multilingual & Tanglish Detection**: Automatic recognition for Tamil, Tanglish, Malayalam, Hindi, and English.
- **Smart Speech & Phonetic Normalization**: Fixes speech-to-text distortions (e.g. `"Sarava patty la road damaj aayiruku"` → `"Saravanampatti-la road damage aayirukku"`) without altering citizen intent.
- **Contextual Follow-ups**: If critical slots (location, severity) are missing, the assistant asks concise, language-matched follow-up questions.
- **Offline & Landmark Geocoding**: Extracts places and landmarks without requiring GPS on citizen feature phones.

### 2. Midnight Civic Command Center (Admin Dashboard)
- **High-Contrast Dark Control-Room Theme**: Built with deep obsidian canvas (`#06090E`), electric cyan/violet accents (`#00f0ff`, `#8a2be2`), and pulsing emergency signaling (`#ff3366`).
- **City Pulse**: Real-time ticker showing new complaints, active emergency reports, assigned units, and resolved cases today.
- **VOXENTRA AI Live Monitor**: Real-time telemetry tracking complaints understood, clarification rates, emergency detections, and speech latency.
- **Live Dark Complaint Map**: CartoDB Dark Matter map with custom glowing radar markers, priority indicators, and one-click inspection drawers.
- **Problem Hotspots**: Identifies geographic complaint density clusters (e.g., *"Saravanampatti – 4 road complaints"*) with severity classification.
- **Duplicate & Related Complaints**: Evaluates proximity, description overlap, and temporal windows to flag potential duplicate tickets for administrative cross-referencing.
- **Field Staff Roster & Department Workloads**: Assign and reassign complaints across 7 municipal departments (Roads, Water, Sanitation, TNEB, Police, Fire & Rescue, Public Health).
- **Citizen SMS Notification Architecture**: Pluggable provider interface (Twilio / development mock) delivering automated SMS dispatches for registration, staff assignment, and ticket resolution.

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
# Install root & backend dependencies
npm install

# Install frontend client dependencies
cd client
npm install
cd ..
```

### 2. Seed Database
```bash
# Seed initial municipal departments, staff, and realistic Coimbatore civic tickets
npm run seed
```

### 3. Run Full-Stack Development Server
```bash
# Concurrently starts Express backend (port 5000) and Vite frontend (port 5173/5174)
npm run dev
```

- **Frontend URL**: `http://localhost:5174/` (or `http://localhost:5173/`)
- **Backend API URL**: `http://localhost:5000/`
- **Default Admin Credentials**:
  - **Username**: `admin`
  - **Password**: `admin123`

---

## 🎯 Primary Demo Flow

1. Open `http://localhost:5174/` and click **"Citizen Voice Portal"** in the top navigation.
2. Click the **"⭐ Primary Requirement Demo"** button:
   > Citizen: *"Saravanampatti-la road romba damage aayirukku."*
3. The AI detects **Tanglish**, extracts **Damaged Road** and **Saravanampatti**, and asks a follow-up:
   > Assistant: *"Got it. Saravanampatti-la road completely blocked aagirukka illai still usable-ah?"*
4. Click the **"💬 Follow-up Response Demo"** button:
   > Citizen: *"Still usable, vehicles slow-ah poga mudiyum."*
5. The complaint is lodged with a unique ID (e.g., `VX20260925012`). The incoming SMS notification banner appears!
6. Click **"View on Command Center Map & Dashboard"**:
   - The ticket appears on the **Overview** dashboard and **Live Map**.
   - Navigate to **Complaints**, click **"Manage"** to open the side inspection drawer.
   - Assign field staff (e.g. *D. Vignesh / Roads & Infrastructure*).
   - Change status to **In Progress** and then **Resolved**.
   - Review the **SMS & Alerts** feed to inspect the simulated citizen notifications!

---

## 🏛️ System Architecture

```
c:/Users/MAHANASRI M/Desktop/mp/
├── server/
│   ├── index.js                  # Express API server entrypoint
│   ├── config.js                 # App configuration & environment variables
│   ├── db/
│   │   ├── connection.js         # SQLite database wrapper
│   │   ├── schema.sql            # Relational database schema
│   │   └── seed.js               # Initial seeding script
│   ├── ai/
│   │   ├── languageDetector.js   # Multilingual & Tanglish detector
│   │   ├── normalizer.js         # Phonetic error corrector
│   │   ├── conversationEngine.js # Multi-turn dialogue manager
│   │   ├── classifier.js         # Intent, priority & department routing
│   │   └── geocoder.js           # Landmark & area resolver
│   ├── services/
│   │   ├── complaintService.js   # Complaint lifecycle & duplicate detection
│   │   ├── notificationService.js# SMS provider abstraction & mock logger
│   │   ├── hotspotService.js     # Spatial problem density clustering
│   │   └── sseService.js         # Server-Sent Events real-time broadcaster
│   └── routes/                   # REST API routes (auth, voice, complaints, etc.)
└── client/
    ├── index.html                # HTML entrypoint with Leaflet & Google Fonts
    ├── vite.config.js            # Vite bundler & reverse proxy config
    └── src/
        ├── index.css             # "Midnight Civic Command Center" design system
        ├── App.jsx               # Application root coordinator
        ├── components/           # Header, Sidebar, CityPulse, AIStatusCard, Drawers
        ├── pages/                # CitizenPortal, Overview, LiveMap, Complaints, Hotspots, Analytics, Staff
        └── services/             # API client, Web Speech API wrapper, SSE listener
```
