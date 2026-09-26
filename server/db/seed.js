const bcrypt = require('bcryptjs');
const db = require('./connection');

async function seed() {
  console.log('--- Starting VOXENTRA Database Seeding ---');
  await db.initSchema();

  // 1. Seed Departments
  const existingDepts = await db.all('SELECT COUNT(*) as count FROM departments');
  if (existingDepts[0].count === 0) {
    console.log('Seeding departments...');
    const depts = [
      ['Roads & Infrastructure', 'ROADS', 'Hammer', 'roads@corporation.gov.in', '+91 422 2300101', 48],
      ['Water Supply & Drainage', 'WATER', 'Droplet', 'water@corporation.gov.in', '+91 422 2300102', 24],
      ['Sanitation & Solid Waste', 'SANIT', 'Trash2', 'sanitation@corporation.gov.in', '+91 422 2300103', 24],
      ['Electricity & Street Lighting (TNEB)', 'ELEC', 'Zap', 'electricity@tneb.gov.in', '+91 422 2300104', 12],
      ['Police & Public Safety', 'POLICE', 'ShieldAlert', 'safety@police.gov.in', '100', 4],
      ['Fire & Rescue Services', 'FIRE', 'Flame', 'fire@rescue.gov.in', '101', 2],
      ['Public Health & Pollution', 'HEALTH', 'HeartPulse', 'health@corporation.gov.in', '+91 422 2300107', 48]
    ];

    for (const [name, code, icon, email, phone, sla] of depts) {
      await db.run(
        `INSERT INTO departments (name, code, icon, contact_email, contact_phone, sla_hours)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, code, icon, email, phone, sla]
      );
    }
    console.log(`✓ Inserted ${depts.length} departments.`);
  }

  // 2. Seed Staff
  const existingStaff = await db.all('SELECT COUNT(*) as count FROM staff');
  if (existingStaff[0].count === 0) {
    console.log('Seeding staff roster...');
    const staffMembers = [
      ['R. Muthukumar', 'STF-RDS-01', 1, 'Senior Highway Inspector', '+91 94431 10201', 'muthu.k@cbe.gov.in', 1, 3],
      ['P. Anbarasan', 'STF-RDS-02', 1, 'Ward Road Engineer', '+91 94431 10202', 'anbu.p@cbe.gov.in', 1, 2],
      ['K. Senthil Nathan', 'STF-WTR-01', 2, 'Pipeline Executive Engineer', '+91 94431 10301', 'senthil.n@cbe.gov.in', 1, 4],
      ['V. Meenakshi', 'STF-WTR-02', 2, 'Drainage Network Officer', '+91 94431 10302', 'meena.v@cbe.gov.in', 1, 1],
      ['M. Ganesan', 'STF-SNT-01', 3, 'Sanitary Supervisor North', '+91 94431 10401', 'ganesan.m@cbe.gov.in', 1, 2],
      ['S. Revathi', 'STF-SNT-02', 3, 'Sanitary Supervisor Central', '+91 94431 10402', 'revathi.s@cbe.gov.in', 1, 2],
      ['T. Rajesh Kannan', 'STF-ELC-01', 4, 'Assistant Engineer TNEB', '+91 94431 10501', 'rajesh.k@tneb.gov.in', 1, 2],
      ['D. Vignesh', 'STF-ELC-02', 4, 'Emergency Line Inspector', '+91 94431 10502', 'vignesh.d@tneb.gov.in', 1, 1],
      ['Inspector J. Arumugam', 'STF-POL-01', 5, 'Special Civic Duty Inspector', '+91 94431 10601', 'arumugam@police.gov.in', 1, 1],
      ['Station Officer K. Velusamy', 'STF-FIR-01', 6, 'Station Fire Officer', '+91 94431 10701', 'velusamy@fire.gov.in', 1, 0]
    ];

    for (const [name, code, deptId, role, phone, email, isAvail, cases] of staffMembers) {
      await db.run(
        `INSERT INTO staff (name, employee_code, department_id, role, phone, email, is_available, active_cases)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, code, deptId, role, phone, email, isAvail, cases]
      );
    }
    console.log(`✓ Inserted ${staffMembers.length} staff members.`);
  }

  // 3. Seed Admin
  const existingAdmin = await db.get('SELECT * FROM admins WHERE username = ?', ['admin']);
  if (!existingAdmin) {
    console.log('Seeding default administrator...');
    const hash = await bcrypt.hash('admin123', 10);
    await db.run(
      `INSERT INTO admins (username, password_hash, full_name, role)
       VALUES (?, ?, ?, ?)`,
      ['admin', hash, 'Commander K. Soundararajan', 'Chief Municipal Controller']
    );
    console.log('✓ Inserted default admin: admin / admin123');
  }

  // 4. Safe migration for complaints table columns
  try {
    const tableInfo = await db.all("PRAGMA table_info(complaints)");
    const existingCols = new Set(tableInfo.map(c => c.name));
    const colsToAdd = [
      { name: 'raw_location_text', type: 'TEXT' },
      { name: 'canonical_location_name', type: 'TEXT' },
      { name: 'location_id', type: 'TEXT' },
      { name: 'taluk', type: 'TEXT' },
      { name: 'street', type: 'TEXT' },
      { name: 'location_precision', type: "TEXT DEFAULT 'APPROXIMATE'" }
    ];

    for (const col of colsToAdd) {
      if (!existingCols.has(col.name)) {
        console.log(`Adding column ${col.name} to complaints table...`);
        await db.run(`ALTER TABLE complaints ADD COLUMN ${col.name} ${col.type}`);
      }
    }
  } catch (err) {
    console.warn('Note on complaints column migration:', err.message);
  }

  // 5. Seed Coimbatore Master Locations
  const { COIMBATORE_LOCATIONS } = require('./coimbatoreLocations');
  const existingLocations = await db.all('SELECT COUNT(*) as count FROM locations');
  if (existingLocations[0].count < COIMBATORE_LOCATIONS.length) {
    console.log(`Seeding ${COIMBATORE_LOCATIONS.length} master Coimbatore locations...`);
    for (const loc of COIMBATORE_LOCATIONS) {
      await db.run(
        `INSERT OR REPLACE INTO locations (
           location_id, canonical_name, display_name, location_type,
           revenue_division, taluk, parent_location_id, aliases,
           tamil_name, tanglish_variants, latitude, longitude, geocoding_status
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          loc.location_id,
          loc.canonical_name,
          loc.display_name,
          loc.location_type || 'Locality',
          loc.revenue_division || 'Coimbatore South',
          loc.taluk || 'Coimbatore South',
          loc.parent_location_id || null,
          JSON.stringify(loc.aliases || []),
          loc.tamil_name || null,
          JSON.stringify(loc.tanglish_variants || []),
          loc.latitude,
          loc.longitude,
          loc.geocoding_status || 'VERIFIED'
        ]
      );
    }
    console.log(`✓ Successfully seeded ${COIMBATORE_LOCATIONS.length} Coimbatore locations into locations table.`);
  }

  // 6. Seed Coimbatore Landmarks
  const landmarkService = require('../services/landmarkService');
  await landmarkService.seedLandmarksDatabase();

  // Reset active cases to 0
  await db.run('UPDATE staff SET active_cases = 0');

  console.log('✓ Database initialized cleanly with 0 complaints. Ready for real citizen voice reporting.');
  console.log('--- VOXENTRA Database Seeding Complete ---');
}

if (require.main === module) {
  seed().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}

module.exports = seed;
