import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Video, Sparkles, Globe2, Tag, Shield, Users, Zap } from 'lucide-react';

function Entrance({ onRegister, onlineCount = 0 }) {
  const [gender, setGender] = useState('unknown');
  const [preference, setPreference] = useState('');
  const [mode, setMode] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ gender, preference: preference.trim().toLowerCase(), mode });
  };

  return (
    <motion.div
      className="entrance-container glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Globe2 size={54} className="globe-icon pulse-animation" />
      </motion.div>

      <div className="community-badge animate-fade-in">
        <Users size={14} />
        <span>Join {onlineCount > 0 ? (onlineCount + 42) : 'Thousands'} Vibes Live</span>
      </div>

      <h1>Connect with the World</h1>
      <p className="subtitle">Instant, anonymous, and free stranger chat with games.</p>

      <form onSubmit={handleSubmit}>

        {/* Gender */}
        <div className="form-group">
          <label>I am a</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="unknown">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="trans">Trans / NB</option>
          </select>
        </div>

        {/* Preference (replaces language) */}
        <div className="form-group">
          <label>
            <Tag size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
            Chat Preference
          </label>
          <div className="pref-wrap">
            <input
              type="text"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="e.g. gaming, music, coding… (leave blank for anyone)"
              maxLength={40}
            />
            {preference && (
              <span className="pref-tag">{preference.trim().toLowerCase()}</span>
            )}
          </div>
          <p className="pref-hint">
            Only strangers with the same preference will be matched. Leave blank to connect with anyone.
          </p>
        </div>

        {/* Mode */}
        <div className="form-group">
          <label>Preferred Mode</label>
          <div className="mode-selector">
            <button
              type="button"
              className={mode === 'text' ? 'active' : ''}
              onClick={() => setMode('text')}
            >
              <MessageSquareText size={20} />
              Text
            </button>
            <button
              type="button"
              className={mode === 'video' ? 'active' : ''}
              onClick={() => setMode('video')}
            >
              <Video size={20} />
              Video
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          className="glass-button start-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles size={20} />
          Start Chatting
        </motion.button>
      </form>

      <div className="features-grid">
        <div className="feature-item">
          <Shield size={20} />
          <h4>Safe & Private</h4>
          <p>No account required. Your data, your rules.</p>
        </div>
        <div className="feature-item">
          <Zap size={20} />
          <h4>Instant Play</h4>
          <p>Truth or Dare, Never Have I Ever inside chat.</p>
        </div>
      </div>

      <style>{`
        /* ── Container ── */
        .entrance-container {
          padding: 2.5rem;
          max-width: 480px;
          width: 100%;
          margin: 2rem auto;
          text-align: center;
          position: relative;
          box-sizing: border-box;
        }
        .entrance-container::before {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: radial-gradient(circle at center, rgba(139,92,246,0.1) 0%, transparent 50%);
          z-index: -1;
          pointer-events: none;
        }

        /* ── Icon ── */
        .globe-icon {
          color: var(--accent-primary);
          margin-bottom: 0.75rem;
          filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
        }
        .pulse-animation {
          animation: pulse 3s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.8)); }
        }


        /* ── Headings ── */
        .entrance-container h1 {
          font-size: clamp(1.6rem, 5vw, 2.4rem);
          margin-bottom: 0.4rem;
          letter-spacing: -0.5px;
        }
        .subtitle {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          font-size: clamp(0.9rem, 2.5vw, 1.05rem);
        }

        .community-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(139, 92, 246, 0.1);
          color: var(--accent-primary);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border: 1px solid rgba(139, 92, 246, 0.2);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }


        /* ── Form groups ── */
        .form-group {
          text-align: left;
          margin-bottom: 1.25rem;
        }
        .entrance-container label {
          display: block;
          margin-bottom: 0.45rem;
          font-weight: 600;
          font-size: 0.82rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── Preference input ── */
        .pref-wrap {
          position: relative;
        }
        .pref-wrap input {
          padding-right: 1rem;
        }
        .pref-tag {
          display: inline-block;
          margin-top: 0.5rem;
          background: var(--accent-primary);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          letter-spacing: 0.3px;
        }
        .pref-hint {
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* ── Mode selector ── */
        .mode-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .mode-selector button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.95rem;
          font-family: inherit;
        }
        .mode-selector button:hover {
          background: rgba(255,255,255,0.08);
          color: var(--text-main);
        }
        .mode-selector button.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: #fff;
          box-shadow: var(--neon-glow);
        }

        /* ── Start button ── */
        .start-btn {
          width: 100%;
          margin-top: 1.25rem;
          padding: 1rem;
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        }

        /* ── Tablet ── */
        @media (max-width: 900px) {
          .entrance-container { padding: 2rem 1.75rem; margin: 1.5rem auto; }
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .entrance-container {
            padding: 1.5rem 1.1rem;
            margin: 0.5rem auto;
            border-radius: 16px;
          }
          .subtitle { margin-bottom: 1.25rem; }
          .form-group { margin-bottom: 1rem; }
          .mode-selector button { padding: 0.65rem; font-size: 0.88rem; }
          .start-btn { padding: 0.85rem; margin-top: 0.75rem; }
          .features-grid { margin-top: 1.5rem; }
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--glass-border);
        }
        .feature-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .feature-item h4 {
          font-size: 0.82rem;
          color: var(--text-main);
          font-weight: 700;
          margin: 0;
        }
        .feature-item p {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
          margin: 0;
        }
        .feature-item svg {
          color: var(--accent-secondary);
        }


        /* ── Very small screens (<380px) ── */
        @media (max-width: 380px) {
          .entrance-container { padding: 1.25rem 0.9rem; }
          .entrance-container h1 { font-size: 1.4rem; }
          .globe-icon { width: 36px; height: 36px; }
        }
      `}</style>
    </motion.div>
  );
}

export default Entrance;
