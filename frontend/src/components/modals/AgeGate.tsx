"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Sparkles, Check, ArrowRight } from "lucide-react";

export default function AgeGate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check if verified already
    const isVerified = localStorage.getItem("anonvibe_age_verified");
    if (isVerified !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleConfirm = () => {
    if (!isChecked) return;
    localStorage.setItem("anonvibe_age_verified", "true");
    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  // Premium style definitions matching the landing page and AuthModal
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 999,
    background: "rgba(3,7,18,0.92)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  };

  const boxStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 440,
    background: "rgba(10,14,28,0.98)",
    border: "1px solid rgba(139,92,246,0.25)",
    borderRadius: 24,
    padding: 36,
    textAlign: "center",
    boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.1)",
    position: "relative",
    boxSizing: "border-box",
  };

  const iconWrapStyle: React.CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: "rgba(168,85,247,0.15)",
    border: "1px solid rgba(168,85,247,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  };

  const checkboxWrapStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    textAlign: "left",
    margin: "24px 0 28px",
    cursor: "pointer",
    userSelect: "none",
  };

  const customCheckboxStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: `1px solid ${isChecked ? "#a855f7" : "rgba(255,255,255,0.15)"}`,
    background: isChecked ? "rgba(168,85,247,0.2)" : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
    transition: "all 0.2s ease",
  };

  const btnConfirmStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    background: isChecked ? "linear-gradient(135deg, #9333ea, #7c3aed)" : "rgba(255,255,255,0.04)",
    color: isChecked ? "white" : "#475569",
    border: "none",
    fontSize: 15,
    fontWeight: 700,
    cursor: isChecked ? "pointer" : "not-allowed",
    boxShadow: isChecked ? "0 4px 20px rgba(147,51,234,0.35)" : "none",
    transition: "all 0.2s ease",
    marginBottom: 12,
  };

  const btnExitStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    background: "transparent",
    color: "#64748b",
    border: "1px solid rgba(255,255,255,0.06)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <AnimatePresence>
      <div style={overlayStyle}>
        <motion.div
          style={boxStyle}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Brand header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 20 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#9333ea,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={11} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#94a3b8" }}>AnonVibe</span>
          </div>

          <div style={iconWrapStyle}>
            <ShieldAlert size={28} color="#a855f7" />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#f8fafc", letterSpacing: "-0.5px" }}>
            Age Verification
          </h2>

          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
            Welcome to AnonVibe. To connect with other users, you must confirm that you are at least 18 years of age.
          </p>

          {/* Policy Checkbox */}
          <div style={checkboxWrapStyle} onClick={() => setIsChecked(!isChecked)}>
            <div style={customCheckboxStyle}>
              {isChecked && <Check size={12} color="#c084fc" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.4 }}>
              I confirm that I am <strong>18 years or older</strong>, and I agree to the <span style={{ color: "#a855f7" }}>Terms of Service</span> & <span style={{ color: "#a855f7" }}>Privacy Policy</span>.
            </span>
          </div>

          {/* Controls */}
          <button
            onClick={handleConfirm}
            disabled={!isChecked}
            style={btnConfirmStyle}
          >
            Enter Platform <ArrowRight size={16} style={{ display: "inline-block", marginLeft: 6, verticalAlign: "middle" }} />
          </button>

          <button
            onClick={handleExit}
            style={btnExitStyle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#64748b"; }}
          >
            I am under 18 (Exit)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
