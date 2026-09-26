const express = require('express');
const router = express.Router();
const { addClient } = require('../services/sseService');

router.get('/pulse', (req, res) => {
  addClient(req, res);
});

module.exports = router;
