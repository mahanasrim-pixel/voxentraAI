import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  FileText, 
  Flame, 
  BarChart3, 
  Building2, 
  Users, 
  MessageSquare, 
  Settings,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ currentView, setView, counts = {} }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: MapPin, badge: counts.emergency > 0 ? `${counts.emergency} Alert` : null, badgeColor: 'emergency' },
    { id: 'complaints', label: 'Complaints', icon: FileText, badge: counts.newComplaints > 0 ? counts.newComplaints : null, badgeColor: 'cyan' },
    { id: 'hotspots', label: 'Problem Hotspots', icon: Flame },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'staff', label: 'Staff Roster', icon: Users },
    { id: 'notifications', label: 'SMS & Alerts', icon: MessageSquare }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-deep)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      flexShrink: 0
    }}>
      <div>
        <div style={{
          padding: '0 12px 14px 12px',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)'
        }}>
          Control Modules
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                  border: isActive ? '1px solid var(--border-cyan)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 16px rgba(0, 240, 255, 0.15)' : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? 'var(--cyan)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    background: item.badgeColor === 'emergency' ? 'rgba(255, 51, 102, 0.2)' : 'rgba(0, 240, 255, 0.2)',
                    color: item.badgeColor === 'emergency' ? 'var(--emergency)' : 'var(--cyan)',
                    border: `1px solid ${item.badgeColor === 'emergency' ? 'rgba(255, 51, 102, 0.4)' : 'rgba(0, 240, 255, 0.4)'}`
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Emergency Hotline & Help Info */}
      <div style={{
        background: 'rgba(255, 51, 102, 0.06)',
        border: '1px solid rgba(255, 51, 102, 0.2)',
        borderRadius: '10px',
        padding: '14px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldAlert size={16} color="var(--emergency)" />
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--emergency)', letterSpacing: '0.04em' }}>
            CRITICAL DISPATCH
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>
          Police (100) & Fire (101) direct telemetry bridge active.
        </p>
        <div className="mono" style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>
          ZONE: COIMBATORE CORP
        </div>
      </div>
    </aside>
  );
}
