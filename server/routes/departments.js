const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const departments = await db.all(`
      SELECT 
        d.*,
        COUNT(DISTINCT s.id) as staff_count,
        SUM(CASE WHEN c.status IN ('received', 'assigned', 'in_progress') THEN 1 ELSE 0 END) as active_complaints,
        SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) as resolved_complaints
      FROM departments d
      LEFT JOIN staff s ON s.department_id = d.id
      LEFT JOIN complaints c ON c.department_id = d.id
      GROUP BY d.id
      ORDER BY d.id ASC
    `);
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
