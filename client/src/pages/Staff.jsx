import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Building2, 
  Phone, 
  Mail, 
  CheckCircle, 
  Clock, 
  ShieldAlert,
  Search,
  Filter,
  Plus,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function Staff({ onSelectComplaint }) {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New staff form
  const [name, setName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [role, setRole] = useState('Senior Field Inspector');
  const [phone, setPhone] = useState('+91 94431 ');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getStaff(selectedDept),
      api.getDepartments()
    ]).then(([staff, depts]) => {
      setStaffList(staff);
      setDepartments(depts);
      if (depts.length > 0 && !deptId) setDeptId(depts[0].id);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [selectedDept]);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!name || !deptId) return;

    setSubmitting(true);
    try {
      await api.addStaff({
        name,
        departmentId: Number(deptId),
        role,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@cbe.gov.in`
      });
      setShowAddModal(false);
      setName('');
      loadData();
    } catch (err) {
      alert('Error adding staff: ' + err.message);
    } finally {
      setSubmitting(false);
    }
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
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF' }}>
            Municipal Field Staff & Emergency Roster
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Active ward duty officers, line engineers, and emergency crews across departments.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={selectedDept} 
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ fontSize: '12px' }}
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <button 
            className="btn-primary" 
            onClick={() => setShowAddModal(true)}
            style={{ fontSize: '12px', padding: '8px 14px' }}
          >
            <UserPlus size={14} />
            <span>Enlist Field Officer</span>
          </button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Retrieving field engineering personnel...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {staffList.map((s) => (
            <div key={s.id} className="control-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>
                    {s.employee_code}
                  </span>
                  <span className={`status-pill ${s.is_available ? 'resolved' : 'medium'}`}>
                    {s.is_available ? 'AVAILABLE' : 'ON SITE'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    border: '1px solid var(--border-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--cyan)',
                    fontWeight: 700,
                    fontSize: '15px'
                  }}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{s.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.role}</div>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-deep)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '12px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Building2 size={13} color="var(--violet)" />
                    <span>{s.department_name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Phone size={13} color="var(--cyan)" />
                    <span className="mono">{s.phone}</span>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Active Cases: <strong className="mono" style={{ color: s.active_cases > 2 ? 'var(--warning)' : 'var(--cyan)' }}>{s.active_cases}</strong>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Coimbatore Corp
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-deep)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Enlist Municipal Field Staff</h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. S. Vijayaraghavan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Department
                </label>
                <select 
                  value={deptId} 
                  onChange={(e) => setDeptId(e.target.value)}
                  style={{ width: '100%' }}
                  required
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Official Role
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Ward Road Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Emergency Phone Number
                </label>
                <input 
                  type="text" 
                  placeholder="+91 94431 10205"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Enlisting...' : 'Enlist Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
