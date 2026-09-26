import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Filter, 
  RotateCcw, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Building2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';

export default function Hotspots({ setView, onSelectComplaint }) {
  const [hotspots, setHotspots] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [departmentId, setDepartmentId] = useState('all');
  const [area, setArea] = useState('all');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getHotspots({ category, priority, departmentId, area }),
      api.getDepartments()
    ]).then(([hs, depts]) => {
      setHotspots(hs);
      setDepartments(depts);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [category, priority, departmentId, area]);

  const resetFilters = () => {
    setCategory('all');
    setPriority('all');
    setDepartmentId('all');
    setArea('all');
  };

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
              Problem Hotspots & Civic Density Clusters
            </h1>
            <span className="status-pill emergency" style={{ display: 'inline-flex' }}>
              SPATIAL RISK SCAN
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Identifies zones with recurring infrastructure and civic failures for prioritized council intervention.
          </div>
        </div>

        <button 
          className="btn-secondary"
          onClick={() => setView('map')}
          style={{ fontSize: '12px', padding: '8px 14px' }}
        >
          <MapPin size={14} />
          <span>Switch to Dark Live Map</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="control-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyan)', fontSize: '13px', fontWeight: 600 }}>
            <Filter size={15} />
            <span>Filter Hotspots:</span>
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Problem Categories</option>
            <option value="Damaged Road">Damaged Road</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Electricity Issue">Electricity Issue</option>
            <option value="Garbage/Sanitation">Garbage/Sanitation</option>
            <option value="Accident">Accident</option>
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="emergency">🔴 Emergency First</option>
            <option value="high">🟠 High Priority</option>
            <option value="medium">🟡 Medium</option>
          </select>

          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="all">All Municipal Wards</option>
            <option value="Saravanampatti">Saravanampatti</option>
            <option value="Gandhipuram">Gandhipuram</option>
            <option value="RS Puram">RS Puram</option>
            <option value="Peelamedu">Peelamedu</option>
            <option value="Ukkadam">Ukkadam</option>
            <option value="Singanallur">Singanallur</option>
          </select>

          <button className="btn-secondary" onClick={resetFilters} style={{ padding: '8px 12px' }}>
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Hotspots Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Computing spatial cluster density across municipal zones...
        </div>
      ) : hotspots.length === 0 ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No problem hotspots found for current criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {hotspots.map((h) => {
            const isCritical = h.riskLevel === 'Critical';
            return (
              <div 
                key={h.id}
                className="control-card"
                style={{
                  border: isCritical ? '1px solid rgba(255, 51, 102, 0.4)' : '1px solid var(--border-subtle)',
                  background: isCritical ? 'linear-gradient(145deg, rgba(255, 51, 102, 0.05) 0%, #111724 100%)' : 'var(--bg-card)',
                  boxShadow: isCritical ? '0 0 20px rgba(255, 51, 102, 0.15)' : 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>
                        {h.id}
                      </span>
                      <span className={`status-pill ${isCritical ? 'emergency' : 'high'}`}>
                        {h.riskLevel} Risk
                      </span>
                    </div>

                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {h.totalComplaints} Reports
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {h.headline}
                  </h3>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Ward: <strong>{h.areaName}</strong> • {h.departmentName || 'Public Works'}
                  </div>

                  {/* Density Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Resolution Completion</span>
                      <span className="mono" style={{ color: h.resolutionRate > 50 ? 'var(--success)' : 'var(--warning)', fontWeight: 700 }}>
                        {h.resolutionRate}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-deep)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${h.resolutionRate}%`,
                        height: '100%',
                        background: h.resolutionRate > 50 ? 'var(--success)' : 'linear-gradient(90deg, var(--emergency) 0%, var(--warning) 100%)',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                  </div>

                  {/* Breakdown Badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{
                      fontSize: '11px',
                      background: 'var(--bg-deep)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: 'var(--emergency)'
                    }}>
                      🚨 {h.emergencyCount} Critical
                    </span>

                    <span style={{
                      fontSize: '11px',
                      background: 'var(--bg-deep)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: 'var(--warning)'
                    }}>
                      ⚡ {h.highPriorityCount} High Urgency
                    </span>

                    <span style={{
                      fontSize: '11px',
                      background: 'var(--bg-deep)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      color: 'var(--info)'
                    }}>
                      👷 {h.activeCount} In Action
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Last alert: {new Date(h.lastReported).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button 
                    className="btn-secondary"
                    style={{ padding: '5px 12px', fontSize: '11px' }}
                    onClick={() => setView('map')}
                  >
                    <span>View on Live Map</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
