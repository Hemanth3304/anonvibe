import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Entrance from './components/Entrance';
import ChatRoom from './components/ChatRoom';
import './index.css';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState('entrance'); // 'entrance' | 'matching' | 'chat'
  const [profile, setProfile] = useState(null);
  const [partner, setPartner] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
    });

    setSocket(newSocket);

    newSocket.on('online:count', (count) => setOnlineCount(count));
    
    newSocket.on('guest:registered', () => {
      setView('matching');
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

    return () => newSocket.close();
  }, []);

  const handleRegister = (data) => {
    setProfile(data);
    socket.connect();
    socket.emit('guest:register', data);
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

    return (
      <div className={`app-container${view === 'chat' ? ' view-chat' : ''}`}>
        <header>
          <div className="logo">AnonVibe</div>
          <div className="header-right">
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
              {onlineCount} Strangers Online
            </div>
          </div>
        </header>


        <main>
          {view === 'entrance' && (
            <Entrance onRegister={handleRegister} />
          )}

          {view === 'matching' && (
            <div className="loading-view glass-panel animate-fade-in">
              <div className="loader"></div>
              <h2>Searching for a stranger…</h2>
              {profile?.preference
                ? <p>Looking for someone interested in <strong style={{ color: 'var(--accent-primary)' }}>"{profile.preference}"</strong></p>
                : <p>Finding your perfect anonymous match.</p>
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
        </main>

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
