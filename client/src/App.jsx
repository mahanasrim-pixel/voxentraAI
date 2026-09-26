import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import LiveMap from './pages/LiveMap';
import Complaints from './pages/Complaints';
import Hotspots from './pages/Hotspots';
import Analytics from './pages/Analytics';
import Staff from './pages/Staff';
import Notifications from './pages/Notifications';
import CitizenPortal from './pages/CitizenPortal';
import Login from './pages/Login';
import ComplaintDetailDrawer from './components/ComplaintDetailDrawer';
import DuplicateReviewModal from './components/DuplicateReviewModal';
import { api } from './services/api';
import { sseClient } from './services/sse';
import { Building2, Flame, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [currentView, setView] = useState('overview');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [duplicateReviewId, setDuplicateReviewId] = useState(null);
  const [drawerExternalNote, setDrawerExternalNote] = useState('');
  const [drawerUpdatedComplaint, setDrawerUpdatedComplaint] = useState(null);
  const [counts, setCounts] = useState({ newComplaints: 0, emergency: 0 });
  const [toast, setToast] = useState(null);

  // Departments list for departments view
  const [departments, setDepartments] = useState([]);

  // Check login
  const [admin, setAdmin] = useState(api.getCurrentAdmin());

  const loadCounts = () => {
    api.getAnalyticsSummary().then(sum => {
      if (sum && sum.kpis) {
        setCounts({
          newComplaints: sum.kpis.newComplaints || 0,
          emergency: sum.kpis.emergency || 0
        });
      }
    }).catch(() => {});

    api.getDepartments().then(setDepartments).catch(() => {});
  };

  useEffect(() => {
    loadCounts();

    // Subscribe to SSE
    const unsubNew = sseClient.subscribe('new_complaint', (comp) => {
      loadCounts();
      setToast({
        title: 'New Complaint Logged',
        message: `${comp.id} (${comp.category}) reported at ${comp.area_name}`,
        type: comp.priority === 'emergency' ? 'emergency' : 'info'
      });
      setTimeout(() => setToast(null), 6000);
    });

    const unsubEmerg = sseClient.subscribe('emergency_alert', (alert) => {
      loadCounts();
      setToast({
        title: 'CRITICAL EMERGENCY ALERT',
        message: alert.message,
        type: 'emergency'
      });
      setTimeout(() => setToast(null), 8000);
    });

    return () => {
      unsubNew();
      unsubEmerg();
    };
  }, []);

  // Citizen Portal full screen view
  if (currentView === 'citizen_portal') {
    return <CitizenPortal onBackToDashboard={() => setView('overview')} />;
  }

  // Admin login screen
  if (currentView === 'login') {
    return (
      <Login 
        onLoginSuccess={() => {
          setAdmin(api.getCurrentAdmin());
          setView('overview');
        }} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Toast Alert Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 99999,
          background: toast.type === 'emergency' ? 'rgba(255, 51, 102, 0.95)' : 'rgba(17, 24, 39, 0.95)',
          border: toast.type === 'emergency' ? '1px solid #FF5E80' : '1px solid var(--border-cyan)',
          boxShadow: toast.type === 'emergency' ? '0 0 30px rgba(255, 51, 102, 0.6)' : 'var(--shadow-popup)',
          borderRadius: '10px',
          padding: '14px 18px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '420px',
          backdropFilter: 'blur(10px)',
          animation: 'modal-in 0.25s ease-out'
        }}>
          {toast.type === 'emergency' ? (
            <Flame size={20} color="#fff" />
          ) : (
            <span className="pulse-indicator cyan"></span>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {toast.title}
            </div>
            <div style={{ fontSize: '12px', marginTop: '2px', opacity: 0.95 }}>
              {toast.message}
            </div>
          </div>
          <button onClick={() => setToast(null)} style={{ color: '#fff', opacity: 0.8 }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Main Operations Navigation Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        counts={counts}
      />

      {/* Main Command View Area */}
      <div className="main-content">
        <Header 
          currentView={currentView} 
          setView={setView} 
          onOpenCitizenPortal={() => setView('citizen_portal')}
        />

        {currentView === 'overview' && (
          <Overview 
            setView={setView} 
            onSelectComplaint={(id) => setSelectedComplaintId(id)} 
          />
        )}

        {currentView === 'map' && (
          <LiveMap 
            onSelectComplaint={(id) => setSelectedComplaintId(id)} 
          />
        )}

        {currentView === 'complaints' && (
          <Complaints 
            onSelectComplaint={(id) => setSelectedComplaintId(id)} 
            onReviewDuplicates={(id) => setDuplicateReviewId(id)}
          />
        )}

        {currentView === 'hotspots' && (
          <Hotspots 
            setView={setView} 
            onSelectComplaint={(id) => setSelectedComplaintId(id)} 
          />
        )}

        {currentView === 'analytics' && (
          <Analytics />
        )}

        {currentView === 'staff' && (
          <Staff 
            onSelectComplaint={(id) => setSelectedComplaintId(id)} 
          />
        )}

        {currentView === 'notifications' && (
          <Notifications />
        )}

        {currentView === 'departments' && (
          <div className="page-body">
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>
                Municipal Departments & Workload Roster
              </h1>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Response teams, SLA compliance, and dispatch hotlines across civic branches.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {departments.map(d => (
                <div key={d.id} className="control-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--cyan)', fontWeight: 700 }}>
                      DEPT CODE: {d.code}
                    </span>
                    <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      SLA: {d.sla_hours} hrs
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                    {d.name}
                  </h3>

                  <div style={{ background: 'var(--bg-deep)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Contact Phone: <strong className="mono" style={{ color: '#fff' }}>{d.contact_phone}</strong></div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Email: <span style={{ color: 'var(--cyan)' }}>{d.contact_email}</span></div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '12px' }}>
                    <span>Active Cases: <strong className="mono" style={{ color: 'var(--warning)' }}>{d.active_complaints || 0}</strong></span>
                    <span>Staff Enlisted: <strong className="mono" style={{ color: 'var(--success)' }}>{d.staff_count || 0}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side Complaint Detail Drawer */}
      <ComplaintDetailDrawer 
        complaintId={selectedComplaintId}
        onClose={() => {
          setSelectedComplaintId(null);
          setDrawerExternalNote('');
          setDrawerUpdatedComplaint(null);
        }}
        onUpdated={() => loadCounts()}
        onReviewDuplicates={(id) => setDuplicateReviewId(id)}
        externalNote={drawerExternalNote}
        updatedComplaint={drawerUpdatedComplaint}
      />

      {/* Duplicate / Related Complaints Review Modal */}
      {duplicateReviewId && (
        <DuplicateReviewModal 
          complaintId={duplicateReviewId}
          onClose={() => setDuplicateReviewId(null)}
          onSelectComplaint={(id) => {
            setDuplicateReviewId(null);
            setSelectedComplaintId(id);
          }}
          onUpdated={(updated) => {
            loadCounts();
            setDrawerUpdatedComplaint(updated);
          }}
          onApplyNote={(note, updated) => {
            setDrawerExternalNote(note);
            if (updated) {
              setDrawerUpdatedComplaint(updated);
            }
          }}
        />
      )}
    </div>
  );
}
