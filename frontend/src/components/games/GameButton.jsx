// GameButton.jsx — 🎮 button + game picker menu
import React, { useState, useRef, useEffect } from 'react';

const GAMES = [
  { id: 'tictactoe',     name: 'Tic Tac Toe',        emoji: '⭕', desc: 'Classic 3×3 grid' },
  { id: 'connect4',      name: 'Connect 4',           emoji: '🔴', desc: 'Drop discs, 4 in a row' },
  { id: 'truthordare',   name: 'Truth or Dare',       emoji: '🎭', desc: 'You write the dares!' },
  { id: 'neverhaveiever',name: 'Never Have I Ever',   emoji: '🍻', desc: 'Write your own statements' },
  { id: 'thisorthat',    name: 'This or That',        emoji: '💞', desc: 'Pick your preference' },
];

export default function GameButton({ onRequest, cooldown }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (gameId) => {
    setOpen(false);
    onRequest(gameId);
  };

  return (
    <div className="game-btn-wrap" ref={ref}>
      <button
        type="button"
        className={`icon-btn game-trigger ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        title="Play a Game"
        disabled={cooldown > 0}
      >
        {cooldown > 0 ? <span className="cooldown-badge">{cooldown}s</span> : '🎮'}
      </button>

      {open && (
        <div className="game-menu glass-panel animate-fade-in">
          <div className="game-menu-header">
            <span>🎮 Choose a Game</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="game-list">
            {GAMES.map(g => (
              <button
                key={g.id}
                className="game-list-item"
                onClick={() => handleSelect(g.id)}
              >
                <span className="game-list-emoji">{g.emoji}</span>
                <div className="game-list-info">
                  <span className="game-list-name">{g.name}</span>
                  <span className="game-list-desc">{g.desc}</span>
                </div>
                <span className="game-list-arrow">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .game-btn-wrap { position: relative; flex-shrink: 0; }
        .game-trigger { position: relative; font-size: 1.15rem; }
        .cooldown-badge {
          font-size: 0.65rem;
          font-weight: 700;
          background: var(--accent-primary);
          color: #fff;
          border-radius: 99px;
          padding: 2px 5px;
        }
        .game-menu {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 0;
          width: 270px;
          border-radius: 18px;
          overflow: hidden;
          z-index: 200;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }
        .game-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--glass-border);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .game-menu-header button {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          line-height: 1;
        }
        .game-list { padding: 0.4rem; }
        .game-list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.65rem 0.75rem;
          background: none;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
          color: var(--text-main);
          font-family: inherit;
        }
        .game-list-item:hover { background: rgba(139,92,246,0.15); }
        .game-list-emoji { font-size: 1.4rem; flex-shrink: 0; }
        .game-list-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .game-list-name { font-weight: 700; font-size: 0.88rem; }
        .game-list-desc { font-size: 0.73rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .game-list-arrow { color: var(--text-muted); font-size: 1.2rem; flex-shrink: 0; }

        @media (max-width: 600px) {
          .game-menu {
            position: fixed;
            bottom: max(80px, env(safe-area-inset-bottom, 80px));
            left: 50%;
            transform: translateX(-50%);
            width: 90vw;
            max-width: 320px;
          }
        }
      `}</style>
    </div>
  );
}
