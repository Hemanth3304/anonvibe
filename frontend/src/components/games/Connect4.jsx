// Connect4.jsx — 6×7 grid, drop mechanics, full win detection
import React, { useState, useEffect, useCallback } from 'react';

const ROWS = 6, COLS = 7;
const EMPTY = null;

function createBoard() {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
}

function checkWin(board, row, col, color) {
  const dirs = [[0,1],[1,0],[1,1],[1,-1]];
  for (const [dr, dc] of dirs) {
    let count = 1;
    const cells = [[row,col]];
    for (let d = 1; d <= 3; d++) {
      const r = row + dr*d, c = col + dc*d;
      if (r<0||r>=ROWS||c<0||c>=COLS||board[r][c]!==color) break;
      cells.push([r,c]); count++;
    }
    for (let d = 1; d <= 3; d++) {
      const r = row - dr*d, c = col - dc*d;
      if (r<0||r>=ROWS||c<0||c>=COLS||board[r][c]!==color) break;
      cells.push([r,c]); count++;
    }
    if (count >= 4) return cells;
  }
  return null;
}

function dropDisc(board, col, color) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) {
      const next = board.map(row => [...row]);
      next[r][col] = color;
      return { next, row: r };
    }
  }
  return null;
}

export default function Connect4({ socket, firstTurn, onEnd }) {
  const myColor    = firstTurn === 'me' ? 'red' : 'yellow';
  const theirColor = firstTurn === 'me' ? 'yellow' : 'red';

  const [board,   setBoard]   = useState(createBoard());
  const [myTurn,  setMyTurn]  = useState(firstTurn === 'me');
  const [winCells,setWinCells]= useState([]);
  const [winner,  setWinner]  = useState(null);
  const [hover,   setHover]   = useState(null);

  const processMove = useCallback((board, row, col, color) => {
    const wc = checkWin(board, row, col, color);
    if (wc) {
      setWinCells(wc.map(([r,c]) => `${r}-${c}`));
      setWinner(color);
    } else if (board[0].every(c => c !== EMPTY)) {
      setWinner('draw');
    }
  }, []);

  useEffect(() => {
    socket.on('game:move', ({ col, color, row }) => {
      setBoard(prev => {
        const { next } = dropDisc(prev, col, color) || { next: prev };
        processMove(next, row, col, color);
        return next;
      });
      setMyTurn(true);
    });
    return () => socket.off('game:move');
  }, [socket, processMove]);

  const handleDrop = (col) => {
    if (!myTurn || winner) return;
    const result = dropDisc(board, col, myColor);
    if (!result) return;
    const { next, row } = result;
    setBoard(next);
    setMyTurn(false);
    processMove(next, row, col, myColor);
    socket.emit('game:move', { col, color: myColor, row });
  };

  const reset = () => {
    setBoard(createBoard());
    setWinCells([]);
    setWinner(null);
    setMyTurn(firstTurn === 'me');
    socket.emit('game:move', { type: 'reset' });
  };

  const statusText = winner
    ? winner === 'draw' ? "It's a draw! 🤝"
    : winner === myColor ? '🎉 You win!'
    : '😢 Stranger wins!'
    : myTurn ? '🟢 Your turn' : "⏳ Stranger's turn";

  return (
    <div className="c4-wrap">
      <div className={`c4-status ${myTurn && !winner ? 'my-turn' : ''}`}>{statusText}</div>

      {/* Column hover arrows */}
      <div className="c4-arrows">
        {Array(COLS).fill(0).map((_, col) => (
          <div
            key={col}
            className={`c4-arrow-cell ${hover === col && myTurn && !winner ? 'show' : ''}`}
          >▼</div>
        ))}
      </div>

      {/* Board */}
      <div
        className="c4-board"
        onMouseLeave={() => setHover(null)}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              className={`c4-cell
                ${cell === 'red'    ? 'red-chip'    : ''}
                ${cell === 'yellow' ? 'yellow-chip' : ''}
                ${winCells.includes(`${r}-${c}`) ? 'c4-win-cell' : ''}
                ${!cell && myTurn && !winner && hover === c ? 'c4-hover' : ''}
              `}
              onMouseEnter={() => setHover(c)}
              onClick={() => handleDrop(c)}
              disabled={!!winner || !myTurn}
            />
          ))
        )}
      </div>

      {/* Legend */}
      <div className="c4-legend">
        <span className="c4-legend-dot" style={{ background: myColor === 'red' ? '#ef4444' : '#facc15' }} /> You
        <span className="c4-legend-dot" style={{ background: theirColor === 'red' ? '#ef4444' : '#facc15', marginLeft: '1rem' }} /> Stranger
      </div>

      {winner && (
        <div className="ttt-actions" style={{ marginTop: '0.75rem' }}>
          <button className="game-btn primary" onClick={reset}>🔄 Play Again</button>
          <button className="game-btn danger"  onClick={() => onEnd('Player ended game')}>Leave</button>
        </div>
      )}

      <style>{`
        .c4-wrap { padding: 1rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
        .c4-status {
          font-size: 0.88rem; font-weight: 600;
          padding: 5px 14px; border-radius: 99px;
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--glass-border);
          transition: 0.3s;
        }
        .c4-status.my-turn { border-color: var(--accent-primary); background: rgba(139,92,246,0.15); }
        .c4-arrows {
          display: grid;
          grid-template-columns: repeat(7, 44px);
          gap: 3px;
        }
        .c4-arrow-cell {
          text-align: center;
          color: var(--accent-primary);
          font-size: 0.75rem;
          visibility: hidden;
          transition: 0.15s;
        }
        .c4-arrow-cell.show { visibility: visible; }
        .c4-board {
          display: grid;
          grid-template-columns: repeat(7, 44px);
          grid-template-rows: repeat(6, 44px);
          gap: 3px;
          background: rgba(255,255,255,0.04);
          padding: 6px;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
        }
        .c4-cell {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          border: 2px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: all 0.15s;
          padding: 0;
        }
        .c4-cell.red-chip    { background: #ef4444; border-color: #f87171; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
        .c4-cell.yellow-chip { background: #facc15; border-color: #fde68a; box-shadow: 0 0 8px rgba(250,204,21,0.5); }
        .c4-cell.c4-win-cell { animation: c4Win 0.5s ease infinite alternate; }
        @keyframes c4Win { from{filter:brightness(1)} to{filter:brightness(1.5) saturate(1.5)} }
        .c4-cell.c4-hover { background: rgba(139,92,246,0.2); border-color: var(--accent-primary); }
        .c4-cell:disabled { cursor: default; }
        .c4-legend { display: flex; align-items: center; font-size: 0.8rem; color: var(--text-muted); }
        .c4-legend-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .ttt-actions { display: flex; gap: 0.75rem; }

        @media (max-width: 420px) {
          .c4-board { grid-template-columns: repeat(7, 38px); grid-template-rows: repeat(6, 38px); gap: 2px; padding: 4px; }
          .c4-cell { width: 38px; height: 38px; }
          .c4-arrows { grid-template-columns: repeat(7, 38px); gap: 2px; }
        }
      `}</style>
    </div>
  );
}
