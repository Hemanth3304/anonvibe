// TicTacToe.jsx — Full 3×3 game with win detection, synced via socket
import React, { useState, useEffect, useCallback } from 'react';

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],          // diagonals
];

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: 'draw', line: [] };
  return null;
}

export default function TicTacToe({ socket, firstTurn, onEnd }) {
  const mySymbol     = firstTurn === 'me' ? 'X' : 'O';
  const theirSymbol  = firstTurn === 'me' ? 'O' : 'X';

  const [board,     setBoard]     = useState(Array(9).fill(null));
  const [myTurn,    setMyTurn]    = useState(firstTurn === 'me');
  const [result,    setResult]    = useState(null); // null | { winner, line }
  const [scores,    setScores]    = useState({ me: 0, them: 0 });
  const [winCells,  setWinCells]  = useState([]);

  const applyResult = useCallback((board) => {
    const res = checkWinner(board);
    if (res) {
      setResult(res);
      setWinCells(res.line);
      if (res.winner === mySymbol)    setScores(s => ({ ...s, me:   s.me   + 1 }));
      if (res.winner === theirSymbol) setScores(s => ({ ...s, them: s.them + 1 }));
    }
  }, [mySymbol, theirSymbol]);

  useEffect(() => {
    socket.on('game:move', ({ index, symbol }) => {
      setBoard(prev => {
        const next = [...prev];
        next[index] = symbol;
        applyResult(next);
        return next;
      });
      setMyTurn(true);
    });
    return () => socket.off('game:move');
  }, [socket, applyResult]);

  const handleClick = (index) => {
    if (!myTurn || board[index] || result) return;
    const next = [...board];
    next[index] = mySymbol;
    setBoard(next);
    setMyTurn(false);
    socket.emit('game:move', { index, symbol: mySymbol });
    applyResult(next);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setResult(null);
    setWinCells([]);
    setMyTurn(firstTurn === 'me');
    socket.emit('game:move', { type: 'reset' });
  };

  const statusText = result
    ? result.winner === 'draw' ? "It's a draw! 🤝"
    : result.winner === mySymbol ? '🎉 You win!'
    : '😢 Stranger wins!'
    : myTurn ? '🟢 Your turn' : '⏳ Stranger\'s turn';

  return (
    <div className="ttt-wrap">
      {/* Scoreboard */}
      <div className="ttt-scores">
        <div className="ttt-score-box me">
          <span>You ({mySymbol})</span>
          <strong>{scores.me}</strong>
        </div>
        <div className="ttt-score-box draw">VS</div>
        <div className="ttt-score-box them">
          <span>Stranger ({theirSymbol})</span>
          <strong>{scores.them}</strong>
        </div>
      </div>

      {/* Status */}
      <div className={`ttt-status ${myTurn ? 'my-turn' : ''}`}>{statusText}</div>

      {/* Board */}
      <div className="ttt-board">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`ttt-cell
              ${cell === 'X' ? 'x-cell' : cell === 'O' ? 'o-cell' : ''}
              ${winCells.includes(i) ? 'win-cell' : ''}
              ${!cell && myTurn && !result ? 'hoverable' : ''}
            `}
            onClick={() => handleClick(i)}
            disabled={!!cell || !myTurn || !!result}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Actions after game */}
      {result && (
        <div className="ttt-actions">
          <button className="game-btn primary" onClick={resetGame}>🔄 Play Again</button>
          <button className="game-btn danger"  onClick={() => onEnd('Player ended game')}>Leave</button>
        </div>
      )}

      <style>{`
        .ttt-wrap { padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .ttt-scores {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 0.5rem;
          width: 100%;
        }
        .ttt-score-box {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 0.6rem;
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .ttt-score-box span { font-size: 0.72rem; color: var(--text-muted); }
        .ttt-score-box strong { font-size: 1.4rem; font-weight: 800; }
        .ttt-score-box.me strong  { color: #818cf8; }
        .ttt-score-box.them strong{ color: #f472b6; }
        .ttt-score-box.draw { background: none; font-weight: 700; color: var(--text-muted); font-size: 0.9rem; align-self: center; }
        .ttt-status {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 99px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--glass-border);
          transition: 0.3s;
        }
        .ttt-status.my-turn { border-color: var(--accent-primary); background: rgba(139,92,246,0.15); }
        .ttt-board {
          display: grid;
          grid-template-columns: repeat(3, 96px);
          grid-template-rows: repeat(3, 96px);
          gap: 6px;
        }
        .ttt-cell {
          background: rgba(255,255,255,0.05);
          border: 2px solid var(--glass-border);
          border-radius: 14px;
          font-size: 2.2rem;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.15s;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-main);
        }
        .ttt-cell.hoverable:hover { background: rgba(139,92,246,0.15); border-color: var(--accent-primary); transform: scale(1.05); }
        .ttt-cell.x-cell { color: #818cf8; }
        .ttt-cell.o-cell { color: #f472b6; }
        .ttt-cell.win-cell { background: rgba(139,92,246,0.25); border-color: var(--accent-primary); animation: winPulse 0.6s ease; }
        @keyframes winPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .ttt-cell:disabled { cursor: default; }
        .ttt-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }

        @media (max-width: 400px) {
          .ttt-board { grid-template-columns: repeat(3, 80px); grid-template-rows: repeat(3, 80px); }
          .ttt-cell { font-size: 1.8rem; border-radius: 10px; }
        }
      `}</style>
    </div>
  );
}
