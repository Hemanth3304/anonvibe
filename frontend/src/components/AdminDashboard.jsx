import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Trash2, ShieldCheck, RefreshCw, LogOut } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminDashboard({ onExit }) {
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const bearer = `Bearer ${password}`;
    try {
      const res = await axios.get(`${API_URL}/api/admin/reports`, {
        headers: { Authorization: bearer }
      });
      setAuthHeader(bearer);
      setData(res.data);
    } catch (err) {
      setError('Access Denied. Invalid credentials or network error.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/reports`, {
        headers: { Authorization: authHeader }
      });
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
         setAuthHeader('');
      } else {
         setError('Failed to refresh data');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAllReports = async () => {
    if (!window.confirm("Delete ALL reports completely?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/reports`, {
        headers: { Authorization: authHeader }
      });
      fetchReports();
    } catch (err) {
      setError('Failed to clear reports');
    }
  };

  useEffect(() => {
    // Only fetch if authenticated
    if (authHeader) {
      const id = setInterval(fetchReports, 15000);
      return () => clearInterval(id);
    }
  }, [authHeader]);


  if (!authHeader) {
     return (
       <div className="admin-login glass-panel animate-fade-in">
         <ShieldAlert size={48} className="admin-icon" />
         <h2 style={{marginTop: '1rem'}}>Restricted Access</h2>
         <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginTop: '1.5rem'}}>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Authorization Key"
              autoFocus
              style={{
                padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.3)', color: '#fff'
              }}
            />
            {error && <p style={{color: '#ef4444', fontSize: '0.85rem', margin: 0}}>{error}</p>}
            <button className="game-btn primary" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Authenticate'}
            </button>
            <button className="game-btn danger" type="button" onClick={onExit}>
              Exit
            </button>
         </form>
         <style>{`
          .admin-login { max-width: 400px; margin: 4rem auto; padding: 3rem; text-align: center; }
          .admin-icon { color: var(--accent-primary); filter: drop-shadow(0 0 10px rgba(139,92,246,0.5)); }
         `}</style>
       </div>
     );
  }

  return (
    <div className="admin-dashboard glass-panel animate-fade-in">
      <div className="admin-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <ShieldCheck size={28} color="#22c55e" />
          <h2>Command Center</h2>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div className="admin-stat-pill">
            Live Rooms: <strong>{data?.stats?.activeRooms || 0}</strong>
          </div>
          <div className="admin-stat-pill">
            Online Users: <strong>{data?.stats?.onlineUsers || 0}</strong>
          </div>
          <button className="game-icon-btn" onClick={fetchReports} title="Refresh">
             <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          <button className="game-icon-btn danger-text" onClick={() => setAuthHeader('')} title="Log Out">
             <LogOut size={16} />
          </button>
          <button className="game-btn" style={{background: 'rgba(255,255,255,0.1)'}} onClick={onExit}>Close</button>
        </div>
      </div>

      <div className="admin-content">
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
           <h3>Reported Users Log</h3>
           {data?.reports?.length > 0 && (
             <button className="game-btn danger" style={{padding: '0.5rem 1rem'}} onClick={clearAllReports}>
                <Trash2 size={16} style={{verticalAlign: 'middle', marginRight: '5px'}}/>
                Clear All Logs
             </button>
           )}
         </div>

         {data?.reports?.length === 0 ? (
           <div className="empty-state">
             <ShieldCheck size={48} color="rgba(255,255,255,0.1)" />
             <p>No active reports. The platform is secure.</p>
           </div>
         ) : (
           <div className="reports-grid">
             {data?.reports?.map((r, i) => (
                <div key={i} className="report-card">
                  <div className="report-head">
                    <span className="report-time">
                       {new Date(r.timestamp).toLocaleString()}
                    </span>
                    <span className={`reason-badge ${r.reason}`}>{r.reason}</span>
                  </div>
                  <div className="report-body">
                    <p><strong>Reporter ID:</strong> <span className="mono">{r.reporter}</span></p>
                    <p><strong>Reported ID (Offender):</strong> <span className="mono highlight">{r.reported}</span></p>
                  </div>
                </div>
             ))}
           </div>
         )}
      </div>

      <style>{`
        .admin-dashboard {
          max-width: 1000px;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          height: 80vh;
          overflow: hidden;
          padding: 0;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(0,0,0,0.2);
        }
        .admin-stat-pill {
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.85rem;
          color: var(--accent-primary);
        }
        .admin-content {
          padding: 1.5rem;
          flex: 1;
          overflow-y: auto;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: var(--text-muted);
          gap: 1rem;
        }
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }
        .report-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 1.25rem;
        }
        .report-head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.5rem;
        }
        .report-time { font-size: 0.8rem; color: var(--text-muted); }
        .reason-badge {
           font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;
           text-transform: uppercase; font-weight: 700;
           background: rgba(239,68,68,0.2); color: #ef4444; border: 1px solid rgba(239,68,68,0.4);
        }
        .mono { font-family: monospace; font-size: 0.85rem; color: var(--text-muted); }
        .mono.highlight { color: #facc15; font-weight: 700; }
        .danger-text { color: #ef4444; }
      `}</style>
    </div>
  );
}
