import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Copy, 
  ChevronRight, 
  Flame, 
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function Complaints({ onSelectComplaint, onReviewDuplicates }) {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [departmentId, setDepartmentId] = useState('all');
  const [area, setArea] = useState('all');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getComplaints({ search, status, priority, departmentId, area }),
      api.getDepartments()
    ]).then(([comps, depts]) => {
      setComplaints(comps);
      setDepartments(depts);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [status, priority, departmentId, area]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setDepartmentId('all');
    setArea('all');
  };

  return (
    <div className="page-body">
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
            Civic Complaints Roster
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Centralized intake, department assignments, and resolution tracking.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary" 
            onClick={loadData}
            style={{ fontSize: '12px', padding: '8px 14px' }}
          >
            <RotateCcw size={14} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="control-card" style={{ marginBottom: '20px', padding: '16px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search by ID, keyword, phone, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '36px' }}
            />
          </div>

          {/* Status */}
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            style={{ minWidth: '130px' }}
          >
            <option value="all">All Statuses</option>
            <option value="received">Received</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Priority */}
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ minWidth: '130px' }}
          >
            <option value="all">All Priorities</option>
            <option value="emergency">🔴 Emergency</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="normal">🟢 Normal</option>
          </select>

          {/* Department */}
          <select 
            value={departmentId} 
            onChange={(e) => setDepartmentId(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Area */}
          <select 
            value={area} 
            onChange={(e) => setArea(e.target.value)}
            style={{ minWidth: '140px' }}
          >
            <option value="all">All Zones</option>
            <option value="Saravanampatti">Saravanampatti</option>
            <option value="Gandhipuram">Gandhipuram</option>
            <option value="RS Puram">RS Puram</option>
            <option value="Peelamedu">Peelamedu</option>
            <option value="Ukkadam">Ukkadam</option>
            <option value="Singanallur">Singanallur</option>
          </select>

          <button type="submit" className="btn-primary" style={{ padding: '9px 16px' }}>
            <Search size={14} />
            <span>Search</span>
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={resetFilters}
            style={{ padding: '9px 12px' }}
            title="Reset Filters"
          >
            <RotateCcw size={14} />
          </button>
        </form>
      </div>

      {/* Complaints Table */}
      <div className="control-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Showing <strong className="mono" style={{ color: 'var(--cyan)' }}>{complaints.length}</strong> complaints
          </span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            DATABASE: VOXENTRA SQLITE
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading complaints data...
          </div>
        ) : complaints.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No complaints found matching the criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-deep)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 18px' }}>Complaint ID</th>
                  <th style={{ padding: '12px 18px' }}>Category</th>
                  <th style={{ padding: '12px 18px' }}>Spoken Location & Landmark</th>
                  <th style={{ padding: '12px 18px' }}>Priority</th>
                  <th style={{ padding: '12px 18px' }}>Department</th>
                  <th style={{ padding: '12px 18px' }}>Assigned Staff</th>
                  <th style={{ padding: '12px 18px' }}>Status</th>
                  <th style={{ padding: '12px 18px' }}>Created</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr 
                    key={c.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--cyan)' }}>
                        {c.id}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#fff' }}>
                      {c.category}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.area_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c.landmark || c.spoken_location}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`status-pill ${c.priority}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      {c.department_name || 'General Municipal'}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: '12px' }}>
                      {c.staff_name ? (
                        <span style={{ color: '#fff' }}>{c.staff_name}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`status-pill ${c.status}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button 
                          className="btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '11px' }}
                          onClick={() => onReviewDuplicates(c.id)}
                          title="Check Duplicate / Related Complaints"
                        >
                          <Copy size={13} />
                        </button>
                        <button 
                          className="btn-primary"
                          style={{ padding: '5px 12px', fontSize: '11px' }}
                          onClick={() => onSelectComplaint(c.id)}
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
