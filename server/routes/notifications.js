const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const notifications = await db.all(`
      SELECT n.*, c.category, c.area_name, c.priority, c.status as complaint_status
      FROM notifications n
      LEFT JOIN complaints c ON n.complaint_id = c.id
      ORDER BY n.created_at DESC
      LIMIT ?
    `, [limit]);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
