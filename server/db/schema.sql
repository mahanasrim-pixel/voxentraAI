CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  icon TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  sla_hours INTEGER DEFAULT 48,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  employee_code TEXT NOT NULL UNIQUE,
  department_id INTEGER NOT NULL REFERENCES departments(id),
  role TEXT DEFAULT 'Field Inspector',
  phone TEXT,
  email TEXT,
  is_available INTEGER DEFAULT 1,
  active_cases INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'Chief Controller',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  location_id TEXT UNIQUE,
  canonical_name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  location_type TEXT,
  revenue_division TEXT,
  taluk TEXT,
  parent_location_id TEXT,
  aliases TEXT,
  tamil_name TEXT,
  tanglish_variants TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  geocoding_status TEXT DEFAULT 'VERIFIED',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS landmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  landmark_id TEXT UNIQUE NOT NULL,
  landmark_name TEXT NOT NULL,
  tamil_name TEXT,
  aliases TEXT,
  landmark_type TEXT NOT NULL,
  district TEXT DEFAULT 'Coimbatore',
  taluk TEXT,
  area TEXT NOT NULL,
  street TEXT,
  road TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  search_keywords TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  citizen_phone TEXT NOT NULL,
  citizen_name TEXT DEFAULT 'Citizen',
  original_transcript TEXT NOT NULL,
  normalized_text TEXT NOT NULL,
  detected_language TEXT DEFAULT 'Tanglish',
  category TEXT NOT NULL,
  description TEXT,
  spoken_location TEXT,
  raw_location_text TEXT,
  canonical_location_name TEXT,
  location_id TEXT,
  taluk TEXT,
  street TEXT,
  landmark TEXT,
  area_name TEXT,
  location_precision TEXT DEFAULT 'APPROXIMATE',
  latitude REAL,
  longitude REAL,
  priority TEXT DEFAULT 'medium',
  department_id INTEGER REFERENCES departments(id),
  assigned_staff_id INTEGER REFERENCES staff(id),
  status TEXT DEFAULT 'received',
  clarification_needed INTEGER DEFAULT 0,
  clarification_notes TEXT,
  confidence_score REAL DEFAULT 0.95,
  source TEXT DEFAULT 'voice_call',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME
);

CREATE TABLE IF NOT EXISTS complaint_timeline (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaint_id TEXT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  actor TEXT DEFAULT 'VOXENTRA AI',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaint_id TEXT REFERENCES complaints(id) ON DELETE CASCADE,
  recipient_phone TEXT NOT NULL,
  channel TEXT DEFAULT 'sms',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'delivered',
  provider_response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  complaint_id TEXT,
  input_text TEXT,
  detected_lang TEXT,
  clarification_asked INTEGER DEFAULT 0,
  was_emergency INTEGER DEFAULT 0,
  confidence REAL,
  processing_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_dept ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_area ON complaints(area_name);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at);
