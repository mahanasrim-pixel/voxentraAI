import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, ArrowRight, ShieldAlert, Link } from 'lucide-react';
import { api } from '../services/api';

export default function DuplicateReviewModal({ complaintId, onClose, onSelectComplaint, onUpdated, onApplyNote }) {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [actionStatus, setActionStatus] = useState({});
  const [globalSuccess, setGlobalSuccess] = useState('');

  useEffect(() => {
    if (!complaintId) return;
    setLoading(true);
    setGlobalSuccess('');
    setActionStatus({});
    Promise.all([
      api.getComplaintById(complaintId),
      api.getDuplicates(complaintId)
    ]).then(([target, dups]) => {
      setTargetComplaint(target);
      setDuplicates(dups);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [complaintId]);

  const handleLinkAsRelated = async (duplicate) => {
    setActionStatus(prev => ({ ...prev, [duplicate.id]: { loading: true } }));
    try {
      const linkNote = `Linked to related ticket ${duplicate.id} (${duplicate.category} at ${duplicate.area_name}). Field coordination synchronized.`;
      
      const updated = await api.updateComplaint(complaintId, {
        notes: linkNote,
        dispatchSms: true
      });

      const recipientPhone = updated.citizen_phone || targetComplaint?.citizen_phone || 'Citizen Phone';
      const successText = `✓ Successfully linked with ${duplicate.id}! Citizen SMS dispatched to ${recipientPhone}.`;
      
      setActionStatus(prev => ({ 
        ...prev, 
        [duplicate.id]: { 
          loading: false, 
          success: successText,
          message: linkNote,
          phone: recipientPhone
        } 
      }));
      setGlobalSuccess(`✓ Successfully linked with ${duplicate.id}! Citizen SMS dispatched: "${linkNote}"`);

      if (onUpdated) onUpdated(updated);
      if (onApplyNote) onApplyNote(linkNote, updated);

      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err) {
      console.error(err);
      setActionStatus(prev => ({ 
        ...prev, 
        [duplicate.id]: { loading: false, error: err.message } 
      }));
    }
  };

  const handleMarkAsDuplicate = async (duplicate) => {
    setActionStatus(prev => ({ ...prev, [duplicate.id]: { loading: true } }));
    try {
      const dupNote = `Marked as duplicate of master ticket ${duplicate.id}. Action consolidated under field team.`;
      
      const updated = await api.updateComplaint(complaintId, {
        status: 'resolved',
        notes: dupNote,
        dispatchSms: true
      });

      const recipientPhone = updated.citizen_phone || targetComplaint?.citizen_phone || 'Citizen Phone';
      const successText = `✓ Marked as duplicate of ${duplicate.id}! Resolved & Citizen SMS dispatched to ${recipientPhone}.`;

      setActionStatus(prev => ({ 
        ...prev, 
        [duplicate.id]: { 
          loading: false, 
          success: successText,
          message: dupNote,
          phone: recipientPhone
        } 
      }));
      setGlobalSuccess(`✓ Marked as duplicate of ${duplicate.id}! Citizen SMS dispatched: "${dupNote}"`);

      if (onUpdated) onUpdated(updated);
      if (onApplyNote) onApplyNote(dupNote, updated);

      setTimeout(() => {
        onClose();
      }, 3500);
    } catch (err) {
      console.error(err);
      setActionStatus(prev => ({ 
        ...prev, 
        [duplicate.id]: { loading: false, error: err.message } 
      }));
    }
  };

  if (!complaintId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-deep)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="var(--warning)" />
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Possible Related / Duplicate Complaints</h3>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Evaluating proximity, description overlap, and time window for <strong className="mono" style={{ color: 'var(--cyan)' }}>{complaintId}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {globalSuccess && (
            <div style={{
              marginBottom: '16px',
              padding: '12px 16px',
              background: 'rgba(0, 229, 153, 0.14)',
              border: '1px solid rgba(0, 229, 153, 0.5)',
              borderRadius: '8px',
              color: 'var(--success)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 0 16px rgba(0, 229, 153, 0.15)'
            }}>
              <CheckCircle size={18} />
              <span>{globalSuccess}</span>
            </div>
          )}

          {targetComplaint && (
            <div style={{
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Anchor Ticket Under Review
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--cyan)', marginRight: '10px' }}>
                    {targetComplaint.id}
                  </span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>
                    {targetComplaint.category} at {targetComplaint.area_name}
                  </span>
                </div>
                <span className={`status-pill ${targetComplaint.priority}`}>{targetComplaint.priority}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                "{targetComplaint.normalized_text}"
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
              Analyzing related spatial records...
            </div>
          ) : duplicates.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-deep)',
              borderRadius: '8px',
              border: '1px dashed var(--border-subtle)'
            }}>
              <CheckCircle size={32} color="var(--success)" style={{ margin: '0 auto 12px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>No Confirmed Duplicate Complaints</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                No active complaints with similar descriptions or nearby coordinates found in this zone.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {duplicates.length} Potential Match{duplicates.length > 1 ? 'es' : ''} Identified:
              </div>

              {duplicates.map(d => (
                <div key={d.id} style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>{d.id}</span>
                      <span className={`status-pill ${d.status}`}>{d.status}</span>
                      <span className={`status-pill ${d.priority}`}>{d.priority}</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255, 153, 0, 0.1)',
                      border: '1px solid rgba(255, 153, 0, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      color: 'var(--warning)',
                      fontWeight: 700
                    }}>
                      <span>{d.similarityScore}% Match</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                    <strong>{d.category}</strong> — {d.area_name} {d.landmark ? `(${d.landmark})` : ''}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    "{d.normalized_text}"
                  </div>

                  {/* Overlap Reasons */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                    {(d.reasons || []).map((r, ri) => (
                      <span key={ri} style={{
                        fontSize: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)'
                      }}>
                        • {r}
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => {
                        onClose();
                        onSelectComplaint(d.id);
                      }}
                    >
                      Inspect Ticket
                    </button>

                    <button 
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--warning)', borderColor: 'rgba(255, 153, 0, 0.4)' }}
                      onClick={() => handleMarkAsDuplicate(d)}
                      disabled={actionStatus[d.id]?.loading}
                    >
                      <ShieldAlert size={12} />
                      <span>{actionStatus[d.id]?.loading ? 'Processing...' : 'Mark Duplicate & Close'}</span>
                    </button>

                    <button 
                      className="btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleLinkAsRelated(d)}
                      disabled={actionStatus[d.id]?.loading}
                    >
                      <Link size={12} />
                      <span>{actionStatus[d.id]?.loading ? 'Linking...' : 'Link as Related'}</span>
                    </button>
                  </div>

                  {actionStatus[d.id]?.success && (
                    <div style={{
                      marginTop: '10px',
                      padding: '12px 14px',
                      background: 'rgba(0, 229, 153, 0.12)',
                      border: '1px solid rgba(0, 229, 153, 0.4)',
                      borderRadius: '6px',
                      color: 'var(--success)',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      animation: 'fade-in 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                          <CheckCircle size={16} />
                          <span>{actionStatus[d.id].success}</span>
                        </div>
                        <button 
                          className="btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '10px', color: '#fff', borderColor: 'var(--success)' }}
                          onClick={onClose}
                        >
                          View in Command Actions →
                        </button>
                      </div>

                      {actionStatus[d.id]?.message && (
                        <div style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          borderLeft: '3px solid var(--success)',
                          fontSize: '12px',
                          color: '#fff',
                          lineHeight: '1.4'
                        }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 600 }}>
                            Dispatched Citizen SMS & Operational Note:
                          </div>
                          <div style={{ wordBreak: 'break-word' }}>"{actionStatus[d.id].message}"</div>
                        </div>
                      )}
                    </div>
                  )}

                  {actionStatus[d.id]?.error && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      background: 'rgba(255, 51, 102, 0.12)',
                      border: '1px solid rgba(255, 51, 102, 0.4)',
                      borderRadius: '6px',
                      color: 'var(--emergency)',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertCircle size={15} />
                      <span>{actionStatus[d.id].error}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
