import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  Users, 
  Building2, 
  MapPin, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import CityPulse from '../components/CityPulse';
import AIStatusCard from '../components/AIStatusCard';
import { api } from '../services/api';
import { sseClient } from '../services/sse';

export default function Overview({ setView, onSelectComplaint }) {
  const [summary, setSummary] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      api.getAnalyticsSummary(),
      api.getComplaints({ limit: 6 }),
      api.getHotspots()
    ]).then(([sum, comps, hs]) => {
      setSummary(sum);
      setRecentComplaints(comps);
      setHotspots(hs.slice(0, 4));
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time updates
    const unsubNew = sseClient.subscribe('new_complaint', () => loadData());
    const unsubUpd = sseClient.subscribe('complaint_updated', () => loadData());

    return () => {
      unsubNew();
      unsubUpd();
    };
  }, []);

  if (loading && !summary) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <span className="pulse-indicator cyan" style={{ marginRight: '10px' }}></span>
        Initializing Midnight Command Center telemetry...
      </div>
    );
  }

  const kpis = summary?.kpis || {};
  const pulse = summary?.pulse || {};
  const aiMetrics = summary?.aiMetrics || {};

  return (
    <div className="page-body">
      {/* City Pulse Section */}
      <CityPulse pulse={pulse} />

      {/* Primary KPI Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Total */}
        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>Total Complaints</span>
            <FileText size={16} color="var(--cyan)" />
          </div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>
            {kpis.total || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            All-time logged via voice/helpline
          </div>
        </div>

        {/* New / Unassigned */}
        <div className="control-card" style={{ borderColor: (kpis.newComplaints > 0) ? 'rgba(0, 240, 255, 0.4)' : 'var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>New Complaints</span>
            <span className="pulse-indicator cyan"></span>
          </div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--cyan)' }}>
            {kpis.newComplaints || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Awaiting triage / assignment
          </div>
        </div>

        {/* Emergency */}
        <div className="control-card" style={{
          background: 'rgba(255, 51, 102, 0.06)',
          borderColor: (kpis.emergency > 0) ? 'rgba(255, 51, 102, 0.5)' : 'var(--border-subtle)',
          boxShadow: (kpis.emergency > 0) ? 'var(--emergency-glow)' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emergency)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Emergency Alerts</span>
            <Flame size={18} color="var(--emergency)" />
          </div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--emergency)' }}>
            {kpis.emergency || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Life safety / Immediate danger
          </div>
        </div>

        {/* In Progress */}
        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>In Progress</span>
            <Clock size={16} color="var(--info)" />
          </div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--info)' }}>
            {kpis.inProgress || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Field teams actively repairing
          </div>
        </div>

        {/* Resolved */}
        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500 }}>Resolved</span>
            <CheckCircle2 size={16} color="var(--success)" />
          </div>
          <div className="mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--success)' }}>
            {kpis.resolved || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Avg time: {kpis.avgResolutionHours} hrs
          </div>
        </div>
      </div>

      {/* Two Column Layout: AI Telemetry & Problem Hotspots Spotlight */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* VOXENTRA AI LIVE card */}
        <AIStatusCard metrics={aiMetrics} />

        {/* Problem Hotspots Spotlight */}
        <div className="control-card">
          <div className="card-header">
            <div className="card-title">
              <Flame size={18} color="var(--warning)" />
              <span>Civic Problem Hotspots (Coimbatore)</span>
            </div>
            <button 
              className="btn-secondary" 
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => setView('hotspots')}
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hotspots.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                No active problem hotspots detected. City infrastructure operating normally.
              </div>
            ) : (
              hotspots.map((h) => (
              <div 
                key={h.id}
                onClick={() => setView('hotspots')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {h.headline}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Dept: {h.departmentName} • {h.activeCount} active
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`status-pill ${h.riskLevel === 'Critical' ? 'emergency' : 'high'}`}>
                    {h.riskLevel}
                  </span>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Live Complaints Feed */}
      <div className="control-card">
        <div className="card-header">
          <div className="card-title">
            <MapPin size={18} color="var(--cyan)" />
            <span>Recent Voice-Logged Complaints</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-secondary" 
              style={{ padding: '6px 14px', fontSize: '12px' }}
              onClick={() => setView('map')}
            >
              <MapPin size={14} />
              <span>Open Live Map</span>
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '6px 14px', fontSize: '12px' }}
              onClick={() => setView('complaints')}
            >
              <span>All Complaints</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Ticket ID</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Location / Ward</th>
                <th style={{ padding: '12px 14px' }}>Priority</th>
                <th style={{ padding: '12px 14px' }}>Department</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Created</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No complaints registered yet. Citizen voice calls will appear here in real time.
                  </td>
                </tr>
              ) : (
                recentComplaints.map((c) => (
                <tr 
                  key={c.id} 
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--cyan)' }}>
                      {c.id}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#fff' }}>
                    {c.category}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-primary)' }}>
                    {c.area_name}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`status-pill ${c.priority}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {c.department_name || 'General Municipal'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className={`status-pill ${c.status}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button 
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => onSelectComplaint(c.id)}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
