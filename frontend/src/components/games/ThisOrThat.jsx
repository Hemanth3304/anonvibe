// ThisOrThat.jsx — User writes both options, both pick, simultaneous reveal
import React, { useState, useEffect } from 'react';

const DEFAULT_PROMPTS = [
  ['Beach 🏖️', 'Mountains 🏔️'],
  ['Coffee ☕', 'Tea 🍵'],
  ['Night Owl 🦉', 'Early Bird 🐦'],
  ['Cats 🐱', 'Dogs 🐶'],
  ['Movies 🎬', 'Series 📺'],
  ['Pizza 🍕', 'Burger 🍔'],
  ['Summer ☀️', 'Winter ❄️'],
];

export default function ThisOrThat({ socket, firstTurn, onEnd }) {
  const iAmProposer = firstTurn === 'me';

  const [phase,      setPhase]      = useState('proposing'); // proposing|picking|revealing|done
  const [isProposer, setIsProposer] = useState(iAmProposer);
  const [optA,       setOptA]       = useState('');
  const [optB,       setOptB]       = useState('');
  const [options,    setOptions]    = useState(null);   // { a, b }
  const [myPick,     setMyPick]     = useState(null);
  const [theirPick,  setTheirPick]  = useState(null);
  const [rounds,     setRounds]     = useState(0);
  const [matches,    setMatches]    = useState(0);

  useEffect(() => {
    socket.on('game:message', ({ type, value }) => {
      if (type === 'tot:options') {
        setOptions(value);
        setPhase('picking');
        setMyPick(null);
        setTheirPick(null);
      }
      if (type === 'tot:pick') {
        setTheirPick(value);
      }
      if (type === 'tot:next') {
        setRounds(r => r + 1);
        setPhase('proposing');
        setIsProposer(p => !p);
        setOptions(null);
        setMyPick(null);
        setTheirPick(null);
        setOptA(''); setOptB('');
      }
    });
    return () => socket.off('game:message');
  }, [socket]);

  // When both picks are in, reveal
  useEffect(() => {
    if (myPick && theirPick) {
      setPhase('revealing');
      if (myPick === theirPick) setMatches(m => m + 1);
    }
  }, [myPick, theirPick]);

  const useRandomPrompt = () => {
    const [a, b] = DEFAULT_PROMPTS[Math.floor(Math.random() * DEFAULT_PROMPTS.length)];
    setOptA(a); setOptB(b);
  };

  const sendOptions = () => {
    if (!optA.trim() || !optB.trim()) return;
    const opts = { a: optA.trim(), b: optB.trim() };
    setOptions(opts);
    socket.emit('game:message', { type: 'tot:options', value: opts });
    setPhase('picking');
    setMyPick(null);
    setTheirPick(null);
  };

  const sendPick = (val) => {
    setMyPick(val);
    socket.emit('game:message', { type: 'tot:pick', value: val });
  };

  const nextRound = () => {
    socket.emit('game:message', { type: 'tot:next' });
    setRounds(r => r + 1);
    setPhase('proposing');
    setIsProposer(p => !p);
    setOptions(null);
    setMyPick(null);
    setTheirPick(null);
    setOptA(''); setOptB('');
  };

  return (
    <div className="tot-wrap">
      <div className="tot-header">
        <span className="tot-title">💞 This or That</span>
        <span className="tot-matches">🤝 {matches} matches</span>
      </div>
      <div className="tot-round">Round {rounds + 1}</div>

      {/* ── Proposer writes options ── */}
      {phase === 'proposing' && isProposer && (
        <div className="tot-phase">
          <p className="tot-label">Your turn — write two options!</p>
          <div className="tot-options-input">
            <input
              className="tot-input"
              value={optA}
              onChange={e => setOptA(e.target.value)}
              placeholder="Option A…"
              maxLength={40}
            />
            <span className="tot-vs">VS</span>
            <input
              className="tot-input"
              value={optB}
              onChange={e => setOptB(e.target.value)}
              placeholder="Option B…"
              maxLength={40}
            />
          </div>
          <div className="tot-row">
            <button className="tot-random-btn" onClick={useRandomPrompt}>🎲 Random prompt</button>
            <button className="game-btn primary" onClick={sendOptions} disabled={!optA.trim() || !optB.trim()}>
              Send →
            </button>
          </div>
        </div>
      )}
      {phase === 'proposing' && !isProposer && (
        <div className="tot-phase waiting">
          <div className="game-pulse-ring" />
          <p>Stranger is creating options…</p>
        </div>
      )}

      {/* ── Both pick ── */}
      {phase === 'picking' && options && (
        <div className="tot-phase">
          <p className="tot-label">Which do you prefer?</p>
          <div className="tot-pick-row">
            <button
              className={`tot-pick-btn ${myPick === 'a' ? 'picked' : ''}`}
              onClick={() => !myPick && sendPick('a')}
              disabled={!!myPick}
            >
              {myPick === 'a' && <span className="tot-check">✓</span>}
              {options.a}
            </button>
            <span className="tot-vs-badge">OR</span>
            <button
              className={`tot-pick-btn ${myPick === 'b' ? 'picked' : ''}`}
              onClick={() => !myPick && sendPick('b')}
              disabled={!!myPick}
            >
              {myPick === 'b' && <span className="tot-check">✓</span>}
              {options.b}
            </button>
          </div>
          {myPick && !theirPick && (
            <div className="tot-waiting">
              <div className="game-pulse-ring" style={{ width: 30, height: 30 }} />
              <p>Waiting for stranger…</p>
            </div>
          )}
        </div>
      )}

      {/* ── Reveal ── */}
      {phase === 'revealing' && options && myPick && theirPick && (
        <div className="tot-phase">
          <div className="tot-reveal-grid">
            <div className={`tot-reveal-box ${myPick === 'a' ? 'a-picked' : 'b-picked'}`}>
              <span>You</span>
              <strong>{myPick === 'a' ? options.a : options.b}</strong>
            </div>
            <div className={`tot-reveal-box ${theirPick === 'a' ? 'a-picked' : 'b-picked'}`}>
              <span>Stranger</span>
              <strong>{theirPick === 'a' ? options.a : options.b}</strong>
            </div>
          </div>
          {myPick === theirPick ? (
            <p className="tot-match-text">🎉 You both chose the same thing!</p>
          ) : (
            <p className="tot-diff-text">💬 Different choices — interesting!</p>
          )}
          <div className="tot-row">
            <button className="game-btn primary" onClick={nextRound}>Next Round →</button>
            <button className="game-btn danger"  onClick={() => onEnd('Game ended')}>End</button>
          </div>
        </div>
      )}

      <style>{`
        .tot-wrap { padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.875rem; }
        .tot-header { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .tot-title { font-weight: 700; font-size: 0.95rem; }
        .tot-matches { font-size: 0.8rem; color: var(--accent-primary); font-weight: 600; }
        .tot-round { font-size: 0.75rem; color: var(--text-muted); }
        .tot-phase { display: flex; flex-direction: column; align-items: center; gap: 0.85rem; width: 100%; text-align: center; }
        .tot-phase.waiting { opacity: 0.7; }
        .tot-label { color: var(--text-muted); font-size: 0.88rem; margin: 0; }
        .tot-options-input { display: flex; align-items: center; gap: 0.6rem; width: 100%; }
        .tot-input {
          flex: 1; padding: 0.65rem 0.9rem;
          background: rgba(0,0,0,0.25);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
          color: var(--text-main);
          font-family: inherit; font-size: 0.88rem;
          outline: none;
        }
        .tot-input:focus { border-color: var(--accent-primary); }
        .tot-vs { font-weight: 800; font-size: 0.75rem; color: var(--text-muted); flex-shrink: 0; }
        .tot-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
        .tot-random-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 0.5rem 0.9rem;
          border-radius: 10px;
          cursor: pointer;
          font-family: inherit; font-size: 0.82rem;
          transition: 0.2s;
        }
        .tot-random-btn:hover { background: rgba(255,255,255,0.12); color: var(--text-main); }
        .tot-pick-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; width: 100%; }
        .tot-pick-btn {
          flex: 1; min-width: 100px;
          padding: 1rem 0.75rem;
          border-radius: 14px;
          font-weight: 700; font-size: 0.9rem;
          background: rgba(255,255,255,0.05);
          border: 2px solid var(--glass-border);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          position: relative;
        }
        .tot-pick-btn:not(:disabled):hover { background: rgba(139,92,246,0.15); border-color: var(--accent-primary); transform: translateY(-2px); }
        .tot-pick-btn.picked { background: rgba(139,92,246,0.25); border-color: var(--accent-primary); }
        .tot-check { position: absolute; top: 6px; right: 8px; color: var(--accent-primary); font-size: 1rem; }
        .tot-vs-badge { font-size: 0.72rem; font-weight: 800; color: var(--text-muted); flex-shrink: 0; }
        .tot-waiting { display: flex; align-items: center; gap: 0.5rem; }
        .tot-reveal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; }
        .tot-reveal-box {
          border-radius: 14px; padding: 0.85rem 0.75rem;
          display: flex; flex-direction: column; align-items: center;
          gap: 0.3rem; text-align: center;
        }
        .tot-reveal-box span { font-size: 0.72rem; color: var(--text-muted); }
        .tot-reveal-box strong { font-size: 0.95rem; font-weight: 700; }
        .tot-reveal-box.a-picked { background: rgba(129,140,248,0.15); border: 1px solid #818cf8; }
        .tot-reveal-box.b-picked { background: rgba(244,114,182,0.15); border: 1px solid #f472b6; }
        .tot-match-text { font-weight: 700; color: #22c55e; font-size: 0.95rem; margin: 0; }
        .tot-diff-text  { font-weight: 600; color: var(--text-muted); font-size: 0.88rem; margin: 0; }
      `}</style>
    </div>
  );
}
