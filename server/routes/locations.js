const express = require('express');
const router = express.Router();
const locationService = require('../services/locationService');

// GET /api/locations - Get all Coimbatore master locations
router.get('/', async (req, res) => {
  try {
    const locations = await locationService.getAllLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve Coimbatore locations', message: err.message });
  }
});

// GET /api/locations/hierarchy - Grouped by Revenue Division and Taluk
router.get('/hierarchy', async (req, res) => {
  try {
    const hierarchy = await locationService.getHierarchy();
    res.json(hierarchy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve location hierarchy', message: err.message });
  }
});

// GET /api/locations/taluks - Distinct list of 11 taluks
router.get('/taluks', async (req, res) => {
  try {
    const locations = await locationService.getAllLocations();
    const taluks = Array.from(new Set(locations.map(l => l.taluk).filter(Boolean))).sort();
    res.json(taluks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve taluks', message: err.message });
  }
});

// GET /api/locations/landmarks - Get all Coimbatore master landmarks
router.get('/landmarks', async (req, res) => {
  try {
    const landmarks = await locationService.getAllLandmarks();
    res.json(landmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve Coimbatore landmarks', message: err.message });
  }
});

// POST /api/locations/resolve - Resolve text to canonical location
router.post('/resolve', (req, res) => {
  try {
    const { text, lang } = req.body;
    const resolved = locationService.resolveLocation(text, lang || 'Tanglish');
    res.json(resolved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve location', message: err.message });
  }
});

module.exports = router;
