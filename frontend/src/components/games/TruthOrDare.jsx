// TruthOrDare.jsx — User-generated Truth or Dare, turn-based
import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

// phase: 'choose'|'asking'|'responding'|'done'
export default function TruthOrDare({ socket, firstTurn, onEnd }) {
  const iAmFirst = firstTurn === 'me';

  // 'chooser' = person picking T or D, 'asker' = person writing the question
  const [role,       setRole]       = useState(iAmFirst ? 'chooser' : 'asker');
  const [choice,     setChoice]     = useState(null);  // 'truth' | 'dare'
  const [phase,      setPhase]      = useState('choose'); // choose → asking → responding → done
  const [question,   setQuestion]   = useState('');
  const [answer,     setAnswer]     = useState('');
  const [received,   setReceived]   = useState(null);  // what the other side sent
  const [showEmoji,  setShowEmoji]  = useState(false);
  const [rounds,     setRounds]     = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    socket.on('game:message', ({ type, value }) => {
      if (type === 'tod:choice') {
        setChoice(value);
        setPhase('asking');
      }
      if (type === 'tod:question') {
        setReceived(value);
        setPhase('responding');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (type === 'tod:answer') {
        setReceived(value);
        setPhase('done');
      }
    });
    return () => socket.off('game:message');
  }, [socket]);

  const sendChoice = (c) => {
    setChoice(c);
    socket.emit('game:message', { type: 'tod:choice', value: c });
    setPhase('asking');
    // Now it's asker's turn on this side
    setRole('asker');
  };

  const sendQuestion = () => {
    if (!question.trim()) return;
    socket.emit('game:message', { type: 'tod:question', value: question.trim() });
    setReceived(question.trim());
    setQuestion('');
    setPhase('responding');
    setRole('responder');
  };

  const sendAnswer = () => {
    if (!answer.trim()) return;
    socket.emit('game:message', { type: 'tod:answer', value: answer.trim() });
    setAnswer('');
    setPhase('done');
  };

  const nextRound = () => {
    setRounds(r => r + 1);
    setPhase('choose');
    setChoice(null);
    setReceived(null);
    // Swap who chooses
    setRole(prev => prev === 'chooser' ? 'asker' : 'chooser');
    socket.emit('game:message', { type: 'tod:choice', value: '__next_round__' });
  };

  useEffect(() => {
    socket.on('game:message', ({ type }) => {
      if (type === 'tod:choice' && received === '__next_round__') {
        setPhase('choose');
        setChoice(null);
        setReceived(null);
        setRole(r => r === 'chooser' ? 'asker' : 'chooser');
      }
    });
  }, [socket, received]);

  return (
    <div className="tod-wrap">
      <div className="tod-badge">{choice ? (choice === 'truth' ? '🤍 Truth' : '🔥 Dare') : '🎭 Truth or Dare'}</div>
      <div className="tod-round">Round {rounds + 1}</div>

      {/* ── Choose phase: chooser picks ── */}
      {phase === 'choose' && role === 'chooser' && (
        <div className="tod-phase">
          <p className="tod-prompt">Your turn — pick one!</p>
          <div className="tod-choice-row">
            <button className="tod-choice truth" onClick={() => sendChoice('truth')}>🤍 Truth</button>
            <button className="tod-choice dare"  onClick={() => sendChoice('dare')}>🔥 Dare</button>
          </div>
        </div>
      )}
      {phase === 'choose' && role === 'asker' && (
        <div className="tod-phase waiting">
          <div className="game-pulse-ring" />
          <p>Waiting for stranger to choose Truth or Dare…</p>
        </div>
      )}

      {/* ── Asking phase: asker types question ── */}
      {phase === 'asking' && role === 'asker' && (
        <div className="tod-phase">
          <p className="tod-prompt">
            Stranger chose <strong>{choice}</strong> — type your {choice}!
          </p>
          <div className="tod-input-row">
            <textarea
              ref={inputRef}
              className="tod-textarea"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={choice === 'truth' ? 'Ask a truth question…' : 'Give them a dare…'}
              rows={3}
              maxLength={300}
            />
            <div className="tod-input-actions">
              <button className="game-icon-btn" onClick={() => setShowEmoji(!showEmoji)}>😊</button>
            </div>
          </div>
          {showEmoji && (
            <div className="tod-emoji-wrap">
              <EmojiPicker
                onEmojiClick={e => { setQuestion(q => q + e.emoji); setShowEmoji(false); }}
                height={300}
                lazyLoadEmojis
              />
            </div>
          )}
          <button className="game-btn primary" onClick={sendQuestion} disabled={!question.trim()}>
            Send →
          </button>
        </div>
      )}
      {phase === 'asking' && role === 'chooser' && (
        <div className="tod-phase waiting">
          <div className="game-pulse-ring" />
          <p>Stranger is writing your <strong>{choice}</strong>…</p>
        </div>
      )}

      {/* ── Responding phase ── */}
      {phase === 'responding' && role === 'responder' && (
        <div className="tod-phase">
          <div className="tod-question-card">
            <span className="tod-q-label">{choice === 'truth' ? '🤍 Truth' : '🔥 Dare'}</span>
            <p className="tod-question-text">"{received}"</p>
          </div>
          <div className="tod-input-row">
            <textarea
              className="tod-textarea"
              ref={inputRef}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Your response…"
              rows={3}
              maxLength={500}
            />
          </div>
          <button className="game-btn success" onClick={sendAnswer} disabled={!answer.trim()}>
            Submit Answer ✓
          </button>
        </div>
      )}
      {phase === 'responding' && role !== 'responder' && (
        <div className="tod-phase waiting">
          <div className="tod-question-card">
            <span className="tod-q-label">You asked:</span>
            <p className="tod-question-text">"{received}"</p>
          </div>
          <div className="game-pulse-ring" />
          <p>Waiting for answer…</p>
        </div>
      )}

      {/* ── Done phase: show answer ── */}
      {phase === 'done' && (
        <div className="tod-phase">
          <div className="tod-answer-card">
            <span className="tod-q-label">✅ Answer</span>
            <p className="tod-question-text">"{received}"</p>
          </div>
          <div className="tod-choice-row">
            <button className="game-btn primary" onClick={nextRound}>Next Round →</button>
            <button className="game-btn danger"  onClick={() => onEnd('Game ended')}>End Game</button>
          </div>
        </div>
      )}

      <style>{`
        .tod-wrap { padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; min-height: 300px; }
        .tod-badge { font-size: 1rem; font-weight: 700; }
        .tod-round { font-size: 0.75rem; color: var(--text-muted); }
        .tod-phase { display: flex; flex-direction: column; align-items: center; gap: 0.85rem; width: 100%; text-align: center; }
        .tod-phase.waiting { opacity: 0.7; }
        .tod-prompt { color: var(--text-muted); font-size: 0.9rem; }
        .tod-choice-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .tod-choice {
          padding: 0.85rem 2rem;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 700;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .tod-choice.truth { background: rgba(129,140,248,0.15); border-color: #818cf8; color: #818cf8; }
        .tod-choice.truth:hover { background: rgba(129,140,248,0.3); }
        .tod-choice.dare  { background: rgba(239,68,68,0.15);  border-color: #ef4444; color: #ef4444; }
        .tod-choice.dare:hover  { background: rgba(239,68,68,0.3); }
        .tod-input-row { width: 100%; }
        .tod-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(0,0,0,0.25);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          font-family: inherit;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
          resize: vertical;
          outline: none;
        }
        .tod-textarea:focus { border-color: var(--accent-primary); }
        .tod-input-actions { display: flex; justify-content: flex-end; gap: 0.4rem; margin-top: 0.3rem; }
        .tod-emoji-wrap { width: 100%; overflow: hidden; }
        .tod-question-card {
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          width: 100%; box-sizing: border-box;
          text-align: left;
        }
        .tod-q-label { font-size: 0.75rem; color: var(--accent-primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .tod-question-text { margin: 0.4rem 0 0; font-size: 1rem; line-height: 1.5; }
        .tod-answer-card {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          width: 100%; box-sizing: border-box;
          text-align: left;
        }
        .game-btn.success { background: #22c55e; color: #fff; }
      `}</style>
    </div>
  );
}
