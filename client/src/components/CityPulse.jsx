import React from 'react';
import { Activity, Flame, ShieldCheck, UserCheck, ArrowUpRight } from 'lucide-react';

export default function CityPulse({ pulse = {} }) {
  const items = [
    {
      label: 'New Reports Received',
      count: pulse.newReceived || 0,
      icon: Activity,
      color: 'var(--cyan)',
      glow: 'var(--cyan-glow)',
      sub: 'Recorded past 24 hrs',
      bg: 'rgba(0, 240, 255, 0.06)',
      border: 'rgba(0, 240, 255, 0.25)'
    },
    {
      label: 'Emergency Criticals',
      count: pulse.emergencyReports || 0,
      icon: Flame,
      color: 'var(--emergency)',
      glow: 'var(--emergency-glow)',
      sub: 'Priority 1 live alerts',
      bg: 'rgba(255, 51, 102, 0.08)',
      border: 'rgba(255, 51, 102, 0.35)',
      isAlert: (pulse.emergencyReports || 0) > 0
    },
    {
      label: 'Complaints Assigned',
      count: pulse.complaintsAssigned || 0,
      icon: UserCheck,
      color: '#A855F7',
      glow: '0 0 16px rgba(168, 85, 247, 0.35)',
      sub: 'Field crews dispatched',
      bg: 'rgba(168, 85, 247, 0.06)',
      border: 'rgba(168, 85, 247, 0.25)'
    },
    {
      label: 'Issues Resolved Today',
      count: pulse.issuesResolvedToday || 0,
      icon: ShieldCheck,
      color: 'var(--success)',
      glow: 'var(--success-glow)',
      sub: 'Citizen verified closures',
      bg: 'rgba(0, 229, 153, 0.06)',
      border: 'rgba(0, 229, 153, 0.25)'
    }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-indicator cyan"></span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#FFFFFF'
          }}>
            CITY PULSE — REAL-TIME MUNICIPAL STREAM
          </span>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          ZONE: COIMBATORE METROPOLITAN
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: item.isAlert ? item.glow : 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>
                  {item.label}
                </div>
                <div className="mono" style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  color: item.color,
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {item.count}
                  {item.isAlert && (
                    <span className="pulse-indicator" style={{ width: '6px', height: '6px' }}></span>
                  )}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {item.sub}
                </div>
              </div>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${item.border}`
              }}>
                <Icon size={20} color={item.color} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
