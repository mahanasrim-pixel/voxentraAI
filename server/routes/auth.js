const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid administrator credentials' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid administrator credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role, fullName: admin.full_name },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        fullName: admin.full_name,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server authentication failed' });
  }
});

// Current Admin Info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const admin = await db.get('SELECT id, username, full_name, role, created_at FROM admins WHERE id = ?', [req.user.id]);
    if (!admin) {
      return res.status(404).json({ error: 'Admin record not found' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
