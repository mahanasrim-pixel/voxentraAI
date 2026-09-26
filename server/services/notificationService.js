/**
 * VOXENTRA Notification Service
 * Abstracted SMS architecture with Twilio provider integration and development mock dispatcher.
 */

const db = require('../db/connection');
const config = require('../config');
const { broadcast } = require('./sseService');

class NotificationService {
  constructor() {
    this.provider = config.sms.provider;
    this.twilioClient = null;

    if (this.provider === 'twilio' && config.sms.accountSid && config.sms.authToken) {
      try {
        const twilio = require('twilio');
        this.twilioClient = twilio(config.sms.accountSid, config.sms.authToken);
        console.log('✓ Twilio SMS Provider initialized.');
      } catch (err) {
        console.warn('Twilio package not available or misconfigured. Falling back to Mock mode.', err.message);
        this.provider = 'mock';
      }
    } else {
      this.provider = 'mock';
    }
  }

  async sendSMS(complaintId, recipientPhone, message, triggerEvent = 'generic') {
    let status = 'delivered';
    let providerResponse = 'MOCK_DISPATCH_SUCCESS';

    if (this.provider === 'twilio' && this.twilioClient) {
      try {
        const res = await this.twilioClient.messages.create({
          body: message,
          from: config.sms.phoneNumber,
          to: recipientPhone
        });
        status = res.status;
        providerResponse = `Twilio SID: ${res.sid}`;
      } catch (err) {
        console.error('Failed to send Twilio SMS:', err.message);
        status = 'failed';
        providerResponse = `Error: ${err.message}`;
      }
    } else {
      // Mock / Development mode: clean log record
      console.log(`\n================== [MOCK SMS DISPATCH] ==================`);
      console.log(`Trigger:   ${triggerEvent.toUpperCase()}`);
      console.log(`To:        ${recipientPhone}`);
      console.log(`Complaint: ${complaintId}`);
      console.log(`Message:   "${message}"`);
      console.log(`Status:    SIMULATED_DELIVERY (Development Mode)`);
      console.log(`=========================================================\n`);
      providerResponse = 'Development Mock Dispatcher (Delivered locally)';
    }

    // Record in SQLite database for admin audit & citizen timeline
    const result = await db.run(
      `INSERT INTO notifications (complaint_id, recipient_phone, channel, message, status, provider_response)
       VALUES (?, ?, 'sms', ?, ?, ?)`,
      [complaintId, recipientPhone, message, status, providerResponse]
    );

    const notificationRecord = {
      id: result.lastID,
      complaint_id: complaintId,
      recipient_phone: recipientPhone,
      channel: 'sms',
      message,
      status,
      provider_response: providerResponse,
      created_at: new Date().toISOString()
    };

    // Broadcast live notification event to admin dashboard
    broadcast('sms_dispatched', notificationRecord);

    return notificationRecord;
  }

  async notifyRegistration(complaint) {
    const text = `VOXENTRA: Your civic complaint ${complaint.id} for "${complaint.category}" at ${complaint.area_name} is registered. Priority: ${complaint.priority.toUpperCase()}. Our team is actively addressing it.`;
    return this.sendSMS(complaint.id, complaint.citizen_phone, text, 'registration');
  }

  async notifyAssignment(complaint, staffName, departmentName) {
    const text = `VOXENTRA Update: Complaint ${complaint.id} has been assigned to ${staffName} (${departmentName}). Field inspection will commence shortly.`;
    return this.sendSMS(complaint.id, complaint.citizen_phone, text, 'assignment');
  }

  async notifyStatusChange(complaint, newStatus, notes = '') {
    const statusLabels = {
      in_progress: 'IN PROGRESS - Field crew on site',
      resolved: 'RESOLVED - Issue rectified and verified',
      rejected: 'CLOSED - Duplicate / Addressed by prior ticket'
    };
    const statusText = statusLabels[newStatus] || newStatus.toUpperCase();
    const text = `VOXENTRA Update: Status for Complaint ${complaint.id} is now ${statusText}. ${notes ? `Note: ${notes}` : ''}`;
    return this.sendSMS(complaint.id, complaint.citizen_phone, text, 'status_update');
  }
}

module.exports = new NotificationService();
