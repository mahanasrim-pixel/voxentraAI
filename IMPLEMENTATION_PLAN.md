# VOXENTRA – Intelligent Civic Complaint & Response Platform
## System Architecture & Implementation Plan

### 1. Technology Stack
* **Frontend**:
  * React 18+ (Vite for high performance ESM bundling)
  * Pure Vanilla CSS Custom Design System ("Midnight Civic Command Center" theme)
  * Leaflet & React-Leaflet with CartoDB Dark Matter dark tile provider
  * Lucide-React for modern control-room telemetry icons
  * Web Speech API (Speech Recognition + Speech Synthesis with Tamil/Indian English/multilingual voice fallbacks)
* **Backend**:
  * Node.js & Express REST API
  * Server-Sent Events (SSE) for real-time City Pulse, emergency alerts, and AI telemetry updates
  * SQLite (`better-sqlite3` / `sqlite3`) for persistent, ACID-compliant local storage with auto-migrated schema
* **AI & NLP Pipeline**:
  * Hybrid Multilingual Engine:
    * Language Detector: Tamil (Script & Romanized Tanglish), Malayalam, Hindi (Script & Hinglish), English
    * Smart Speech/Text Normalizer: Phonetic Levenshtein dictionary mapping common speech-to-text distortions (e.g., "sarava patty la road damaj" -> "Saravanampatti-la road damage aayirukku")
    * Clarity & Completeness Evaluator: Computes confidence scores for Category, Location, and Severity. Triggers targeted conversational follow-ups when ambiguity or missing critical slots are detected
    * Priority Engine: Rule-based emergency contextual heuristic + sentiment/urgency classifier (🔴 Emergency, 🟠 High/Medium, 🟢 Normal)
    * Department Auto-Router: Maps category and urgency to municipal departments (Roads, Water, Sanitation, TNEB/Electricity, Police, Fire & Rescue)
    * Pluggable LLM interface (compatible with Gemini / OpenAI / Ollama via `.env` credentials with zero-failure local fallback)
* **Geocoding & Hotspots**:
  * Local high-fidelity municipal landmark & ward coordinates catalog (focused on Coimbatore & regional hubs with Saravanampatti, Gandhipuram, RS Puram, Peelamedu, Ukkadam, Singanallur, etc.)
  * Reverse geocoding & spatial clustering for civic hotspot detection
* **Notification System**:
  * Abstracted SMS & Alert Service (`smsService.js`) with Twilio / Fast2SMS adapters + Interactive In-App Simulation & Notification Log viewer

---

