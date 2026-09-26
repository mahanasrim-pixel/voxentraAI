const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all staff
router.get('/', async (req, res) => {
  try {
    const { departmentId } = req.query;
    let sql = `
      SELECT s.*, d.name as department_name, d.code as department_code,
             COUNT(c.id) as current_assigned_cases
      FROM staff s
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN complaints c ON c.assigned_staff_id = s.id AND c.status IN ('assigned', 'in_progress')
    `;
    const params = [];

    if (departmentId && departmentId !== 'all') {
      sql += ` WHERE s.department_id = ?`;
      params.push(departmentId);
    }

    sql += ` GROUP BY s.id ORDER BY s.name ASC`;

    const staffMembers = await db.all(sql, params);
    res.json(staffMembers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new staff member
router.post('/', async (req, res) => {
  try {
    const { name, departmentId, role, phone, email } = req.body;
    if (!name || !departmentId) {
      return res.status(400).json({ error: 'Name and department are required' });
    }

    // Generate employee code: STF-DEP-XX
    const dept = await db.get('SELECT code FROM departments WHERE id = ?', [departmentId]);
    const deptCode = dept ? dept.code : 'GEN';
    const randNum = Math.floor(10 + Math.random() * 90);
    const employeeCode = `STF-${deptCode}-${randNum}`;

    const result = await db.run(
      `INSERT INTO staff (name, employee_code, department_id, role, phone, email)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, employeeCode, departmentId, role || 'Field Inspector', phone || '', email || '']
    );

    const created = await db.get(
      `SELECT s.*, d.name as department_name FROM staff s
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = ?`,
      [result.lastID]
    );

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
