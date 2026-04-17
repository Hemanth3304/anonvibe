// NeverHaveIEver.jsx — Player writes statement, both respond, simultaneous reveal
import React, { useState, useEffect } from 'react';

export default function NeverHaveIEver({ socket, firstTurn, onEnd }) {
  const iAmFirst = firstTurn === 'me';

  const [phase,       setPhase]       = useState('writing');   // writing | responding | done
  const [myTurn,      setMyTurn]      = useState(iAmFirst);    // whose turn it is to write the prompt
  const [statement,   setStatement]   = useState('');
  const [givenAnswer, setGivenAnswer] = useState(null);        // 'yes' | 'no'
  const [currentStmt, setCurrentStmt] = useState('');
  const [rounds,      setRounds]      = useState(0);

  useEffect(() => {
    socket.on('game:message', ({ type, value }) => {
      if (type === 'nhie:statement') {
        setCurrentStmt(value);
        setPhase('responding');
        setGivenAnswer(null);
      }
      else if (type === 'nhie:response') {
        setGivenAnswer(value);
        setPhase('done');
      }
      else if (type === 'nhie:next') {
        handleNextRound();
      }
    });
    return () => socket.off('game:message');
  }, [socket]);

  const handleNextRound = () => {
    setRounds(r => r + 1);
    setPhase('writing');
    setMyTurn(w => !w);
    setStatement('');
    setGivenAnswer(null);
    setCurrentStmt('');
  };

  const sendStatement = () => {
    if (!statement.trim()) return;
    const s = statement.trim();
    setCurrentStmt(s);
    socket.emit('game:message', { type: 'nhie:statement', value: s });
    setPhase('responding');
  };

  const sendResponse = (val) => {
    setGivenAnswer(val);
    socket.emit('game:message', { type: 'nhie:response', value: val });
    setPhase('done');
  };

  const executeNext = () => {
    socket.emit('game:message', { type: 'nhie:next' });
    handleNextRound();
  };

  return (
    <div className="nhie-wrap">
      <div className="nhie-header">
        <span className="nhie-title">🍻 Never Have I Ever</span>
        <span className="nhie-round">Round {rounds + 1}</span>
      </div>

      {/* No scores shown now since it's just volley */}

      {/* Writing phase */}
      {phase === 'writing' && myTurn && (
        <div className="nhie-phase">
          <p className="nhie-label">Your turn — complete the sentence:</p>
          <div className="nhie-stmt-prefix">Never have I ever…</div>
          <textarea
            className="nhie-textarea"
            value={statement}
            onChange={e => setStatement(e.target.value)}
            placeholder="…been skydiving / …lied to a best friend"
            rows={2}
            maxLength={200}
            autoFocus
          />
          <button className="game-btn primary" onClick={sendStatement} disabled={!statement.trim()}>
            Send Question →
          </button>
        </div>
      )}
      {phase === 'writing' && !myTurn && (
        <div className="nhie-phase waiting">
          <div className="game-pulse-ring" />
          <p>Stranger is writing a statement…</p>
        </div>
      )}

      {/* Responding phase */}
      {phase === 'responding' && !myTurn && (
        <div className="nhie-phase">
          <div className="nhie-card">
            <span className="nhie-card-prefix">Never have I ever…</span>
            <p className="nhie-card-stmt">{currentStmt}</p>
          </div>
          <p className="nhie-label">Have you?</p>
          <div className="nhie-response-row">
            <button className="nhie-resp-btn yes" onClick={() => sendResponse('yes')}>
              🙋 YES — I have
            </button>
            <button className="nhie-resp-btn no" onClick={() => sendResponse('no')}>
              🙅 NO — I haven't
            </button>
          </div>
        </div>
      )}
      {phase === 'responding' && myTurn && (
        <div className="nhie-phase waiting">
          <div className="nhie-card">
            <span className="nhie-card-prefix">You Asked: Never have I ever…</span>
            <p className="nhie-card-stmt">{currentStmt}</p>
          </div>
          <div className="game-pulse-ring" />
          <p>Waiting for stranger's response…</p>
        </div>
      )}

      {/* Reveal */}
      {phase === 'done' && (
        <div className="nhie-phase">
          <div className="nhie-card">
            <span className="nhie-card-prefix">Never have I ever…</span>
            <p className="nhie-card-stmt">{currentStmt}</p>
          </div>
          <div className="nhie-reveal-row">
            <div className={`nhie-reveal-box ${givenAnswer === 'yes' ? 'yes' : 'no'}`}>
              <span>{myTurn ? 'Stranger has' : 'You have'}</span>
              <strong>{givenAnswer === 'yes' ? '🙋 DONE IT' : '🙅 NOT DONE IT'}</strong>
            </div>
          </div>
          <div className="nhie-actions">
            {myTurn && <button className="game-btn primary" onClick={executeNext}>Next Round →</button>}
            {!myTurn && <p className="nhie-label" style={{width: '100%', marginTop: '0.5rem'}}>Waiting for next round...</p>}
          </div>
          <button className="game-btn danger" style={{marginTop: '0.5rem'}} onClick={() => onEnd('Game ended')}>End</button>
        </div>
      )}

      <style>{`
        .nhie-wrap { padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.875rem; }
        .nhie-header { display: flex; align-items: center; justify-content: space-between; width: 100%; }
        .nhie-title { font-weight: 700; font-size: 0.95rem; }
        .nhie-round { font-size: 0.75rem; color: var(--text-muted); }
        .nhie-scores { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
        .nhie-score-chip {
          font-size: 0.78rem; font-weight: 600;
          padding: 4px 10px; border-radius: 99px;
        }
        .nhie-score-chip.me   { background: rgba(129,140,248,0.15); color: #818cf8; }
        .nhie-score-chip.them { background: rgba(244,114,182,0.15); color: #f472b6; }
        .nhie-phase { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; text-align: center; }
        .nhie-phase.waiting { opacity: 0.7; }
        .nhie-label { font-size: 0.88rem; color: var(--text-muted); margin: 0; }
        .nhie-stmt-prefix {
          font-size: 0.82rem; font-weight: 700;
          color: var(--accent-primary);
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .nhie-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(0,0,0,0.25);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          font-family: inherit; font-size: 0.9rem;
          padding: 0.75rem 1rem;
          resize: vertical; outline: none;
        }
        .nhie-textarea:focus { border-color: var(--accent-primary); }
        .nhie-card {
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          width: 100%; box-sizing: border-box; text-align: left;
        }
        .nhie-card-prefix { font-size: 0.72rem; color: var(--accent-primary); font-weight: 700; text-transform: uppercase; }
        .nhie-card-stmt { margin: 0.4rem 0 0; font-size: 1rem; line-height: 1.5; }
        .nhie-response-row { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
        .nhie-resp-btn {
          padding: 0.75rem 1.25rem; border-radius: 14px;
          font-weight: 700; font-size: 0.92rem;
          border: 2px solid transparent; cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .nhie-resp-btn.yes { background: rgba(34,197,94,0.15); border-color: #22c55e; color: #22c55e; }
        .nhie-resp-btn.yes:hover { background: rgba(34,197,94,0.3); }
        .nhie-resp-btn.no  { background: rgba(239,68,68,0.15);  border-color: #ef4444; color: #ef4444; }
        .nhie-resp-btn.no:hover  { background: rgba(239,68,68,0.3); }
        .nhie-waiting-them { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .nhie-reveal-row { display: grid; gap: 0.75rem; width: 100%; }
        .nhie-reveal-box {
          border-radius: 14px; padding: 0.75rem;
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
          text-align: center;
        }
        .nhie-reveal-box span { font-size: 0.72rem; color: var(--text-muted); }
        .nhie-reveal-box strong { font-size: 1rem; }
        .nhie-reveal-box.yes { background: rgba(34,197,94,0.15); border: 1px solid #22c55e; }
        .nhie-reveal-box.no  { background: rgba(239,68,68,0.1);  border: 1px solid #ef4444; }
        .nhie-match { font-size: 0.95rem; font-weight: 700; color: var(--accent-primary); }
        .nhie-actions { display: flex; gap: 0.75rem; }
      `}</style>
    </div>
  );
}
