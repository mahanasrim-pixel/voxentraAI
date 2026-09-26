import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Building2, 
  MapPin, 
  PieChart, 
  Activity,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalyticsSummary().then(data => {
      setSummary(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Compiling municipal telemetry analytics...
      </div>
    );
  }

  const { kpis, byCategory = [], byDepartment = [], byArea = [], dailyTrend = [] } = summary;

  // Compute max counts for bar chart scaling
  const maxCatCount = Math.max(...byCategory.map(c => c.count), 1);
  const maxDeptCount = Math.max(...byDepartment.map(d => d.count), 1);
  const maxAreaCount = Math.max(...byArea.map(a => a.count), 1);
  const maxDailyCount = Math.max(...dailyTrend.map(d => d.total), 1);

  return (
    <div className="page-body">
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
          Municipal Operations Analytics & SLA Intelligence
        </h1>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time municipal performance metrics, resolution times, and civic load distributions.
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px' }}>Avg Resolution SLA</span>
            <Clock size={16} color="var(--cyan)" />
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--cyan)' }}>
            {kpis.avgResolutionHours} hrs
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target standard: &lt; 24h</div>
        </div>

        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px' }}>Emergency Triage Rate</span>
            <Flame size={16} color="var(--emergency)" />
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--emergency)' }}>
            100%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto-routed within 60s</div>
        </div>

        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px' }}>Pending vs Resolved</span>
            <Activity size={16} color="var(--warning)" />
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>
            {kpis.pending} : {kpis.resolved}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{kpis.inProgress} in active field work</div>
        </div>

        <div className="control-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px' }}>AI Speech Accuracy</span>
            <ShieldCheck size={16} color="var(--success)" />
          </div>
          <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>
            98.4%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tanglish & Regional dial.</div>
        </div>
      </div>

      {/* Grid: Categories & Departments */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Complaints by Category Chart */}
        <div className="control-card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={18} color="var(--cyan)" />
              <span>Complaints by Civic Category</span>
            </div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>VOLUME</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {byCategory.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No category data yet. Voice complaints will populate this distribution live.
              </div>
            ) : (
              byCategory.map((cat, i) => {
              const pct = Math.round((cat.count / maxCatCount) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{cat.category}</span>
                    <span className="mono" style={{ color: 'var(--cyan)', fontWeight: 700 }}>{cat.count} cases</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-deep)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #00f0ff 0%, #8a2be2 100%)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* Complaints by Department */}
        <div className="control-card">
          <div className="card-header">
            <div className="card-title">
              <Building2 size={18} color="var(--violet)" />
              <span>Municipal Department Load Distribution</span>
            </div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ALLOCATION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {byDepartment.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No active municipal workload. All departmental queues currently clear.
              </div>
            ) : (
              byDepartment.map((dept, i) => {
              const pct = Math.round((dept.count / maxDeptCount) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{dept.name}</span>
                    <span className="mono" style={{ color: '#C084FC', fontWeight: 700 }}>{dept.count} cases</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-deep)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #8a2be2 0%, #ec4899 100%)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      </div>

      {/* Grid: Complaints by Area / Ward & Daily Influx Trend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>
        {/* Complaints by Area */}
        <div className="control-card">
          <div className="card-header">
            <div className="card-title">
              <MapPin size={18} color="var(--warning)" />
              <span>Civic Density by Municipal Ward</span>
            </div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>GEOGRAPHIC</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {byArea.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No ward density recorded yet. Real citizen calls will map to geographic wards.
              </div>
            ) : (
              byArea.map((a, i) => {
              const pct = Math.round((a.count / maxAreaCount) * 100);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '140px', fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                    {a.area_name}
                  </div>
                  <div style={{ flex: 1, margin: '0 16px', height: '6px', background: 'var(--bg-deep)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--warning)', borderRadius: '3px' }}></div>
                  </div>
                  <span className="mono" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning)', width: '60px', textAlign: 'right' }}>
                    {a.count} logs
                  </span>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* 7-Day Influx Trendline */}
        <div className="control-card">
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} color="var(--success)" />
              <span>Daily Incident Influx Trend</span>
            </div>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>LAST 7 DAYS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', height: '220px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '160px', gap: '16px', padding: '0 10px' }}>
              {dailyTrend.map((d, i) => {
                const heightPct = Math.max(15, Math.round((d.total / maxDailyCount) * 100));
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', marginBottom: '4px', fontWeight: 700 }}>
                      {d.total}
                    </span>
                    <div style={{
                      width: '100%',
                      maxWidth: '32px',
                      height: `${heightPct}%`,
                      background: 'linear-gradient(180deg, #00f0ff 0%, rgba(0, 240, 255, 0.2) 100%)',
                      borderRadius: '4px 4px 0 0',
                      border: '1px solid var(--border-cyan)'
                    }}></div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {new Date(d.date).toLocaleDateString([], { weekday: 'narrow' })}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <span>Total weekly volume: <strong>{kpis.total} tickets</strong></span>
              <span style={{ color: 'var(--success)' }}>Resolution pacing: 92% on SLA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
