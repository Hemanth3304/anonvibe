// GameOverlay.jsx — Master orchestrator for all games
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import TicTacToe from './TicTacToe';
import Connect4 from './Connect4';
import TruthOrDare from './TruthOrDare';
import NeverHaveIEver from './NeverHaveIEver';
import ThisOrThat from './ThisOrThat';

const GAME_META = {
  tictactoe:    { name: 'Tic Tac Toe',       emoji: '⭕', hasToss: false },
  connect4:     { name: 'Connect 4',          emoji: '🔴', hasToss: false },
  truthordare:  { name: 'Truth or Dare',      emoji: '🎭', hasToss: true  },
  neverhaveiever:{ name: 'Never Have I Ever', emoji: '🍻', hasToss: true  },
  thisorthat:   { name: 'This or That',       emoji: '💞', hasToss: false },
};

// phase: 'request_sent'|'request_received'|'toss'|'playing'|'ended'
export default function GameOverlay({ socket, gameState, onAccept, onStart, onClose }) {
  const { phase, game, firstTurn, incomingGame } = gameState;
  const meta = GAME_META[game || incomingGame];

  // ── Toss state ──────────────────────────────────────────────────
  const [myTossChoice, setMyTossChoice]   = useState(null);
  const [tossLocked,   setTossLocked]     = useState(false);
  const [tossResult,   setTossResult]     = useState(null); // { winner, result }

  // ── End reason ──────────────────────────────────────────────────
  const [endReason, setEndReason] = useState('');

  useEffect(() => {
    socket.on('game:toss_result', (data) => {
      setTossResult(data);
    });
    socket.on('game:end', ({ reason }) => {
      setEndReason(reason || 'Game ended');
    });
    return () => {
      socket.off('game:toss_result');
      socket.off('game:end');
    };
  }, [socket]);

  const handleAccept = () => {
    if (onAccept) onAccept(incomingGame);
    else socket.emit('game:accept', { game: incomingGame });
  };
  const handleReject = () => {
    socket.emit('game:reject', {});
    onClose();
  };
  const handleToss = (choice) => {
    if (tossLocked) return;
    setMyTossChoice(choice);
    setTossLocked(true);
    socket.emit('game:toss', { choice });
  };
  const handleEndGame = (reason = 'Player left') => {
    socket.emit('game:end', { reason });
    onClose();
  };

  // ── Render phases ────────────────────────────────────────────────
  const overlayContent = (
    <div className="game-overlay-backdrop">
      <div className="game-overlay-panel glass-panel animate-fade-in">

        {/* ── Sent request: waiting ── */}
        {phase === 'request_sent' && (
          <div className="game-phase-center">
            <div className="game-big-emoji">{meta?.emoji}</div>
            <h2>Request Sent</h2>
            <p>Waiting for stranger to accept <strong>{meta?.name}</strong>…</p>
            <div className="game-pulse-ring" />
            <button className="game-btn danger" onClick={() => { socket.emit('game:cancel'); onClose(); }}>Cancel</button>
          </div>
        )}

        {/* ── Received request: accept/decline ── */}
        {phase === 'request_received' && (
          <div className="game-phase-center">
            <div className="game-big-emoji">{meta?.emoji}</div>
            <h2>Game Invite!</h2>
            <p>Stranger wants to play <strong>{meta?.name}</strong></p>
            <div className="game-action-row">
              <button className="game-btn success" onClick={handleAccept}>✅ Accept</button>
              <button className="game-btn danger"  onClick={handleReject}>❌ Decline</button>
            </div>
          </div>
        )}

        {/* ── Toss phase ── */}
        {phase === 'toss' && !tossResult && (
          <div className="game-phase-center">
            <div className="game-big-emoji">🪙</div>
            <h2>Coin Toss</h2>
            <p>Pick a side to decide who goes first!</p>
            {!tossLocked ? (
              <div className="game-action-row">
                <button className="game-btn coin" onClick={() => handleToss('heads')}>👑 Heads</button>
                <button className="game-btn coin" onClick={() => handleToss('tails')}>🦅 Tails</button>
              </div>
            ) : (
              <div className="toss-waiting">
                <div className="game-pulse-ring" />
                <p>You chose <strong>{myTossChoice}</strong> — waiting for the coin…</p>
              </div>
            )}
          </div>
        )}

        {/* ── Toss result ── */}
        {phase === 'toss' && tossResult && (
          <div className="game-phase-center">
            <div className="game-big-emoji toss-flip">{tossResult.result === 'heads' ? '👑' : '🦅'}</div>
            <h2>{tossResult.result.toUpperCase()}!</h2>
            <p className={tossResult.winner === 'me' ? 'toss-win' : 'toss-lose'}>
              {tossResult.winner === 'me' ? '🎉 You go first!' : '⏳ Stranger goes first!'}
            </p>
            <button className="game-btn primary" onClick={() => { 
                socket.emit('game:start_confirmed');
                if (onStart) onStart();
            }}>
              Start Game →
            </button>
          </div>
        )}

        {/* ── Playing ── */}
        {phase === 'playing' && (
          <div className="game-playing-wrapper">
            <div className="game-header">
              <span className="game-title-pill">{meta?.emoji} {meta?.name}</span>
              <div className="game-header-actions">
                <button className="game-icon-btn" title="Skip Turn" onClick={() => socket.emit('game:skip')}>⏭</button>
                <button className="game-icon-btn" title="End Game"  onClick={() => handleEndGame('Player ended game')}>✕</button>
              </div>
            </div>

            {game === 'tictactoe'     && <TicTacToe      socket={socket} firstTurn={firstTurn} onEnd={handleEndGame} />}
            {game === 'connect4'      && <Connect4        socket={socket} firstTurn={firstTurn} onEnd={handleEndGame} />}
            {game === 'truthordare'   && <TruthOrDare     socket={socket} firstTurn={firstTurn} onEnd={handleEndGame} />}
            {game === 'neverhaveiever'&& <NeverHaveIEver  socket={socket} firstTurn={firstTurn} onEnd={handleEndGame} />}
            {game === 'thisorthat'    && <ThisOrThat      socket={socket} firstTurn={firstTurn} onEnd={handleEndGame} />}
          </div>
        )}

        {/* ── Game ended ── */}
        {phase === 'ended' && (
          <div className="game-phase-center">
            <div className="game-big-emoji">🏁</div>
            <h2>Game Over</h2>
            <p>{endReason}</p>
            <button className="game-btn primary" onClick={onClose}>Back to Chat</button>
          </div>
        )}
      </div>

      <style>{`
        .game-overlay-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .game-overlay-panel {
          width: 100%;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 24px;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .game-phase-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          text-align: center;
          gap: 1rem;
        }
        .game-big-emoji {
          font-size: 4rem;
          line-height: 1;
          filter: drop-shadow(0 0 20px rgba(139,92,246,0.5));
        }
        .game-big-emoji.toss-flip {
          animation: tossSpin 0.7s ease-out;
        }
        @keyframes tossSpin {
          0%   { transform: rotateY(0deg);   opacity: 0; }
          50%  { transform: rotateY(360deg); opacity: 0.5; }
          100% { transform: rotateY(720deg); opacity: 1; }
        }
        .game-phase-center h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin: 0;
        }
        .game-phase-center p { color: var(--text-muted); margin: 0; }
        .game-action-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.5rem;
        }
        .game-btn {
          padding: 0.7rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .game-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .game-btn.primary { background: var(--accent-primary); color: #fff; }
        .game-btn.success { background: #22c55e; color: #fff; }
        .game-btn.danger  { background: #ef4444; color: #fff; }
        .game-btn.coin    { background: rgba(255,255,255,0.1); border: 2px solid var(--glass-border); color: var(--text-main); font-size: 1.1rem; padding: 0.8rem 2rem; }
        .game-btn.coin:hover { background: rgba(139,92,246,0.3); border-color: var(--accent-primary); }
        .toss-win  { color: #22c55e; font-weight: 700; font-size: 1.1rem; }
        .toss-lose { color: var(--text-muted); }
        .toss-waiting { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }

        /* Pulse ring */
        .game-pulse-ring {
          width: 50px; height: 50px;
          border: 3px solid var(--accent-primary);
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%       { transform: scale(1.4); opacity: 0.3; }
        }

        /* Playing wrapper */
        .game-playing-wrapper { display: flex; flex-direction: column; flex: 1; }
        .game-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--glass-border);
          flex-shrink: 0;
        }
        .game-title-pill {
          font-weight: 700;
          font-size: 0.95rem;
          background: rgba(139,92,246,0.15);
          padding: 4px 12px;
          border-radius: 99px;
          border: 1px solid rgba(139,92,246,0.3);
        }
        .game-header-actions { display: flex; gap: 0.5rem; }
        .game-icon-btn {
          background: rgba(255,255,255,0.07);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: 0.2s;
          color: var(--text-main);
        }
        .game-icon-btn:hover { background: rgba(239,68,68,0.2); }

        @media (max-width: 600px) {
          .game-overlay-panel { max-height: 95vh; border-radius: 16px; }
          .game-phase-center { padding: 2rem 1.25rem; }
          .game-big-emoji { font-size: 3rem; }
        }
      `}</style>
    </div>
  );

  return createPortal(overlayContent, document.body);
}
