import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Send, 
  Phone, 
  Smartphone,
  ShieldAlert,
  Server
} from 'lucide-react';
import { api } from '../services/api';
import { sseClient } from '../services/sse';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    api.getNotifications(50).then(data => {
      setNotifications(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();

    const unsub = sseClient.subscribe('sms_dispatched', (item) => {
      setNotifications(prev => [item, ...prev]);
    });

    return () => unsub();
  }, []);

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
              Citizen SMS Telemetry & Notification Dispatches
            </h1>
            <span className="mono" style={{
              background: 'rgba(0, 240, 255, 0.1)',
              color: 'var(--cyan)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600
            }}>
              SMS MOCK ADAPTER ACTIVE
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Automated citizen status dispatches, complaint confirmation alerts, and engineer arrival notices.
          </div>
        </div>

        <button 
          className="btn-secondary" 
          onClick={loadData}
          style={{ fontSize: '12px', padding: '8px 14px' }}
        >
          <RotateCcw size={14} />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Dispatches List */}
      <div className="control-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing last <strong className="mono" style={{ color: 'var(--cyan)' }}>{notifications.length}</strong> SMS dispatches
          </span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--success)' }}>
            DELIVERY RATE: 100%
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading notification logs...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No SMS dispatches recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map((n, i) => (
              <div 
                key={n.id || i}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(0, 240, 255, 0.08)',
                    border: '1px solid var(--border-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cyan)',
                    flexShrink: 0
                  }}>
                    <Smartphone size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span className="mono" style={{ fontWeight: 700, color: '#fff' }}>
                        To: {n.recipient_phone}
                      </span>
                      {n.complaint_id && (
                        <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)' }}>
                          [{n.complaint_id}]
                        </span>
                      )}
                      <span className="status-pill resolved" style={{ fontSize: '10px' }}>
                        {n.status || 'DELIVERED'}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-deep)',
                      border: '1px solid var(--border-subtle)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      marginTop: '6px',
                      lineHeight: 1.4,
                      maxWidth: '700px'
                    }}>
                      "{n.message}"
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Adapter: {n.provider_response || 'Development Mock Dispatcher'}
                    </div>
                  </div>
                </div>

                <div className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
