/**
 * VOXENTRA Complaint Service
 * Handles complaint creation, unique ID generation (VX20260925XXX),
 * duplicate detection, timeline auditing, and status lifecycle.
 */

const db = require('../db/connection');
const notificationService = require('./notificationService');
const { broadcast } = require('./sseService');

class ComplaintService {
  // Generate unique complaint ID: VX + YYYYMMDD + 3-digit sequence
  async generateComplaintId() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `VX${dateStr}`;

    const latest = await db.get(
      `SELECT id FROM complaints WHERE id LIKE ? ORDER BY id DESC LIMIT 1`,
      [`${prefix}%`]
    );

    let nextNum = 1;
    if (latest && latest.id) {
      const currentSeq = parseInt(latest.id.replace(prefix, ''), 10);
      if (!isNaN(currentSeq)) {
        nextNum = currentSeq + 1;
      }
    }

    return `${prefix}${String(nextNum).padStart(3, '0')}`;
  }

  // Create new complaint
  async createComplaint(payload) {
    const complaintId = payload.id || await this.generateComplaintId();
    const citizenPhone = payload.citizenPhone || '+91 98421 55678';
    const citizenName = payload.citizenName || 'Citizen';
    const originalTranscript = payload.originalTranscript || '';
    const normalizedText = payload.normalizedText || originalTranscript;
    const detectedLanguage = payload.detectedLanguage || 'Tanglish';
    const category = payload.category || 'Other Civic Issue';
    const description = payload.description || normalizedText;
    const spokenLocation = payload.spokenLocation || payload.areaName || 'General Zone';
    const landmark = payload.landmark || null;
    const areaName = payload.areaName || spokenLocation;
    const latitude = payload.latitude || null;
    const longitude = payload.longitude || null;
    const priority = payload.priority || 'medium';
    const departmentId = payload.departmentId || 1;
    const assignedStaffId = payload.assignedStaffId || null;
    const clarificationNeeded = payload.clarificationNeeded ? 1 : 0;
    const clarificationNotes = payload.clarificationNotes || null;
    const confidenceScore = payload.confidenceScore || 0.95;
    const rawLocationText = payload.rawLocationText || payload.spokenLocation || payload.areaName || 'Coimbatore';
    const canonicalLocationName = payload.canonicalLocationName || payload.areaName || 'Coimbatore Area';
    const locationId = payload.locationId || null;
    const taluk = payload.taluk || null;
    const street = payload.street || null;
    const locationPrecision = payload.locationPrecision || (street && landmark ? 'STREET' : landmark ? 'NEAR_LANDMARK' : street ? 'STREET' : 'AREA');
    const source = payload.source || 'voice';

    await db.run(
      `INSERT INTO complaints (
        id, citizen_phone, citizen_name, original_transcript, normalized_text,
        detected_language, category, description, spoken_location, raw_location_text,
        canonical_location_name, location_id, taluk, street, landmark, area_name,
        location_precision, latitude, longitude, priority, department_id, assigned_staff_id,
        status, clarification_needed, clarification_notes, confidence_score, source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?, ?, ?)`,
      [
        complaintId, citizenPhone, citizenName, originalTranscript, normalizedText,
        detectedLanguage, category, description, spokenLocation, rawLocationText,
        canonicalLocationName, locationId, taluk, street, landmark, areaName,
        locationPrecision, latitude, longitude, priority, departmentId, assignedStaffId,
        clarificationNeeded, clarificationNotes, confidenceScore, source
      ]
    );

    // Initial timeline entry
    await db.run(
      `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
       VALUES (?, 'received', 'VOXENTRA Voice Engine', 'Citizen voice call processed, classified as ' || ? || ' at ' || ?)`,
      [complaintId, category, areaName]
    );

    // Fetch newly created record with department metadata
    const createdComplaint = await this.getComplaintById(complaintId);

    // Send SMS Notification
    await notificationService.notifyRegistration(createdComplaint);

    // Real-time broadcast
    broadcast('new_complaint', createdComplaint);
    if (priority === 'emergency') {
      broadcast('emergency_alert', {
        id: complaintId,
        category,
        areaName,
        message: `EMERGENCY ALERT: New critical issue reported at ${areaName}: ${category}`
      });
    }

    return createdComplaint;
  }

  // Get single complaint with full details, department, staff, timeline
  async getComplaintById(id) {
    const complaint = await db.get(
      `SELECT c.*, 
              d.name as department_name, d.code as department_code, d.sla_hours,
              s.name as staff_name, s.phone as staff_phone, s.role as staff_role
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN staff s ON c.assigned_staff_id = s.id
       WHERE c.id = ?`,
      [id]
    );

    if (!complaint) return null;

    const timeline = await db.all(
      `SELECT * FROM complaint_timeline WHERE complaint_id = ? ORDER BY created_at ASC, id ASC`,
      [id]
    );

    const notifications = await db.all(
      `SELECT * FROM notifications WHERE complaint_id = ? ORDER BY created_at DESC, id DESC`,
      [id]
    );

    return {
      ...complaint,
      timeline,
      notifications
    };
  }

  // Query complaints with filters
  async getComplaints(filters = {}) {
    let sql = `
      SELECT c.*, 
             d.name as department_name, d.code as department_code,
             s.name as staff_name, s.phone as staff_phone
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      LEFT JOIN staff s ON c.assigned_staff_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status && filters.status !== 'all') {
      sql += ` AND c.status = ?`;
      params.push(filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      sql += ` AND c.priority = ?`;
      params.push(filters.priority);
    }

    if (filters.departmentId && filters.departmentId !== 'all') {
      sql += ` AND c.department_id = ?`;
      params.push(filters.departmentId);
    }

    if (filters.area && filters.area !== 'all') {
      sql += ` AND (c.area_name LIKE ? OR c.canonical_location_name LIKE ?)`;
      params.push(`%${filters.area}%`, `%${filters.area}%`);
    }

    if (filters.taluk && filters.taluk !== 'all') {
      sql += ` AND c.taluk = ?`;
      params.push(filters.taluk);
    }

    if (filters.precision && filters.precision !== 'all') {
      sql += ` AND c.location_precision = ?`;
      params.push(filters.precision);
    }

    if (filters.search) {
      sql += ` AND (c.id LIKE ? OR c.description LIKE ? OR c.spoken_location LIKE ? OR c.canonical_location_name LIKE ? OR c.taluk LIKE ? OR c.citizen_phone LIKE ?)`;
      const query = `%${filters.search}%`;
      params.push(query, query, query, query, query, query);
    }

    sql += ` ORDER BY c.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT ?`;
      params.push(parseInt(filters.limit, 10));
    }

    return db.all(sql, params);
  }

  // Find duplicate or related complaints
  async findDuplicates(complaintId) {
    const current = await db.get(`SELECT * FROM complaints WHERE id = ?`, [complaintId]);
    if (!current) return [];

    // Query complaints in same area or with matching category within 7 days
    const candidates = await db.all(
      `SELECT c.*, d.name as department_name, s.name as staff_name
       FROM complaints c
       LEFT JOIN departments d ON c.department_id = d.id
       LEFT JOIN staff s ON c.assigned_staff_id = s.id
       WHERE c.id != ? 
         AND (c.area_name = ? OR c.category = ?)
         AND c.created_at >= datetime(?, '-7 days')
       ORDER BY c.created_at DESC
       LIMIT 6`,
      [complaintId, current.area_name, current.category, current.created_at]
    );

    // Score similarity
    return candidates.map(c => {
      let score = 0;
      let reasons = [];

      if (c.area_name && current.area_name && c.area_name.toLowerCase() === current.area_name.toLowerCase()) {
        score += 45;
        reasons.push(`Same municipal zone (${c.area_name})`);
      }

      if (c.category === current.category) {
        score += 40;
        reasons.push(`Identical civic category (${c.category})`);
      }

      // Proximity check if lat/lng available
      if (c.latitude && current.latitude && c.longitude && current.longitude) {
        const distKm = this.calculateDistanceKm(c.latitude, c.longitude, current.latitude, current.longitude);
        if (distKm < 0.5) {
          score += 25;
          reasons.push(`Close proximity (~${(distKm * 1000).toFixed(0)}m away)`);
        }
      }

      return {
        ...c,
        similarityScore: Math.min(100, score),
        reasons
      };
    }).filter(c => c.similarityScore >= 40);
  }

  calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Update status or assignment
  async updateComplaint(id, updates, actor = 'Municipal Controller') {
    const current = await this.getComplaintById(id);
    if (!current) throw new Error('Complaint not found');

    const fields = [];
    const params = [];
    let smsDispatched = false;

    // 1. Status Update
    if (updates.status && updates.status !== current.status) {
      fields.push('status = ?');
      params.push(updates.status);

      if (updates.status === 'resolved') {
        fields.push('resolved_at = datetime("now")');
      }

      // Timeline entry
      await db.run(
        `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
         VALUES (?, ?, ?, ?)`,
        [id, updates.status, actor, updates.notes || `Status changed to ${updates.status.toUpperCase()}`]
      );

      // Notify citizen via SMS
      await notificationService.notifyStatusChange(current, updates.status, updates.notes);
      smsDispatched = true;
    }

    // 2. Priority Override
    if (updates.priority && updates.priority !== current.priority) {
      fields.push('priority = ?');
      params.push(updates.priority);

      await db.run(
        `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
         VALUES (?, ?, ?, ?)`,
        [id, updates.status || current.status, actor, `Priority adjusted from ${current.priority.toUpperCase()} to ${updates.priority.toUpperCase()}`]
      );
    }

    // 3. Department Rerouting
    if (updates.departmentId && Number(updates.departmentId) !== Number(current.department_id)) {
      fields.push('department_id = ?');
      params.push(Number(updates.departmentId));

      const dept = await db.get('SELECT * FROM departments WHERE id = ?', [Number(updates.departmentId)]);
      await db.run(
        `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
         VALUES (?, ?, ?, ?)`,
        [id, updates.status || current.status, actor, `Department rerouted to ${dept ? dept.name : `Dept ID ${updates.departmentId}`}`]
      );
    }

    // 4. Staff Assignment
    if (updates.assignedStaffId !== undefined && updates.assignedStaffId !== current.assigned_staff_id) {
      const newStaffId = updates.assignedStaffId ? Number(updates.assignedStaffId) : null;
      fields.push('assigned_staff_id = ?');
      params.push(newStaffId);

      if (newStaffId && current.status === 'received' && (!updates.status || updates.status === 'received')) {
        fields.push('status = "assigned"');
        updates.status = 'assigned';
      }

      if (newStaffId) {
        const staff = await db.get('SELECT * FROM staff WHERE id = ?', [newStaffId]);
        const dept = await db.get('SELECT * FROM departments WHERE id = ?', [updates.departmentId || current.department_id]);

        await db.run(
          `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
           VALUES (?, ?, ?, ?)`,
          [id, updates.status || current.status, actor, `Assigned to ${staff ? staff.name : 'Field Staff'}`]
        );

        await db.run('UPDATE staff SET active_cases = active_cases + 1 WHERE id = ?', [newStaffId]);

        if (staff && !smsDispatched) {
          await notificationService.notifyAssignment(current, staff.name, dept ? dept.name : 'Field Services');
          smsDispatched = true;
        }
      } else {
        await db.run(
          `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
           VALUES (?, ?, ?, ?)`,
          [id, updates.status || current.status, actor, `Unassigned from field staff`]
        );
      }
    }

    // 5. Custom Operational Note
    if (updates.notes && !smsDispatched) {
      await db.run(
        `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
         VALUES (?, ?, ?, ?)`,
        [id, updates.status || current.status, actor, updates.notes]
      );

      const text = `VOXENTRA Update: Regarding Complaint ${id} (${current.category} at ${current.area_name}): ${updates.notes}`;
      await notificationService.sendSMS(id, current.citizen_phone, text, 'operational_update');
      smsDispatched = true;
    }

    // 6. Explicit SMS Dispatch Request (e.g. from "Save & Dispatch Citizen SMS" button)
    if (updates.dispatchSms && !smsDispatched) {
      const currentDept = current.department_name || 'Municipal Operations';
      const currentStatus = (updates.status || current.status).replace('_', ' ').toUpperCase();
      const text = `VOXENTRA Update: Complaint ${id} (${current.category} at ${current.area_name}) is currently ${currentStatus} under ${currentDept}. Our teams are monitoring progress.`;
      await notificationService.sendSMS(id, current.citizen_phone, text, 'manual_dispatch');
      
      await db.run(
        `INSERT INTO complaint_timeline (complaint_id, status, actor, notes)
         VALUES (?, ?, ?, ?)`,
        [id, updates.status || current.status, actor, `Citizen status SMS dispatched to ${current.citizen_phone}`]
      );
      smsDispatched = true;
    }

    if (fields.length > 0) {
      fields.push('updated_at = datetime("now")');
      params.push(id);
      await db.run(`UPDATE complaints SET ${fields.join(', ')} WHERE id = ?`, params);
    }

    const updated = await this.getComplaintById(id);
    broadcast('complaint_updated', updated);
    return updated;
  }
}

module.exports = new ComplaintService();
