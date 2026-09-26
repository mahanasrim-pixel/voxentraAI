import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Flame, Layers, Zap } from 'lucide-react';

export default function AIStatusCard({ metrics = {} }) {
  const understood = metrics.understood || 0;
  const clarification = metrics.requiringClarification || 0;
  const emergency = metrics.emergencyDetected || 0;
  const processed = metrics.processed || 0;
  const accuracy = metrics.accuracyRate || 96;
  const latency = metrics.avgLatencyMs || 310;

  return (
    <div className="control-card" style={{
      background: 'linear-gradient(145deg, #111827 0%, #151D30 100%)',
      border: '1px solid var(--border-cyan)',
      boxShadow: '0 0 25px rgba(0, 240, 255, 0.12)'
    }}>
      <div className="card-header">
        <div className="card-title">
          <Cpu size={18} color="var(--cyan)" />
          <span>VOXENTRA AI — LIVE TELEMETRY</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-indicator green"></span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>
            NEURAL ENGINE ACTIVE
          </span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {/* Complaints understood */}
        <div style={{
          background: 'rgba(0, 229, 153, 0.08)',
          border: '1px solid rgba(0, 229, 153, 0.25)',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px' }}>🟢</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Understood</span>
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--success)' }}>
            {understood}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>High confidence slots</div>
        </div>

        {/* Complaints requiring clarification */}
        <div style={{
          background: 'rgba(255, 183, 3, 0.08)',
          border: '1px solid rgba(255, 183, 3, 0.25)',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px' }}>🟡</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Clarification</span>
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--warning)' }}>
            {clarification}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Follow-ups triggered</div>
        </div>

        {/* Emergency complaints detected */}
        <div style={{
          background: 'rgba(255, 51, 102, 0.08)',
          border: '1px solid rgba(255, 51, 102, 0.25)',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px' }}>🔴</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Emergency</span>
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--emergency)' }}>
            {emergency}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Immediate dispatch</div>
        </div>

        {/* Complaints processed */}
        <div style={{
          background: 'rgba(148, 163, 184, 0.08)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          padding: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px' }}>⚪</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Processed</span>
          </div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF' }}>
            {processed}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total voice calls</div>
        </div>
      </div>

      {/* Accuracy & Speed footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '11px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} color="var(--cyan)" />
          <span>Intent Classification Accuracy:</span>
          <strong className="mono" style={{ color: 'var(--cyan)' }}>{accuracy}%</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Avg Speech Latency:</span>
          <strong className="mono" style={{ color: '#fff' }}>{latency} ms</strong>
        </div>
      </div>
    </div>
  );
}
