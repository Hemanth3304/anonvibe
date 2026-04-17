import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareText, Video, Sparkles, Globe2 } from 'lucide-react';

function Entrance({ onRegister }) {
  const [gender, setGender] = useState('unknown');
  const [language, setLanguage] = useState('english');
  const [mode, setMode] = useState('text');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ gender, language, mode });
  };

  return (
    <motion.div 
      className="entrance-container glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Globe2 size={48} className="globe-icon" />
      </motion.div>
      <h1>Connect with the World</h1>
      <p className="subtitle">Instant, anonymous, and free stranger chat platform.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>I am a</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="unknown">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="trans">Trans / NB</option>
          </select>
        </div>

        <div className="form-group">
          <label>I speak</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="auto">Any Language</option>
          </select>
        </div>

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

      <style>{`
        .entrance-container {
          padding: 3rem;
          max-width: 500px;
          margin: 4rem auto;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .entrance-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          z-index: -1;
          pointer-events: none;
        }
        .globe-icon {
          color: var(--accent-primary);
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
        }
        h1 { font-size: 2.5rem; margin-bottom: 0.5rem; letter-spacing: -0.5px; }
        .subtitle { color: var(--text-muted); margin-bottom: 2.5rem; font-size: 1.1rem; }
        .form-group { text-align: left; margin-bottom: 1.5rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .mode-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .mode-selector button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 0.8rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .mode-selector button:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }
        .mode-selector button.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
          box-shadow: var(--neon-glow);
        }
        .start-btn { 
          width: 100%; 
          margin-top: 1.5rem; 
          padding: 1.2rem; 
          font-size: 1.2rem; 
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        }
        @media (max-width: 900px) {
          .entrance-container { padding: 2.5rem; margin: 2rem auto; }
          h1 { font-size: 2rem; }
        }
        @media (max-width: 600px) {
          .entrance-container { padding: 1.75rem 1.25rem; margin: 1rem auto; border-radius: 16px; }
          h1 { font-size: 1.6rem; }
          .subtitle { font-size: 0.95rem; margin-bottom: 1.5rem; }
          .form-group { margin-bottom: 1.25rem; }
          .start-btn { font-size: 1rem; padding: 1rem; }
        }
      `}</style>
    </motion.div>
  );
}

export default Entrance;
