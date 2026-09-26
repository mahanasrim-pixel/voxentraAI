const express = require('express');
const router = express.Router();
const complaintService = require('../services/complaintService');

// Get all complaints with filters
router.get('/', async (req, res) => {
  try {
    const { status, priority, departmentId, area, search, limit } = req.query;
    const complaints = await complaintService.getComplaints({
      status,
      priority,
      departmentId,
      area,
      search,
      limit
    });
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single complaint
router.get('/:id', async (req, res) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create complaint
router.post('/', async (req, res) => {
  try {
    const newComplaint = await complaintService.createComplaint(req.body);
    res.status(201).json(newComplaint);
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update complaint status / priority / department / staff assignment
router.patch('/:id', async (req, res) => {
  try {
    const actor = req.body.actor || 'Municipal Controller';
    const updated = await complaintService.updateComplaint(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get duplicate / related complaints
router.get('/:id/duplicates', async (req, res) => {
  try {
    const duplicates = await complaintService.findDuplicates(req.params.id);
    res.json(duplicates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
