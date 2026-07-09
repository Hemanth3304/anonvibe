import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { io } from 'socket.io-client';
import { Share2 } from 'lucide-react';
import Entrance from './components/Entrance';
const ChatRoom      = lazy(() => import('./components/ChatRoom'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
import './index.css';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState('entrance'); // 'entrance' | 'matching' | 'chat'
  const [profile, setProfile] = useState(null);
  const [partner, setPartner] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [inviteRoomId, setInviteRoomId] = useState(null);
  const [isWaitingPrivate, setIsWaitingPrivate] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true, // Connect immediately on load
    });

    setSocket(newSocket);

    newSocket.on('online:count', (count) => setOnlineCount(count));
    
    newSocket.on('guest:registered', () => {
      // Background registration complete, ensure we are in matching queue
      newSocket.emit('queue:join');
    });

    newSocket.on('match:found', (data) => {
      setPartner(data);
      setView('chat');
    });

    newSocket.on('stranger:disconnected', () => {
      setPartner(null);
      // Automatically search for next
      setView('matching');
      newSocket.emit('queue:join');
    });

    newSocket.on('error', (err) => {
      alert(err.message);
      setView('entrance');
    });

    newSocket.on('room:waiting_private', ({ roomId }) => {
      setInviteRoomId(roomId);
      setIsWaitingPrivate(true);
      setView('matching');
    });

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        setView('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // ── Keep backend warm (prevents Render free-tier cold start delay) ──
    const ping = () => fetch(`${SOCKET_URL}/api/health`, { method: 'GET', keepalive: true }).catch(() => {});
    ping(); // immediate ping on load
    const keepAlive = setInterval(ping, 14 * 60 * 1000); // every 14 min

    // Check for invite code in URL
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    if (invite) {
      setInviteRoomId(invite);
    }

    return () => {
      newSocket.close();
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(keepAlive);
    };
  }, []);

  const handleRegister = (data) => {
    setProfile(data);
    setView('matching'); // Optimistic UI: Switch instantly
    socket.emit('guest:register', data);
    
    if (inviteRoomId) {
      socket.emit('room:join_private', { roomId: inviteRoomId });
    }
  };

  const handleNext = () => {
    setPartner(null);
    setView('matching');
    socket.emit('stranger:next');
    socket.emit('queue:join');
  };

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
      document.body.className = theme;
      localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleShare = async () => {
      const shareData = {
        title: 'AnonVibe',
        text: 'Join me on AnonVibe - Anonymously connect with the world and play games!',
        url: window.location.origin
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.origin);
          alert('Link copied to clipboard! Share it with your friends 🚀');
        }
      } catch (err) {
        console.error('Share failed:', err);
      }
    };

    return (
      <div className={`app-container${view === 'chat' ? ' view-chat' : ''}`}>
        <header>
          <div className="logo">AnonVibe</div>
          <div className="header-right">
            <button className="icon-btn share-btn" onClick={handleShare} title="Share AnonVibe">
              <Share2 size={20} />
            </button>
            <label className="theme-switch" title="Toggle Theme">
              <input 
                type="checkbox" 
                checked={theme === 'dark'} 
                onChange={toggleTheme} 
              />
              <span className="theme-slider round"></span>
            </label>
            <div className="online-indicator">
              <span className="dot"></span>
              {onlineCount > 0 ? `${onlineCount} Strangers Online` : 'Live Matching Now'}
            </div>
          </div>
        </header>

        <Suspense fallback={<div className="loading-view" style={{display:'flex',alignItems:'center',justifyContent:'center',flex:1}}><div className="loader" /></div>}>
          <main>
          {view === 'entrance' && (
            <Entrance 
              onRegister={handleRegister} 
              onlineCount={onlineCount} 
              inviteRoomId={inviteRoomId}
              onJoinPrivate={(id) => {
                setInviteRoomId(id);
                handleRegister(profile || { gender: 'unknown', mode: 'text' });
              }}
            />
          )}

          {view === 'matching' && (
            <div className="loading-view glass-panel" style={{ animation: 'fadeIn 0.2s ease-out forwards' }}>
              <div className="loader"></div>
              <h2>Searching for a stranger…</h2>
              {isWaitingPrivate 
                ? <p>Waiting for your friend to join room <strong style={{ color: 'var(--accent-primary)' }}>{inviteRoomId}</strong></p>
                : (profile?.preference
                  ? <p>Looking for someone interested in <strong style={{ color: 'var(--accent-primary)' }}>"{profile.preference}"</strong></p>
                  : <p>Finding your perfect anonymous match.</p>
                )
              }
              <button
                className="glass-button"
                style={{ marginTop: '1.5rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
                onClick={() => { socket.emit('queue:leave'); setView('entrance'); }}
              >
                Cancel
              </button>
            </div>
          )}

          {view === 'chat' && (
            <ChatRoom 
              socket={socket} 
              partner={partner}
              mode={profile?.mode || 'text'}
              onNext={handleNext} 
            />
          )}

          {view === 'admin' && (
            <AdminDashboard onExit={() => setView('entrance')} />
          )}
        </main>
        </Suspense>

      <style>{`
        .dot {
          height: 8px;
          width: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 0 10px #22c55e;
        }
        .online-indicator {
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .loading-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          text-align: center;
        }
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid var(--accent-primary);
          border-bottom-color: transparent;
          border-radius: 50%;
          margin-bottom: 2rem;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .loading-view h2 { font-size: 1.2rem; }
          .loading-view p { font-size: 0.85rem; }
          .loader { width: 36px; height: 36px; margin-bottom: 1.25rem; }
        }
      `}</style>
    </div>
  );
}

export default App;
