import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Building2, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Flame, 
  Copy,
  ChevronRight,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import { sseClient } from '../services/sse';

export default function ComplaintDetailDrawer({ 
  complaintId, 
  onClose, 
  onUpdated, 
  onReviewDuplicates,
  externalNote,
  updatedComplaint
}) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!complaintId) return;
    setLoading(true);
    setSuccessMsg('');
    Promise.all([
      api.getComplaintById(complaintId),
      api.getDepartments(),
      api.getStaff()
    ]).then(([comp, depts, staff]) => {
      setComplaint(comp);
      setDepartments(depts);
      setStaffList(staff);
      setSelectedStatus(comp.status);
      setSelectedStaff(comp.assigned_staff_id || '');
      setSelectedPriority(comp.priority);
      setSelectedDept(comp.department_id || '');
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [complaintId]);

  // When an external note is applied (e.g. from Link as Related in Check Duplicates)
  useEffect(() => {
    if (externalNote) {
      setCustomNote(externalNote);
    }
  }, [externalNote]);

  // When an updated complaint is passed from Duplicate Review Modal
  useEffect(() => {
    if (updatedComplaint && updatedComplaint.id === complaintId) {
      setComplaint(updatedComplaint);
      const latestTimeline = updatedComplaint.timeline?.[updatedComplaint.timeline.length - 1];
      const noteToShow = latestTimeline?.notes || externalNote;
      if (noteToShow) {
        setCustomNote(noteToShow);
      }
      const recipientPhone = updatedComplaint.citizen_phone || complaint?.citizen_phone || '';
      setSuccessMsg(`✓ Linked with related ticket! Citizen SMS dispatched to ${recipientPhone}: "${noteToShow || ''}"`);
    }
  }, [updatedComplaint, complaintId]);

  // Real-time SSE updates for the active complaint
  useEffect(() => {
    if (!complaintId) return;

    const unsubComplaint = sseClient.subscribe('complaint_updated', (updated) => {
      if (updated && updated.id === complaintId) {
        setComplaint(updated);
        const latestTimeline = updated.timeline?.[updated.timeline.length - 1];
        if (latestTimeline?.notes && latestTimeline.notes.startsWith('Linked to related ticket')) {
          setCustomNote(latestTimeline.notes);
          setSuccessMsg(`✓ Linked ticket update saved & Citizen SMS dispatched to ${updated.citizen_phone || ''}: "${latestTimeline.notes}"`);
        }
      }
    });

    const unsubSms = sseClient.subscribe('sms_dispatched', (notif) => {
      if (notif && notif.complaint_id === complaintId) {
        setComplaint(prev => {
          if (!prev) return prev;
          const notifs = prev.notifications || [];
          if (notifs.some(n => n.id === notif.id)) return prev;
          return {
            ...prev,
            notifications: [notif, ...notifs]
          };
        });
      }
    });

    return () => {
      unsubComplaint();
      unsubSms();
    };
  }, [complaintId]);

  if (!complaintId) return null;

  const handleUpdate = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const updates = {
        status: selectedStatus,
        priority: selectedPriority,
        departmentId: selectedDept ? Number(selectedDept) : null,
        assignedStaffId: selectedStaff ? Number(selectedStaff) : null,
        dispatchSms: true
      };
      if (customNote.trim()) {
        updates.notes = customNote.trim();
      }

      const updated = await api.updateComplaint(complaint.id, updates);
      setComplaint(updated);
      setCustomNote('');
      setSuccessMsg(`✓ Changes saved & Citizen SMS dispatched to ${updated.citizen_phone || complaint.citizen_phone}`);
      setTimeout(() => setSuccessMsg(''), 4500);
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      console.error('Error updating complaint:', err);
      alert('Error updating complaint: ' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { key: 'received', label: 'Received' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' }
  ];

  const getStepIndex = (st) => {
    if (st === 'received') return 0;
    if (st === 'assigned') return 1;
    if (st === 'in_progress') return 2;
    if (st === 'resolved') return 3;
    return 0;
  };

  const currentStepIdx = complaint ? getStepIndex(complaint.status) : 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '540px',
      maxWidth: '100vw',
      backgroundColor: 'var(--bg-card)',
      borderLeft: '1px solid var(--border-card)',
      boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.65)',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(16px)'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-deep)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span className="mono" style={{ fontSize: '18px', fontWeight: '700', color: 'var(--cyan)' }}>
              {complaint ? complaint.id : 'Loading...'}
            </span>
            {complaint && (
              <span className={`status-pill ${complaint.priority}`}>
                {complaint.priority.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Reported: {complaint ? new Date(complaint.created_at).toLocaleString() : ''}
          </div>
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading complaint details...
        </div>
      ) : complaint ? (
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Status Stepper */}
          <div style={{
            background: 'var(--bg-deep)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase' }}>
              Resolution Progress Workflow
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {steps.map((st, idx) => {
                const isDone = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={st.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isDone ? (isCurrent ? 'var(--cyan)' : 'var(--success)') : 'var(--bg-surface)',
                      color: isDone ? '#06090E' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      boxShadow: isCurrent ? '0 0 12px var(--cyan)' : 'none'
                    }}>
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <span style={{ fontSize: '10px', color: isCurrent ? '#fff' : 'var(--text-muted)', fontWeight: isCurrent ? 600 : 400 }}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Speech & Smart Understanding */}
          <div style={{
            background: 'var(--bg-deep)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Speech-to-Text & AI Normalization
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)' }}>
                Lang: {complaint.detected_language}
              </span>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Raw Voice Transcript:</div>
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '6px', marginTop: '4px' }}>
                "{complaint.original_transcript}"
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--cyan)' }}>Normalized / Understood Meaning:</div>
              <div style={{ fontSize: '13px', color: '#fff', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '8px', borderRadius: '6px', marginTop: '4px' }}>
                "{complaint.normalized_text}"
              </div>
            </div>
          </div>

          {/* Category & Location Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-deep)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Category</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{complaint.category}</div>
            </div>

            <div style={{ background: 'var(--bg-deep)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Area / Ward</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{complaint.area_name}</div>
            </div>

            <div style={{ background: 'var(--bg-deep)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Landmark</div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{complaint.landmark || 'Not specified'}</div>
            </div>

            <div style={{ background: 'var(--bg-deep)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Citizen Phone</div>
              <div className="mono" style={{ fontSize: '13px', color: 'var(--cyan)' }}>{complaint.citizen_phone}</div>
            </div>
          </div>

          {/* Action & Assignment Form */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '10px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Command Actions & Routing
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Update Status
                </label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="received">Received</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Priority Override
                </label>
                <select 
                  value={selectedPriority} 
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="emergency">Emergency (🔴)</option>
                  <option value="high">High (🟠)</option>
                  <option value="medium">Medium (🟡)</option>
                  <option value="normal">Normal (🟢)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Route Department
                </label>
                <select 
                  value={selectedDept} 
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Assign Field Staff
                </label>
                <select 
                  value={selectedStaff} 
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">Unassigned</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Operational Note (included in citizen SMS update)
              </label>
              <input 
                type="text"
                placeholder="e.g. Road inspection team en route; patch materials loaded."
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary" 
                onClick={handleUpdate}
                disabled={saving}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {saving ? (
                  <>
                    <span className="pulse-indicator" style={{ width: '8px', height: '8px' }}></span>
                    <span>Saving & Dispatching SMS...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Save & Dispatch Citizen SMS</span>
                  </>
                )}
              </button>

              <button 
                className="btn-secondary"
                onClick={() => onReviewDuplicates(complaint.id)}
                title="Review duplicate or related complaints"
              >
                <Copy size={16} />
                <span>Check Duplicates</span>
              </button>
            </div>

            {successMsg && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'rgba(0, 229, 153, 0.12)',
                border: '1px solid rgba(0, 229, 153, 0.4)',
                borderRadius: '6px',
                color: 'var(--success)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: 'fade-in 0.3s ease'
              }}>
                <CheckCircle size={16} />
                <span>{successMsg}</span>
              </div>
            )}
          </div>

          {/* Timeline Audit Trail */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '10px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
              <span>Operational Audit Timeline</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'none' }}>Newest first</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[...(complaint.timeline || [])].reverse().map((t, idx) => (
                <div key={idx} style={{
                  padding: '10px 12px',
                  background: 'var(--bg-deep)',
                  borderLeft: '3px solid var(--cyan)',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    <strong style={{ color: '#fff' }}>{t.actor}</strong>
                    <span className="mono" style={{ fontSize: '10px' }}>
                      {new Date(t.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>{t.notes}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatched SMS Logs */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '10px', textTransform: 'uppercase' }}>
              Dispatched Citizen Notifications
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(complaint.notifications || []).map((n, idx) => (
                <div key={idx} style={{
                  padding: '10px',
                  background: 'rgba(0, 240, 255, 0.04)',
                  border: '1px solid rgba(0, 240, 255, 0.15)',
                  borderRadius: '6px',
                  fontSize: '11px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cyan)', marginBottom: '4px' }}>
                    <span className="mono">SMS to {n.recipient_phone}</span>
                    <span className="mono" style={{ color: 'var(--success)' }}>[DELIVERED]</span>
                  </div>
                  <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.message}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
}
