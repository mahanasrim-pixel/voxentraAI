/**
 * VOXENTRA Hotspots Service
 * Aggregates complaints by area & category to detect civic problem density.
 */

const db = require('../db/connection');

class HotspotService {
  async getHotspots(filters = {}) {
    let sql = `
      SELECT 
        COALESCE(c.canonical_location_name, c.area_name) as area_name,
        c.taluk,
        c.category,
        d.name as department_name,
        AVG(c.latitude) as avg_lat,
        AVG(c.longitude) as avg_lng,
        COUNT(c.id) as complaint_count,
        SUM(CASE WHEN c.priority = 'emergency' THEN 1 ELSE 0 END) as emergency_count,
        SUM(CASE WHEN c.priority = 'high' THEN 1 ELSE 0 END) as high_count,
        SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) as resolved_count,
        SUM(CASE WHEN c.status IN ('received', 'assigned', 'in_progress') THEN 1 ELSE 0 END) as active_count,
        MIN(c.created_at) as earliest_complaint,
        MAX(c.created_at) as latest_complaint
      FROM complaints c
      LEFT JOIN departments d ON c.department_id = d.id
      WHERE (c.canonical_location_name IS NOT NULL OR c.area_name IS NOT NULL)
    `;
    const params = [];

    if (filters.category && filters.category !== 'all') {
      sql += ` AND c.category = ?`;
      params.push(filters.category);
    }

    if (filters.priority && filters.priority !== 'all') {
      sql += ` AND c.priority = ?`;
      params.push(filters.priority);
    }

    if (filters.departmentId && filters.departmentId !== 'all') {
      sql += ` AND c.department_id = ?`;
      params.push(filters.departmentId);
    }

    if (filters.taluk && filters.taluk !== 'all') {
      sql += ` AND c.taluk = ?`;
      params.push(filters.taluk);
    }

    if (filters.area && filters.area !== 'all') {
      sql += ` AND (c.area_name LIKE ? OR c.canonical_location_name LIKE ?)`;
      params.push(`%${filters.area}%`, `%${filters.area}%`);
    }

    sql += `
      GROUP BY COALESCE(c.canonical_location_name, c.area_name), c.category
      ORDER BY complaint_count DESC, emergency_count DESC
    `;

    const rows = await db.all(sql, params);

    return rows.map((r, index) => {
      // Calculate severity risk index
      const severityScore = (r.complaint_count * 10) + (r.emergency_count * 25) + (r.high_count * 15);
      let riskLevel = 'Moderate';
      if (severityScore > 50 || r.emergency_count >= 2) riskLevel = 'Critical';
      else if (severityScore > 25) riskLevel = 'Elevated';

      return {
        id: `HS-${index + 1}`,
        areaName: r.area_name,
        category: r.category,
        departmentName: r.department_name,
        latitude: r.avg_lat,
        longitude: r.avg_lng,
        totalComplaints: r.complaint_count,
        emergencyCount: r.emergency_count,
        highPriorityCount: r.high_count,
        activeCount: r.active_count,
        resolvedCount: r.resolved_count,
        resolutionRate: r.complaint_count > 0 ? Math.round((r.resolved_count / r.complaint_count) * 100) : 0,
        riskLevel,
        headline: `${r.area_name} – ${r.complaint_count} ${r.category.toLowerCase()} reports`,
        lastReported: r.latest_complaint
      };
    });
  }
}

module.exports = new HotspotService();
