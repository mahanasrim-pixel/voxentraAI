import React, { useState } from 'react';
import { Radio, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(username, password);
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-deep)',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 70%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-cyan)',
        borderRadius: '16px',
        padding: '36px 30px',
        boxShadow: 'var(--shadow-popup)',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Brand Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--cyan) 0%, var(--violet) 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
            marginBottom: '12px'
          }}>
            <Radio size={24} color="#06090E" />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
            VOXENTRA COMMAND CENTER
          </h2>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Authorized Municipal Controller Authentication
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255, 51, 102, 0.1)',
            border: '1px solid rgba(255, 51, 102, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '12px',
            color: 'var(--emergency)',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', paddingLeft: '36px' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '14px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Access Command Console'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }}>
          Default Credentials: <strong className="mono" style={{ color: 'var(--cyan)' }}>admin / admin123</strong>
        </div>
      </div>
    </div>
  );
}
