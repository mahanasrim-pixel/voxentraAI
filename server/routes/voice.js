const express = require('express');
const router = express.Router();
const { processConversationTurn, clearSessionState, getSessionState } = require('../ai/conversationEngine');
const complaintService = require('../services/complaintService');
const db = require('../db/connection');

// Voice interaction endpoint (conversational turn)
router.post('/interact', async (req, res) => {
  const startTime = Date.now();
  try {
    const { sessionId, utterance, phone, citizenName } = req.body;
    const activeSessionId = sessionId || 'SES-' + Date.now();

    if (!utterance || typeof utterance !== 'string') {
      return res.status(400).json({ error: 'Valid utterance string required' });
    }

    // Process turn through conversational AI
    const result = await processConversationTurn(activeSessionId, utterance, phone || '+91 98421 55678');
    let registeredComplaint = null;
    // Strict backend validation: Prevent premature complaint registration
    if (result.shouldRegister) {
      const p = result.complaintPayload;
      if (!p || !p.category || !p.areaName || result.stage !== 'REGISTERED' || !result.slots.confirmedByCitizen) {
        console.warn(`[SECURITY] Blocked premature complaint registration for session ${activeSessionId}. Confirmation or required fields incomplete.`);
        result.shouldRegister = false;
        result.reply = "Please confirm the complaint details before I can lodge it.";
      } else {
        if (citizenName) {
          result.complaintPayload.citizenName = citizenName;
        }
        registeredComplaint = await complaintService.createComplaint(result.complaintPayload);

        // Log AI telemetry metric
        await db.run(
          `INSERT INTO ai_metrics (session_id, complaint_id, input_text, detected_lang, clarification_asked, was_emergency, confidence, processing_time_ms)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            activeSessionId,
            registeredComplaint.id,
            utterance,
            result.currentConversationLanguage || result.detectedLanguage,
            0,
            result.slots.isEmergency ? 1 : 0,
            0.98,
            Date.now() - startTime
          ]
        );
      }
    }

    res.json({
      sessionId: activeSessionId,
      reply: result.reply,
      stage: result.stage,
      language: result.currentConversationLanguage,
      detectedLanguage: result.detectedLanguage,
      currentConversationLanguage: result.currentConversationLanguage,
      responseLanguage: result.responseLanguage,
      originalText: result.originalText,
      normalizedText: result.normalizedText,
      corrections: result.corrections,
      slots: result.slots,
      shouldRegister: result.shouldRegister,
      complaint: registeredComplaint,
      processingTimeMs: Date.now() - startTime
    });
  } catch (err) {
    console.error('Voice interaction error:', err);
    res.status(500).json({ error: 'Failed to process voice turn: ' + err.message });
  }
});

// Reset voice conversation session
router.post('/reset', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) {
    clearSessionState(sessionId);
  }
  res.json({ success: true, message: 'Session reset' });
});

// Get session state
router.get('/session/:id', (req, res) => {
  const state = getSessionState(req.params.id);
  res.json(state);
});

module.exports = router;