### 2. Folder Structure
```
c:/Users/MAHANASRI M/Desktop/mp/
├── package.json
├── .env.example
├── .env
├── server/
│   ├── index.js                  # Main Express server entrypoint
│   ├── config.js                 # Environment & app configurations
│   ├── db/
│   │   ├── connection.js         # SQLite connection & initialization
│   │   ├── schema.sql            # Schema definitions
│   │   └── seed.js               # Initial departments, staff, mock complaints & hotspots
│   ├── ai/
│   │   ├── languageDetector.js   # Multilingual & Tanglish detector
│   │   ├── normalizer.js         # Phonetic & speech error correction
│   │   ├── conversationEngine.js # Multi-turn dialogue manager & clarification logic
│   │   ├── classifier.js         # Category, priority & department routing
│   │   └── geocoder.js           # Spoken location & landmark resolver
│   ├── services/
│   │   ├── complaintService.js   # Complaint lifecycle & duplicate detection
│   │   ├── notificationService.js# SMS provider interface & mock dispatcher
│   │   ├── hotspotService.js     # Spatial clustering & hotspot calculation
│   │   └── sseService.js         # Server-sent events for City Pulse & AI telemetry
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & admin role check
│   │   └── validate.js           # Request payload sanitization
│   └── routes/
│       ├── auth.js               # Admin login & session verification
│       ├── voice.js              # Voice conversation & audio transcription
│       ├── complaints.js         # CRUD, status updates, staff assignments
│       ├── departments.js        # Department listings & stats
│       ├── staff.js              # Staff roster management
│       ├── hotspots.js           # Aggregated hotspots
│       ├── analytics.js          # Control room charts and metrics
│       └── notifications.js      # SMS & system alerts feed
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── index.css             # Theme variables (Midnight Civic Command Center)
        ├── App.jsx               # Main router & state coordinator
        ├── components/
        │   ├── Header.jsx        # Command center header with live telemetry indicator
        │   ├── Sidebar.jsx       # Control room navigation
        │   ├── CityPulse.jsx     # Live pulse bar with animated activity ticker
        │   ├── AIStatusCard.jsx  # "VOXENTRA AI - LIVE" metrics card
        │   └── Modal.jsx         # Accessible dialog component
        ├── pages/
        │   ├── CitizenPortal.jsx # Voice-first citizen complaint experience & phone simulator
        │   ├── Overview.jsx      # Command center overview & KPI grid
        │   ├── LiveMap.jsx       # Dark Leaflet map with priority markers, drawer & filters
        │   ├── Complaints.jsx    # Complaint list, search, filter, status updater & duplicates
        │   ├── Hotspots.jsx      # Problem hotspots list and analytical heat indicators
        │   ├── Analytics.jsx     # Real-time charts for categories, wards, resolution times
        │   ├── Staff.jsx         # Staff assignment & department roster
        │   ├── Notifications.jsx # SMS dispatch log & system notifications
        │   └── Login.jsx         # Admin authentication screen
        └── services/
            ├── api.js            # Axios/Fetch API client
            ├── speech.js         # Browser Speech Recognition & TTS wrappers
            └── sse.js            # Live SSE event listener
```

---

### 3. Database Design
* **`departments`**: `id`, `name`, `code`, `icon`, `contact_email`, `contact_phone`, `sla_hours`, `created_at`
* **`staff`**: `id`, `name`, `employee_code`, `department_id`, `role`, `phone`, `email`, `active_cases`, `is_available`, `created_at`
* **`complaints`**:
  * `id` (e.g., `VX20260925001`)
  * `citizen_phone`, `citizen_name`
  * `original_transcript`, `normalized_text`
  * `detected_language` (Tamil, Tanglish, Malayalam, Hindi, English)
  * `category` (Accident, Theft, Damaged Road, Water Leakage, Fire, Electricity Issue, Garbage/Sanitation, Other Civic Issue)
  * `description`
  * `spoken_location`, `landmark`, `area_name`
  * `latitude`, `longitude` (nullable float, populated by geocoder)
  * `priority` ('emergency', 'high', 'medium', 'normal')
  * `department_id` (foreign key)
  * `assigned_staff_id` (foreign key)
  * `status` ('received', 'assigned', 'in_progress', 'resolved', 'rejected')
  * `clarification_needed` (boolean), `clarification_notes`
  * `confidence_score` (float)
  * `created_at`, `updated_at`, `resolved_at`
* **`complaint_timeline`**: `id`, `complaint_id`, `status`, `actor`, `notes`, `created_at`
* **`notifications`**: `id`, `complaint_id`, `recipient_phone`, `channel` ('sms', 'system'), `message`, `status` ('sent', 'simulated', 'failed'), `created_at`
* **`admins`**: `id`, `username`, `password_hash`, `full_name`, `role`, `created_at`

---

