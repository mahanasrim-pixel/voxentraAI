const express = require('express');
const router = express.Router();
const hotspotService = require('../services/hotspotService');

router.get('/', async (req, res) => {
  try {
    const { category, priority, departmentId, area } = req.query;
    const hotspots = await hotspotService.getHotspots({
      category,
      priority,
      departmentId,
      area
    });
    res.json(hotspots);
  } catch (err) {
    console.error('Error fetching hotspots:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
