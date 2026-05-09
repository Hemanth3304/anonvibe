import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Trash2, ShieldCheck, RefreshCw, LogOut, 
  LayoutDashboard, Users, Activity, Settings, ChevronRight,
  MessageSquare, Video, Zap, AlertTriangle, Clock, Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AdminDashboard({ onExit }) {
  const [password, setPassword] = useState('');
  const [authHeader, setAuthHeader] = useState('');
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, moderation, system

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const bearer = `Bearer ${password}`;
    try {
      const [reportsRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/sys-health/reports`, { headers: { Authorization: bearer } }),
        axios.get(`${API_URL}/api/stats/summary`)
      ]);
      setAuthHeader(bearer);
      setData(reportsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Admin Login Error:', err);
      const msg = err.response?.data?.error || err.message || 'Unknown error';
      setError(`Error: ${msg} (Status: ${err.response?.status || 'N/A'})`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    if (!authHeader) return;
    setLoading(true);
    try {
      const [reportsRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/api/sys-health/reports`, { headers: { Authorization: authHeader } }),
        axios.get(`${API_URL}/api/stats/summary`)
      ]);
      setData(reportsRes.data);
      setSummary(summaryRes.data);
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
      await axios.delete(`${API_URL}/api/sys-health/reports`, {
        headers: { Authorization: authHeader }
      });
      fetchData();
    } catch (err) {
      setError('Failed to clear reports');
    }
  };

  useEffect(() => {
    if (authHeader) {
      const id = setInterval(fetchData, 10000);
      return () => clearInterval(id);
    }
  }, [authHeader]);

  const stats = useMemo(() => [
    { label: 'Online Users', value: summary?.onlineUsers || 0, icon: Users, color: '#8b5cf6' },
    { label: 'Active Matches', value: data?.stats?.activeRooms || 0, icon: Video, color: '#ec4899' },
    { label: 'Total Matches', value: summary?.totalMatches || 0, icon: Zap, color: '#f59e0b' },
    { label: 'Messages Sent', value: summary?.messagesSent || 0, icon: MessageSquare, color: '#10b981' },
  ], [summary, data]);

  if (!authHeader) {
    return (
      <div className="admin-login-overlay">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-login-card glass-panel"
        >
          <div className="login-header">
            <div className="shield-blob">
              <ShieldAlert size={40} />
            </div>
            <h2>Admin Authentication</h2>
            <p>Access to this terminal is restricted. Please provide your authorization key.</p>
          </div>

          <form onSubmit={login}>
            <div className="input-group">
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoFocus
              />
              <ShieldCheck className="input-icon" size={18} />
            </div>
            
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-msg">{error}</motion.p>}
            
            <div className="login-actions">
              <button className="auth-btn primary" type="submit" disabled={loading}>
                {loading ? <RefreshCw className="spin" size={18} /> : 'Access Command Center'}
              </button>
              <button className="auth-btn secondary" type="button" onClick={onExit}>
                Return to App
              </button>
            </div>
          </form>
        </motion.div>

        <style>{`
          .admin-login-overlay {
            position: fixed; inset: 0; background: radial-gradient(circle at center, rgba(17,24,39,0.9), #000);
            display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 2rem;
          }
          .admin-login-card {
            max-width: 480px; width: 100%; padding: 3rem; text-align: center; border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .shield-blob {
            width: 80px; height: 80px; background: rgba(139,92,246,0.1); border-radius: 50%;
            display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;
            color: var(--accent-primary); box-shadow: 0 0 30px rgba(139,92,246,0.2);
          }
          .login-header h2 { font-size: 1.75rem; margin-bottom: 0.5rem; background: linear-gradient(to right, #fff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .login-header p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 2rem; line-height: 1.5; }
          .input-group { position: relative; margin-bottom: 1.5rem; }
          .input-group input {
            width: 100%; padding: 1rem 1rem 1rem 3rem; border-radius: 14px; border: 1px solid var(--glass-border);
            background: rgba(0,0,0,0.3); color: #fff; font-size: 1.1rem; transition: all 0.3s ease;
          }
          .input-group input:focus { border-color: var(--accent-primary); outline: none; box-shadow: 0 0 0 4px rgba(139,92,246,0.1); }
          .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
          .error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 1rem; font-weight: 500; }
          .login-actions { display: flex; flex-direction: column; gap: 0.75rem; }
          .auth-btn {
            padding: 1rem; border-radius: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none;
            display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          }
          .auth-btn.primary { background: var(--accent-primary); color: white; }
          .auth-btn.primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
          .auth-btn.secondary { background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid var(--glass-border); }
          .auth-btn.secondary:hover { background: rgba(255,255,255,0.1); color: #fff; }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-layout glass-panel">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <div className="brand-dot"></div>
            <span>ANONVIBE OPS</span>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={20} />
              <span>Overview</span>
              {activeTab === 'overview' && <motion.div layoutId="nav-indicator" className="nav-indicator" />}
            </button>
            <button 
              className={`nav-item ${activeTab === 'moderation' ? 'active' : ''}`}
              onClick={() => setActiveTab('moderation')}
            >
              <Users size={20} />
              <span>Moderation</span>
              {data?.reports?.length > 0 && <span className="badge">{data.reports.length}</span>}
              {activeTab === 'moderation' && <motion.div layoutId="nav-indicator" className="nav-indicator" />}
            </button>
            <button 
              className={`nav-item ${activeTab === 'system' ? 'active' : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <Activity size={20} />
              <span>System</span>
              {activeTab === 'system' && <motion.div layoutId="nav-indicator" className="nav-indicator" />}
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="nav-item logout" onClick={() => setAuthHeader('')}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <header className="admin-header">
            <div className="header-title">
              <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Control</h1>
              <p>Platform status and administration</p>
            </div>
            <div className="header-actions">
              <button className="icon-btn-round" onClick={fetchData} disabled={loading}>
                <RefreshCw size={18} className={loading ? 'spin' : ''} />
              </button>
              <button className="exit-btn" onClick={onExit}>Close Terminal</button>
            </div>
          </header>

          <div className="content-scroll">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="tab-content"
                >
                  <div className="stats-grid">
                    {stats.map((stat, i) => (
                      <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                          <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                          <span className="stat-label">{stat.label}</span>
                          <span className="stat-value">{stat.value.toLocaleString()}</span>
                        </div>
                        <div className="stat-trend positive">+12%</div>
                      </div>
                    ))}
                  </div>

                  <div className="overview-row">
                    <div className="chart-placeholder glass-panel">
                      <div className="placeholder-header">
                        <h3>Traffic Analytics</h3>
                        <div className="period-tabs">
                          <button className="active">1H</button>
                          <button>24H</button>
                          <button>7D</button>
                        </div>
                      </div>
                      <div className="mock-chart">
                        {[40, 70, 45, 90, 65, 80, 50, 60, 40, 75, 95, 60].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }} 
                            animate={{ height: `${h}%` }}
                            className="chart-bar"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="recent-activity glass-panel">
                      <h3>Recent Alerts</h3>
                      <div className="activity-list">
                        <div className="activity-item">
                          <div className="activity-icon warning"><AlertTriangle size={14} /></div>
                          <div className="activity-text">
                            <p>High report volume detected</p>
                            <span>2 mins ago</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-icon success"><ShieldCheck size={14} /></div>
                          <div className="activity-text">
                            <p>System health check passed</p>
                            <span>15 mins ago</span>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-icon info"><Clock size={14} /></div>
                          <div className="activity-text">
                            <p>Daily stats snapshot created</p>
                            <span>1 hour ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'moderation' && (
                <motion.div 
                  key="moderation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="tab-content"
                >
                  <div className="section-header">
                    <div className="header-info">
                      <h3>User Reports</h3>
                      <p>Managing {data?.reports?.length || 0} active reports</p>
                    </div>
                    {data?.reports?.length > 0 && (
                      <button className="action-btn danger" onClick={clearAllReports}>
                        <Trash2 size={16} />
                        Clear All Reports
                      </button>
                    )}
                  </div>

                  {data?.reports?.length === 0 ? (
                    <div className="empty-state-v2">
                      <div className="empty-icon"><ShieldCheck size={60} /></div>
                      <h4>No reports to review</h4>
                      <p>Your platform is currently clean and safe.</p>
                    </div>
                  ) : (
                    <div className="reports-table-container glass-panel">
                      <table className="reports-table">
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Offender</th>
                            <th>Reporter</th>
                            <th>Reason</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.reports.map((r, i) => (
                            <tr key={i}>
                              <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
                              <td><span className="id-badge offender">{r.reported.slice(0, 8)}</span></td>
                              <td><span className="id-badge reporter">{r.reporter.slice(0, 8)}</span></td>
                              <td><span className={`reason-tag ${r.reason}`}>{r.reason}</span></td>
                              <td>
                                <button className="table-action" title="View Context"><ChevronRight size={16} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div 
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="tab-content"
                >
                   <div className="system-grid">
                      <div className="sys-card glass-panel">
                        <div className="sys-head">
                          <Server size={20} color="#8b5cf6" />
                          <h4>Server Health</h4>
                        </div>
                        <div className="sys-body">
                          <div className="sys-metric">
                            <div className="metric-label"><span>CPU Usage</span><span>24%</span></div>
                            <div className="progress-bg"><div className="progress-fill" style={{width:'24%', background:'#8b5cf6'}}></div></div>
                          </div>
                          <div className="sys-metric">
                            <div className="metric-label"><span>Memory</span><span>512MB / 1GB</span></div>
                            <div className="progress-bg"><div className="progress-fill" style={{width:'50%', background:'#ec4899'}}></div></div>
                          </div>
                          <div className="sys-metric">
                            <div className="metric-label"><span>Disk</span><span>1.2GB / 10GB</span></div>
                            <div className="progress-bg"><div className="progress-fill" style={{width:'12%', background:'#10b981'}}></div></div>
                          </div>
                        </div>
                      </div>

                      <div className="sys-card glass-panel">
                        <div className="sys-head">
                          <Activity size={20} color="#10b981" />
                          <h4>Socket.io Streams</h4>
                        </div>
                        <div className="sys-body">
                           <div className="connection-info">
                              <div className="conn-stat">
                                 <span>Active Connections</span>
                                 <strong>{summary?.onlineUsers || 0}</strong>
                              </div>
                              <div className="conn-stat">
                                 <span>Msg Throughput</span>
                                 <strong>12/sec</strong>
                              </div>
                              <div className="conn-stat">
                                 <span>Latency (avg)</span>
                                 <strong>42ms</strong>
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="sys-card glass-panel wide">
                         <div className="sys-head">
                            <MessageSquare size={20} color="#f59e0b" />
                            <h4>Live Event Log</h4>
                         </div>
                         <div className="log-viewer">
                            <div className="log-line"><span>[10:42:15]</span> <span className="tag-info">INFO</span> Match established between S-129 and S-455</div>
                            <div className="log-line"><span>[10:42:18]</span> <span className="tag-warn">WARN</span> User report submitted: Offensive behavior</div>
                            <div className="log-line"><span>[10:42:22]</span> <span className="tag-info">INFO</span> Redis cache cleanup complete</div>
                            <div className="log-line"><span>[10:42:30]</span> <span className="tag-info">INFO</span> Guest registered: Anonymous-882</div>
                            <div className="log-line"><span>[10:42:35]</span> <span className="tag-info">INFO</span> Connection closed: S-129</div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <style>{`
        .admin-container {
          position: fixed; inset: 0; background: #000; z-index: 1000;
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
          color: #fff; font-family: 'Inter', system-ui, sans-serif;
        }
        .admin-layout {
          width: 100%; max-width: 1400px; height: 100%; display: grid;
          grid-template-columns: 280px 1fr; overflow: hidden; border-radius: 24px;
        }
        
        /* Sidebar Styles */
        .admin-sidebar {
          background: rgba(255,255,255,0.02); border-right: 1px solid var(--glass-border);
          display: flex; flex-direction: column; padding: 2rem 1rem;
        }
        .sidebar-brand {
          display: flex; align-items: center; gap: 0.75rem; padding: 0 1rem; margin-bottom: 3rem;
          font-weight: 800; font-size: 1.1rem; letter-spacing: 1px; color: #fff;
        }
        .brand-dot { width: 12px; height: 12px; background: var(--accent-primary); border-radius: 3px; box-shadow: 0 0 15px var(--accent-primary); }
        .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .nav-item {
          display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; border-radius: 12px;
          color: var(--text-muted); font-weight: 500; transition: all 0.2s; position: relative;
          background: transparent; border: none; width: 100%; cursor: pointer;
        }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .nav-item.active { color: var(--accent-primary); background: rgba(139,92,246,0.1); }
        .nav-indicator { position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; background: var(--accent-primary); border-radius: 0 4px 4px 0; }
        .badge { background: #ef4444; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 6px; margin-left: auto; font-weight: 800; }
        .logout { margin-top: auto; color: #ef4444; }
        .logout:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

        /* Main Content Styles */
        .admin-main { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: rgba(0,0,0,0.2); }
        .admin-header { padding: 2rem; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; }
        .header-title h1 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .header-title p { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 0; }
        .header-actions { display: flex; gap: 1rem; align-items: center; }
        .exit-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 0.6rem 1.2rem; border-radius: 10px; color: #fff; font-weight: 600; cursor: pointer; }
        .exit-btn:hover { background: rgba(255,255,255,0.1); }
        
        .content-scroll { flex: 1; overflow-y: auto; padding: 2rem; }
        .tab-content { display: flex; flex-direction: column; gap: 2rem; }

        /* Overview Grid */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .stat-card {
          background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 20px;
          padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; position: relative;
          transition: transform 0.3s ease;
        }
        .stat-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.05); }
        .stat-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-label { font-size: 0.85rem; color: var(--text-muted); display: block; margin-bottom: 0.25rem; }
        .stat-value { font-size: 1.5rem; font-weight: 800; }
        .stat-trend { position: absolute; top: 1rem; right: 1rem; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .stat-trend.positive { color: #10b981; background: rgba(16,185,129,0.1); }

        .overview-row { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .chart-placeholder { padding: 1.5rem; border-radius: 20px; min-height: 300px; display: flex; flex-direction: column; }
        .placeholder-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
        .period-tabs { display: flex; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 8px; }
        .period-tabs button { background: transparent; border: none; color: var(--text-muted); padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
        .period-tabs button.active { background: var(--accent-primary); color: #fff; }
        .mock-chart { flex: 1; display: flex; align-items: flex-end; gap: 8px; padding-bottom: 1rem; }
        .chart-bar { flex: 1; background: linear-gradient(to top, var(--accent-primary), #ec4899); border-radius: 4px 4px 0 0; min-height: 10px; }

        .recent-activity { padding: 1.5rem; border-radius: 20px; }
        .activity-list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1.5rem; }
        .activity-item { display: flex; gap: 1rem; align-items: flex-start; }
        .activity-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .activity-icon.warning { background: rgba(245,158,11,0.2); color: #f59e0b; }
        .activity-icon.success { background: rgba(16,185,129,0.2); color: #10b981; }
        .activity-icon.info { background: rgba(59,130,246,0.2); color: #3b82f6; }
        .activity-text p { margin: 0; font-size: 0.9rem; font-weight: 500; }
        .activity-text span { font-size: 0.75rem; color: var(--text-muted); }

        /* Moderation Table */
        .section-header { display: flex; justify-content: space-between; align-items: center; }
        .action-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 10px; border: none; cursor: pointer; font-weight: 600; }
        .action-btn.danger { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
        .action-btn.danger:hover { background: #ef4444; color: #fff; }
        
        .reports-table-container { border-radius: 20px; overflow: hidden; }
        .reports-table { width: 100%; border-collapse: collapse; text-align: left; }
        .reports-table th { padding: 1.25rem; background: rgba(255,255,255,0.02); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .reports-table td { padding: 1.25rem; border-top: 1px solid var(--glass-border); font-size: 0.9rem; }
        .id-badge { font-family: monospace; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; }
        .id-badge.offender { background: rgba(239,68,68,0.1); color: #ef4444; }
        .id-badge.reporter { background: rgba(59,130,246,0.1); color: #3b82f6; }
        .reason-tag { font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; }
        .reason-tag.offensive { background: #ef4444; color: #fff; }
        .reason-tag.spam { background: #f59e0b; color: #fff; }
        .table-action { background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
        .table-action:hover { color: #fff; }

        /* System Grid */
        .system-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .sys-card { padding: 1.5rem; border-radius: 20px; }
        .sys-card.wide { grid-column: span 2; }
        .sys-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .sys-head h4 { margin: 0; font-size: 1.1rem; }
        .sys-metric { margin-bottom: 1.25rem; }
        .metric-label { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-muted); }
        .progress-bg { height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 3px; }
        
        .connection-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .conn-stat { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 12px; }
        .conn-stat span { font-size: 0.75rem; color: var(--text-muted); }
        .conn-stat strong { font-size: 1.25rem; color: var(--accent-primary); }

        .log-viewer { background: #000; border-radius: 12px; padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; min-height: 200px; }
        .log-line { margin-bottom: 0.5rem; color: #888; }
        .log-line span { color: #555; }
        .tag-info { color: #10b981; font-weight: 700; margin: 0 4px; }
        .tag-warn { color: #f59e0b; font-weight: 700; margin: 0 4px; }

        .empty-state-v2 { text-align: center; padding: 4rem 2rem; color: var(--text-muted); }
        .empty-icon { margin-bottom: 1.5rem; color: rgba(255,255,255,0.05); }

        .icon-btn-round { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--glass-border); background: rgba(255,255,255,0.05); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .icon-btn-round:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: var(--accent-primary); }
        .icon-btn-round:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 1024px) {
          .admin-layout { grid-template-columns: 1fr; }
          .admin-sidebar { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .overview-row { grid-template-columns: 1fr; }
          .system-grid { grid-template-columns: 1fr; }
          .sys-card.wide { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
