import React, { useState } from 'react';
import { MessageSquareText, Video, Sparkles, Globe2, Tag, Shield, Users, Zap, Sliders, Gamepad2, Lock, ArrowRight, X } from 'lucide-react';

function Entrance({ onRegister, onlineCount = 0, inviteRoomId, onJoinPrivate }) {
  const [gender, setGender] = useState('unknown');
  const [preference, setPreference] = useState('');
  const [mode, setMode] = useState('text');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('safety'); // 'safety' | 'privacy' | 'rules'

  // Age Gate State
  const [hasAcceptedAgeGate, setHasAcceptedAgeGate] = useState(
    localStorage.getItem('age_gate_accepted') === 'true'
  );
  const [ageChecked, setAgeChecked] = useState(false);
  const [conductChecked, setConductChecked] = useState(false);
  const [rulesChecked, setRulesChecked] = useState(false);

  const handleAgeGateSubmit = (e) => {
    e.preventDefault();
    if (ageChecked && conductChecked && rulesChecked) {
      localStorage.setItem('age_gate_accepted', 'true');
      setHasAcceptedAgeGate(true);
    }
  };

  const openModal = (tab) => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ gender, preference: preference.trim().toLowerCase(), mode });
  };

  const [copied, setCopied] = useState(false);

  const handleInvite = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    const inviteLink = `${window.location.origin}?invite=${randomId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join me on AnonVibe!',
        text: 'Let\'s chat and play games anonymously!',
        url: inviteLink
      }).then(() => onJoinPrivate(randomId));
    } else {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      onJoinPrivate(randomId);
    }
  };

  return (
    <>
      {!hasAcceptedAgeGate && (
        <div className="age-gate-backdrop animate-fade-in">
          <div className="age-gate-modal glass-panel">
            <div className="age-gate-header">
              <div className="age-badge">18+</div>
              <h2>Age Verification Required</h2>
              <p>AnonVibe matches you with random people. You must confirm your age and agree to our standards to join the vibe.</p>
            </div>

            <form onSubmit={handleAgeGateSubmit} className="age-gate-form">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={ageChecked} 
                  onChange={(e) => setAgeChecked(e.target.checked)} 
                />
                <span className="checkbox-text">I am 18 years of age or older (required).</span>
              </label>

              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={conductChecked} 
                  onChange={(e) => setConductChecked(e.target.checked)} 
                />
                <span className="checkbox-text">I agree to be respectful. I will not engage in harassment, creepy behavior, or share explicit content.</span>
              </label>

              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rulesChecked} 
                  onChange={(e) => setRulesChecked(e.target.checked)} 
                />
                <span className="checkbox-text">I agree to the <button type="button" onClick={() => openModal('rules')} className="inline-link">Community Rules</button> and <button type="button" onClick={() => openModal('privacy')} className="inline-link">Privacy Policy</button>.</span>
              </label>

              <button 
                type="submit" 
                className="glass-button start-btn age-gate-submit-btn" 
                disabled={!(ageChecked && conductChecked && rulesChecked)}
              >
                Confirm & Enter Vibe
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="entrance-container glass-panel entrance-anim-in">
        <div className="globe-wrap">
          <Globe2 size={54} className="globe-icon pulse-animation" />
        </div>

        <div className="community-badge animate-fade-in">
          <Users size={14} />
          <span>Join {onlineCount > 0 ? (onlineCount + 42) + ' Vibes Live' : 'Thousands Live Now'}</span>
        </div>

        <h1>Break the Ice Instantly</h1>
        <p className="subtitle">Meet new people without awkward intros — chat, play, and connect anonymously with built-in games.</p>

        {/* ── 3-Step Connection Strip ── */}
        <div className="step-strip animate-fade-in">
          <div className="step-item">
            <div className="step-icon-wrap"><Sliders size={14} /></div>
            <span>1. Choose Mode</span>
          </div>
          <div className="step-arrow"><ArrowRight size={12} /></div>
          <div className="step-item">
            <div className="step-icon-wrap"><Zap size={14} /></div>
            <span>2. Match Instantly</span>
          </div>
          <div className="step-arrow"><ArrowRight size={12} /></div>
          <div className="step-item">
            <div className="step-icon-wrap"><Gamepad2 size={14} /></div>
            <span>3. Play & Chat</span>
          </div>
        </div>

        {inviteRoomId && (
          <div className="invite-alert animate-fade-in">
            <Sparkles size={16} />
            <span>You've been invited to a private chat!</span>
          </div>
        )}

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

          {/* Preference */}
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

          <button
            type="submit"
            className="glass-button start-btn"
          >
            <Sparkles size={20} />
            {inviteRoomId ? 'Accept Invite' : 'Start Chatting'}
          </button>

          {/* ── Trust Band ── */}
          <div className="trust-band">
            <span className="trust-item"><Shield size={12} /> Moderated Chat</span>
            <span className="trust-dot">•</span>
            <span className="trust-item"><Zap size={12} /> Block / Skip Instantly</span>
            <span className="trust-dot">•</span>
            <span className="trust-item"><MessageSquareText size={12} /> Text-First Safer Mode</span>
            <span className="trust-dot">•</span>
            <span className="trust-item"><Lock size={12} /> No Signup Required</span>
          </div>

          {!inviteRoomId && (
            <button
              type="button"
              className="invite-friend-btn"
              onClick={handleInvite}
            >
              {copied ? 'Link Copied! Send it to a friend' : 'Play with a Friend ➔'}
            </button>
          )}
        </form>

        {/* ── Proof / Features Grid ── */}
        <div className="features-grid">
          <div className="feature-item">
            <Gamepad2 size={18} />
            <h4>Built-in Icebreakers</h4>
            <p>Play Truth or Dare, TicTacToe, and Never Have I Ever directly in chat.</p>
          </div>
          <div className="feature-item">
            <Lock size={18} />
            <h4>Zero-Logs Privacy</h4>
            <p>No registration. Your chats are completely ephemeral and deleted instantly.</p>
          </div>
          <div className="feature-item">
            <Shield size={18} />
            <h4>Safer Moderation</h4>
            <p>Text-first matching with quick skip and automated reporting filters.</p>
          </div>
          <div className="feature-item">
            <Users size={18} />
            <h4>Private Rooms</h4>
            <p>Challenge your friends directly. Generate a private link to play games.</p>
          </div>
        </div>

        {/* ── Footer Policy Links ── */}
        <div className="entrance-footer">
          <button type="button" onClick={() => openModal('safety')} className="footer-link">Safety Center</button>
          <span className="footer-separator">•</span>
          <button type="button" onClick={() => openModal('privacy')} className="footer-link">Privacy Policy</button>
          <span className="footer-separator">•</span>
          <button type="button" onClick={() => openModal('rules')} className="footer-link">Community Rules</button>
        </div>
      </div>

      {/* ── Safety & Guidelines Modal ── */}
      {isModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={closeModal}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} title="Close">
              <X size={20} />
            </button>
            <div className="modal-tabs">
              <button 
                className={`modal-tab ${modalTab === 'safety' ? 'active' : ''}`}
                onClick={() => setModalTab('safety')}
              >
                <Shield size={16} /> Safety Center
              </button>
              <button 
                className={`modal-tab ${modalTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setModalTab('privacy')}
              >
                <Lock size={16} /> Privacy Policy
              </button>
              <button 
                className={`modal-tab ${modalTab === 'rules' ? 'active' : ''}`}
                onClick={() => setModalTab('rules')}
              >
                <Users size={16} /> Community Rules
              </button>
            </div>
            <div className="modal-body-content">
              {modalTab === 'safety' && (
                <div className="modal-tab-panel">
                  <h3>Our Commitment to Safety</h3>
                  <p>At AnonVibe, we believe anonymous chat should be fun, spontaneous, and above all, <strong>safe</strong>. We take strict measures to prevent abuse and harassment:</p>
                  <ul>
                    <li><strong>Instant Skip & Block:</strong> You are always in control. If a stranger makes you uncomfortable, click "Next" or the report flag to disconnect and block them immediately.</li>
                    <li><strong>Text-First Safer Mode:</strong> By starting in text mode, you have the chance to chat and play games before choosing if or when to engage in video chat.</li>
                    <li><strong>Active Reporting & Banning:</strong> Reports are handled by automated rules that track repeat offenders by their device connection signature, issuing swift IP-based bans to spammers and bots.</li>
                    <li><strong>Video Stream Guidelines:</strong> Sharing inappropriate video content will result in permanent hardware bans. Please report any violations instantly.</li>
                  </ul>
                </div>
              )}
              {modalTab === 'privacy' && (
                <div className="modal-tab-panel">
                  <h3>Zero-Logs Privacy Policy</h3>
                  <p>Your privacy is absolute. AnonVibe requires no email, phone number, or account creation, which reduces tracking vectors to zero:</p>
                  <ul>
                    <li><strong>Zero Chats Stored:</strong> We do not log, record, or store any text chat history or video streams on our servers. All communications are sent directly between you and the match.</li>
                    <li><strong>Wiped on Disconnect:</strong> As soon as you or the stranger clicks "Next" or closes the window, the temporary room state is permanently deleted.</li>
                    <li><strong>Minimal Cookies:</strong> We only store a tiny preference key in your browser local storage to save your preferred theme and options.</li>
                    <li><strong>Safe Third-Party Integrations:</strong> Giphy API requests for sharing GIFs are randomized and do not contain personal identifiers.</li>
                  </ul>
                </div>
              )}
              {modalTab === 'rules' && (
                <div className="modal-tab-panel">
                  <h3>Community Guidelines</h3>
                  <p>To keep the vibes clean and fun for everyone, all users must respect our community code of conduct:</p>
                  <ul>
                    <li><strong>Must be 18 or older:</strong> You must be at least 18 years of age (or the age of majority in your country) to access AnonVibe.</li>
                    <li><strong>No creepiness or harassment:</strong> Treat others with respect. Do not send unsolicited explicit materials, spam, ads, or repeat messaging.</li>
                    <li><strong>No nudity or commercial video:</strong> Video streaming of commercial streams, ads, blank screens, or adult content is strictly banned.</li>
                    <li><strong>Zero Tolerance:</strong> Violating rules will lead to immediate connection termination and permanent blacklisting from our matching server.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
        /* ── Entrance animation ── */
        @keyframes entranceIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .entrance-anim-in {
          animation: entranceIn 0.6s ease-out both;
          will-change: transform, opacity;
        }
        .globe-wrap {
          animation: globeIn 0.5s ease-out 0.2s both;
        }
        @keyframes globeIn {
          from { transform: scale(0.9); }
          to   { transform: scale(1); }
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
          background: linear-gradient(135deg, var(--text-main) 30%, var(--accent-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          font-size: clamp(0.9rem, 2.5vw, 1.05rem);
          line-height: 1.45;
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

        /* ── Step Strip ── */
        .step-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0rem auto 1.5rem auto;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 0.6rem 0.8rem;
          max-width: 100%;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
        }
        .step-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-primary);
        }
        .step-arrow {
          color: var(--text-muted);
          display: flex;
          align-items: center;
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

        /* ── Trust Band ── */
        .trust-band {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          column-gap: 0.5rem;
          row-gap: 0.3rem;
          margin-top: 1rem;
          padding: 0.6rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .trust-item svg {
          color: var(--accent-primary);
        }
        .trust-dot {
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.7rem;
        }

        .invite-friend-btn {
          width: 100%;
          margin-top: 0.75rem;
          background: transparent;
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: var(--accent-primary);
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }
        .invite-friend-btn:hover {
          background: rgba(139, 92, 246, 0.05);
          border-color: var(--accent-primary);
        }
        .invite-alert {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          padding: 10px;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        /* ── Features Proof Grid ── */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-top: 1.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }
        .feature-item {
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }
        .feature-item h4 {
          font-size: 0.85rem;
          color: var(--text-main);
          font-weight: 700;
          margin: 0;
        }
        .feature-item p {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.35;
          margin: 0;
        }
        .feature-item svg {
          color: var(--accent-primary);
          margin-bottom: 2px;
        }

        /* ── Entrance Footer ── */
        .entrance-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-link {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.78rem;
          cursor: pointer;
          transition: color 0.2s ease;
          font-family: inherit;
          padding: 2px 4px;
        }
        .footer-link:hover {
          color: var(--accent-primary);
          text-decoration: underline;
        }
        .footer-separator {
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
        }

        /* ── Modal Styles ── */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-content {
          max-width: 520px;
          width: 100%;
          background: rgba(15, 15, 20, 0.95);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
          position: relative;
          padding: 2.5rem 2rem 2rem 2rem;
          animation: modalScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          text-align: left;
          display: flex;
          flex-direction: column;
          max-height: 80vh;
        }
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: var(--text-muted);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .modal-tabs {
          display: flex;
          border-bottom: 1px solid var(--glass-border);
          gap: 0.25rem;
          margin-bottom: 1.25rem;
          flex-shrink: 0;
        }
        .modal-tab {
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: var(--text-muted);
          padding: 0.6rem 0.8rem;
          cursor: pointer;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .modal-tab:hover {
          color: var(--text-main);
        }
        .modal-tab.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }
        .modal-body-content {
          overflow-y: auto;
          flex: 1;
          padding-right: 0.5rem;
        }
        .modal-tab-panel h3 {
          font-size: 1.2rem;
          color: var(--text-main);
          margin-bottom: 0.75rem;
          font-weight: 700;
        }
        .modal-tab-panel p {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .modal-tab-panel ul {
          padding-left: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .modal-tab-panel li {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.45;
        }
        .modal-tab-panel li strong {
          color: var(--text-main);
        }

        /* Adjustments for light mode */
        body.light .modal-content {
          background: rgba(255, 255, 255, 0.98);
          color: #0f172a;
        }
        body.light .modal-tab-panel h3 {
          color: #0f172a;
        }
        body.light .modal-tab-panel li strong {
          color: #0f172a;
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
          .subtitle { margin-bottom: 1.1rem; }
          .step-strip {
            gap: 0.25rem;
            padding: 0.5rem;
            margin-bottom: 1.25rem;
          }
          .step-item {
            font-size: 0.7rem;
            gap: 0.2rem;
          }
          .step-icon-wrap {
            width: 20px;
            height: 20px;
          }
          .step-icon-wrap svg {
            width: 11px;
            height: 11px;
          }
          .form-group { margin-bottom: 1rem; }
          .mode-selector button { padding: 0.65rem; font-size: 0.88rem; }
          .start-btn { padding: 0.85rem; margin-top: 0.75rem; }
          .trust-band {
            padding: 0.5rem;
            gap: 0.25rem;
          }
          .trust-item {
            font-size: 0.68rem;
          }
          .features-grid { margin-top: 1.5rem; gap: 1rem; }
          .feature-item {
            align-items: center;
            text-align: center;
          }
          .feature-item h4 { font-size: 0.8rem; }
          .feature-item p { font-size: 0.7rem; }
        }

        /* ── Very small screens (<380px) ── */
        @media (max-width: 380px) {
          .entrance-container { padding: 1.25rem 0.9rem; }
          .entrance-container h1 { font-size: 1.4rem; }
          .globe-icon { width: 36px; height: 36px; }
          .step-strip { display: none; } /* Hide step strip on tiny screens */
          .trust-band { flex-direction: column; gap: 0.2rem; }
          .trust-dot { display: none; }
        }

        /* ── Age Gate Overlay ── */
        .age-gate-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 10, 12, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .age-gate-modal {
          max-width: 460px;
          width: 100%;
          background: rgba(20, 20, 25, 0.7);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: modalScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          text-align: center;
        }
        .age-gate-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text-main) 30%, var(--accent-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .age-gate-header p {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.45;
          margin-bottom: 2rem;
        }
        .age-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #ef4444;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-size: 1.25rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem auto;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
        }
        .age-gate-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
        }
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
        }
        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          flex-shrink: 0;
          cursor: pointer;
          accent-color: var(--accent-primary);
        }
        .checkbox-text {
          font-size: 0.84rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
        .inline-link {
          background: none;
          border: none;
          color: var(--accent-primary);
          text-decoration: underline;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          font-size: inherit;
          font-weight: 600;
        }
        .inline-link:hover {
          filter: brightness(1.1);
        }
        .age-gate-submit-btn {
          width: 100%;
          padding: 0.9rem;
          font-size: 1rem;
          margin-top: 0.75rem;
        }
        
        /* Light mode adjustments for Age Gate */
        body.light .age-gate-backdrop {
          background: rgba(248, 250, 252, 0.96);
        }
        body.light .age-gate-modal {
          background: rgba(255, 255, 255, 0.8);
        }
        body.light .checkbox-text {
          color: #475569;
        }
      `}</style>
    </>
  );
}

export default Entrance;
