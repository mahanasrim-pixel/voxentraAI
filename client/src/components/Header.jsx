import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Bell, 
  User, 
  LogOut, 
  ExternalLink, 
  Activity, 
  ShieldAlert,
  Mic
} from 'lucide-react';
import { api } from '../services/api';
import { sseClient } from '../services/sse';

export default function Header({ currentView, setView, onOpenCitizenPortal }) {
  const [admin, setAdmin] = useState(api.getCurrentAdmin());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Load recent notifications
    api.getNotifications(6).then(setNotifications).catch(() => {});

    // SSE connection state
    const unsubConn = sseClient.subscribe('connection_change', ({ status }) => {
      setIsConnected(status === 'connected');
    });

    // Real-time SMS & alerts
    const unsubSms = sseClient.subscribe('sms_dispatched', (item) => {
      setNotifications(prev => [item, ...prev.slice(0, 5)]);
    });

    const unsubNew = sseClient.subscribe('new_complaint', (item) => {
      setNotifications(prev => [{
        id: 'new-' + item.id,
        recipient_phone: item.citizen_phone,
        message: `New complaint received: ${item.id} - ${item.category} at ${item.area_name}`,
        created_at: new Date().toISOString()
      }, ...prev.slice(0, 5)]);
    });

    return () => {
      unsubConn();
      unsubSms();
      unsubNew();
    };
  }, []);

  const handleLogout = () => {
    api.logout();
    setAdmin(null);
    setView('login');
  };

  return (
    <header style={{
      height: '68px',
      backgroundColor: 'var(--bg-deep)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Platform Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setView('overview')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #8a2be2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(0, 240, 255, 0.4)'
          }}>
            <Radio size={20} color="#06090E" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '19px',
                fontWeight: '800',
                letterSpacing: '0.05em',
                background: 'linear-gradient(90deg, #FFFFFF 0%, #E2E8F0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>VOXENTRA</span>
              <span style={{
                background: 'rgba(0, 240, 255, 0.12)',
                color: 'var(--cyan)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600'
              }}>v1.0 OPS</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Intelligent Civic Complaint & Response Platform
            </div>
          </div>
        </div>

        {/* Live Telemetry Ping */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <span className={`pulse-indicator ${isConnected ? 'green' : ''}`}></span>
          <span style={{ fontWeight: 600, color: isConnected ? 'var(--success)' : 'var(--emergency)' }}>
            {isConnected ? 'COMMAND CENTER LIVE' : 'CONNECTING...'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span className="mono" style={{ fontSize: '10px' }}>LATENCY: 18ms</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Toggle Citizen Voice Interface */}
        <button 
          onClick={onOpenCitizenPortal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(138, 43, 226, 0.2) 100%)',
            border: '1px solid var(--border-cyan)',
            color: 'var(--cyan)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          title="Open Citizen Voice Complaint Portal"
        >
          <Mic size={16} />
          <span>Citizen Voice Portal</span>
          <ExternalLink size={13} style={{ opacity: 0.7 }} />
        </button>

        {/* Notification Bell Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--emergency)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '46px',
              right: 0,
              width: '360px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-popup)',
              padding: '16px',
              zIndex: 1000
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Operations Feed & SMS Log</span>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)' }}>Live</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.map((n, i) => (
                  <div key={n.id || i} style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'var(--bg-deep)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span className="mono" style={{ fontSize: '10px' }}>{n.recipient_phone || 'System'}</span>
                      <span style={{ fontSize: '10px' }}>
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {n.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        {admin ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px 5px 6px',
            borderRadius: '24px'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={15} color="var(--cyan)" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{admin.fullName || admin.username}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{admin.role}</div>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ color: 'var(--text-muted)', marginLeft: '6px' }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button 
            className="btn-primary" 
            style={{ padding: '7px 14px', fontSize: '12px' }}
            onClick={() => setView('login')}
          >
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
}
