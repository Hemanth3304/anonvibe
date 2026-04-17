// TruthOrDare.jsx — User-generated Truth or Dare, turn-based
import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

// phase: 'start'|'choose'|'asking'|'responding'|'done'
export default function TruthOrDare({ socket, firstTurn, onEnd }) {
  const [myTurn, setMyTurn] = useState(firstTurn === 'me');
  const [phase, setPhase] = useState('start');
  const [choice, setChoice] = useState(null); // 'truth' | 'dare'
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [receivedQuestion, setReceivedQuestion] = useState(null);
  const [receivedAnswer, setReceivedAnswer] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [rounds, setRounds] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    socket.on('game:message', ({ type, value }) => {
      if (type === 'tod:ask') {
        setPhase('choose');
      }
      else if (type === 'tod:choice') {
        setChoice(value);
        setPhase('asking');
      }
      else if (type === 'tod:question') {
        setReceivedQuestion(value);
        setPhase('responding');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      else if (type === 'tod:answer') {
        setReceivedAnswer(value);
        setPhase('done');
      }
      else if (type === 'tod:next') {
        handleNextRound();
      }
    });
    return () => socket.off('game:message');
  }, [socket]);

  const handleNextRound = () => {
    setMyTurn(prev => !prev);
    setPhase('start');
    setChoice(null);
    setQuestion('');
    setAnswer('');
    setReceivedQuestion(null);
    setReceivedAnswer(null);
    setRounds(r => r + 1);
  };

  const executeAsk = () => {
    socket.emit('game:message', { type: 'tod:ask' });
    setPhase('choose');
  };

  const executeChoice = (c) => {
    setChoice(c);
    socket.emit('game:message', { type: 'tod:choice', value: c });
    setPhase('asking');
  };

  const executeQuestion = () => {
    if (!question.trim()) return;
    const q = question.trim();
    socket.emit('game:message', { type: 'tod:question', value: q });
    setReceivedQuestion(q);
    setPhase('responding');
  };

  const executeAnswer = () => {
    if (!answer.trim()) return;
    const a = answer.trim();
    socket.emit('game:message', { type: 'tod:answer', value: a });
    setReceivedAnswer(a);
    setPhase('done');
  };

  const executeNext = () => {
    socket.emit('game:message', { type: 'tod:next' });
    handleNextRound();
  };

  return (
    <div className="tod-wrap">
      <div className="tod-badge">{choice ? (choice === 'truth' ? '🤍 Truth' : '🔥 Dare') : '🎭 Truth or Dare'}</div>
      <div className="tod-round">Round {rounds + 1}</div>

      {/* ── Phase 1: Start ── */}
      {phase === 'start' && myTurn && (
        <div className="tod-phase">
          <p className="tod-prompt">Your turn! Ask the stranger:</p>
          <button className="tod-choice truth" style={{ borderColor: 'var(--accent-primary)', color: 'var(--text-main)', background: 'var(--glass)'}} onClick={executeAsk}>
            🎭 Truth or Dare?
          </button>
        </div>
      )}
      {phase === 'start' && !myTurn && (
        <div className="tod-phase waiting">
           <div className="game-pulse-ring" />
           <p>Waiting for stranger to ask you Truth or Dare…</p>
        </div>
      )}

      {/* ── Phase 2: Choose ── */}
      {phase === 'choose' && !myTurn && (
        <div className="tod-phase">
          <p className="tod-prompt">Stranger asks: Truth or Dare?</p>
          <div className="tod-choice-row">
            <button className="tod-choice truth" onClick={() => executeChoice('truth')}>🤍 Truth</button>
            <button className="tod-choice dare"  onClick={() => executeChoice('dare')}>🔥 Dare</button>
          </div>
        </div>
      )}
      {phase === 'choose' && myTurn && (
        <div className="tod-phase waiting">
          <div className="game-pulse-ring" />
          <p>Waiting for stranger to choose Truth or Dare…</p>
        </div>
      )}

      {/* ── Phase 3: Asking ── */}
      {phase === 'asking' && myTurn && (
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
          <button className="game-btn primary" onClick={executeQuestion} disabled={!question.trim()}>
            Send Question →
          </button>
        </div>
      )}
      {phase === 'asking' && !myTurn && (
        <div className="tod-phase waiting">
          <div className="game-pulse-ring" />
          <p>Stranger is writing your <strong>{choice}</strong>…</p>
        </div>
      )}

      {/* ── Phase 4: Responding ── */}
      {phase === 'responding' && !myTurn && (
        <div className="tod-phase">
          <div className="tod-question-card">
            <span className="tod-q-label">{choice === 'truth' ? '🤍 Truth' : '🔥 Dare'}</span>
            <p className="tod-question-text">"{receivedQuestion}"</p>
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
          <button className="game-btn success" onClick={executeAnswer} disabled={!answer.trim()}>
            Submit Answer ✓
          </button>
        </div>
      )}
      {phase === 'responding' && myTurn && (
        <div className="tod-phase waiting">
          <div className="tod-question-card">
            <span className="tod-q-label">You Asked:</span>
            <p className="tod-question-text">"{receivedQuestion}"</p>
          </div>
          <div className="game-pulse-ring" />
          <p>Waiting for their answer…</p>
        </div>
      )}

      {/* ── Phase 5: Done ── */}
      {phase === 'done' && (
        <div className="tod-phase">
          <div className="tod-question-card" style={{ opacity: 0.8, marginBottom: '-0.5rem' }}>
            <span className="tod-q-label">{choice}</span>
            <p className="tod-question-text" style={{ fontSize: '0.9rem' }}>"{receivedQuestion}"</p>
          </div>
          <div className="tod-answer-card">
            <span className="tod-q-label">✅ Answer</span>
            <p className="tod-question-text">"{receivedAnswer}"</p>
          </div>
          <div className="tod-choice-row">
            {myTurn && <button className="game-btn primary" onClick={executeNext}>Next Round →</button>}
            {!myTurn && <p className="tod-prompt" style={{width: '100%'}}>Waiting for stranger to start next round...</p>}
          </div>
          <button className="game-btn danger" style={{marginTop: '1rem'}} onClick={() => onEnd('Game ended')}>End Game</button>
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
        @media (max-width: 600px) {
          .tod-wrap { padding: 1rem 0.5rem; }
          .tod-choice { padding: 0.75rem 1rem; font-size: 0.95rem; }
          .tod-phase { gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