### 4. API Design
* `POST /api/auth/login` - Admin credentials verification
* `GET  /api/auth/me` - Authenticate current session
* `POST /api/voice/interact` - Turn-based voice/text conversation engine (analyzes user utterance, returns AI reply, extracted slots, follow-up questions, or registers finalized complaint)
* `POST /api/complaints` - Directly register complaint with full metadata
* `GET  /api/complaints` - Query complaints with filters (status, priority, department, search, date range)
* `GET  /api/complaints/:id` - Full complaint detail with timeline and duplicate candidates
* `PATCH /api/complaints/:id` - Update status, priority, department, staff assignment
* `GET  /api/complaints/:id/duplicates` - Query potential similar complaints nearby
* `GET  /api/hotspots` - Aggregated spatial clusters by ward/area with count & category breakdown
* `GET  /api/analytics/summary` - Aggregate metrics (KPIs, category distribution, daily influx, SLA status)
* `GET  /api/departments` - List departments with workload stats
* `GET  /api/staff` & `POST /api/staff` - Staff management
* `GET  /api/notifications` - SMS & alert dispatch log
* `GET  /api/stream/pulse` - Server-Sent Events stream for live City Pulse events & AI telemetry

---

### 5. AI & Conversational Flow
1. **Citizen speech** input received (e.g., *"Saravanampatti-la road romba damage aayirukku"*).
2. **Language Detection**:
   - Detects Tamil keywords (`-la`, `aayirukku`, `romba`, `enga`, `irukku`) -> Tags as Tanglish / Tamil.
   - Sets response voice & syntax to match citizen language!
3. **Smart Correction**:
   - Matches known geographic & civic terms using phonetic & fuzzy lookup (e.g. "sarava patty" -> "Saravanampatti", "damaj" -> "damage").
4. **Slot Extraction & Clarity Check**:
   - Evaluates: Has category? Yes (`Damaged Road`). Has location? Yes (`Saravanampatti`).
   - Checks details: Is urgency or specific landmark specified? If missing, AI asks a concise follow-up in the citizen's style:
     *"Got it. Is the road completely blocked or still usable?"*
5. **Confirmation & Priority Computation**:
   - Computes priority (Emergency / High / Medium / Normal) based on danger criteria (e.g. blocked highway = High; active fire/accident with casualties = Emergency).
   - Automatically assigns unique ID (e.g. `VX20260925001`).
   - Dispatches mock SMS to citizen phone: *"Your complaint VX20260925001 has been registered..."*

---

### 6. Admin Dashboard Aesthetics ("Midnight Civic Command Center")
* Background: `#0B0F17` (Deep obsidian charcoal)
* Card surfaces: `#131B2A` with subtle glassmorphism borders (`1px solid rgba(255, 255, 255, 0.08)`)
* Accent glows: Electric Cyan (`#00f0ff`), Cyber Violet (`#8a2be2`)
* Status Indicators:
  * 🔴 Emergency: `#FF3366` with pulsing radar ring
  * 🟠 High/Medium: `#FF9900`
  * 🟢 Normal/Resolved: `#00E599`
  * 🔵 Under Investigation: `#00B4D8`
* Typography: Modern sans-serif headings with high contrast, telemetry numbers in monospaced styling.

---

### 7. Development Phases
1. **Phase 1**: Backend Architecture & Database setup with SQLite, schema migrations, and rich realistic seed data.
2. **Phase 2**: AI Conversational Engine, Smart Normalizer, Language Detection, Priority & Department Routing rules.
3. **Phase 3**: Express API Routes, Complaint Service, Duplicate Detection, Hotspots, and SSE stream.
4. **Phase 4**: Frontend Setup (Vite + React) with "Midnight Civic Command Center" styling and theme system.
5. **Phase 5**: Citizen Voice Experience with Web Speech API, Audio Visualizer, Dual Voice/Phone simulator, and Multi-turn dialogue.
6. **Phase 6**: Admin Dashboard (Overview, Live Pulse, AI Live card, KPI counters).
7. **Phase 7**: Live Complaint Map with Dark Carto tiles, custom priority markers, geocoded locations, and side inspection drawer.
8. **Phase 8**: Hotspots, Complaints list/management, Staff assignment, Analytics charts, and SMS log viewer.
9. **Phase 9**: End-to-end testing with the specified demo flow ("Saravanampatti-la road romba damage aayirukku") and verification in the browser.
