"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string) => void;
  defaultTab?: "signin" | "signup";
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export default function AuthModal({ isOpen, onClose, onSuccess, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ email: "", username: "", password: "" });

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      onSuccess(data.userId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "error";
      // If backend is unavailable, run in demo mode
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        onSuccess("demo-" + Date.now());
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onSuccess("demo-user-id");
  }

  if (!isOpen) return null;

  const inputWrap: React.CSSProperties = {
    position: "relative",
    width: "100%",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px 13px 44px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#f8fafc",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#475569",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  };

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          style={{
            width: "100%", maxWidth: 420,
            background: "rgba(10,14,28,0.97)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 20, padding: 32,
            position: "relative",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#9333ea,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 17 }}>AnonVibe</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 12, background: "rgba(255,255,255,0.04)", marginBottom: 24 }}>
            {(["signin", "signup"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                style={tab === t
                  ? { flex: 1, padding: "10px 0", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", border: "1px solid rgba(147,51,234,0.4)", background: "rgba(147,51,234,0.22)", color: "#c084fc" }
                  : { flex: 1, padding: "10px 0", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", border: "none", background: "transparent", color: "#64748b" }
                }>
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Sign In */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={inputWrap}>
                <span style={iconStyle}><Mail size={15} /></span>
                <input style={inputStyle} type="email" placeholder="Email address" value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.background = "rgba(139,92,246,0.05)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  required />
              </div>
              <div style={inputWrap}>
                <span style={iconStyle}><Lock size={15} /></span>
                <input style={{ ...inputStyle, paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="Password"
                  value={signInForm.password} onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.background = "rgba(139,92,246,0.05)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 11, background: "linear-gradient(135deg,#9333ea,#7c3aed)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(147,51,234,0.35)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              <p style={{ textAlign: "center", fontSize: 13, color: "#475569", margin: 0 }}>
                No account?{" "}
                <button type="button" onClick={() => setTab("signup")} style={{ background: "none", border: "none", color: "#a855f7", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Create one free
                </button>
              </p>
            </form>
          )}

          {/* Sign Up */}
          {tab === "signup" && (
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={inputWrap}>
                <span style={iconStyle}><Mail size={15} /></span>
                <input style={inputStyle} type="email" placeholder="Email address" value={signUpForm.email}
                  onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.background = "rgba(139,92,246,0.05)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  required />
              </div>
              <div style={inputWrap}>
                <span style={iconStyle}><User size={15} /></span>
                <input style={inputStyle} type="text" placeholder="Username" value={signUpForm.username}
                  onChange={(e) => setSignUpForm({ ...signUpForm, username: e.target.value })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.background = "rgba(139,92,246,0.05)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  required minLength={3} />
              </div>
              <div style={inputWrap}>
                <span style={iconStyle}><Lock size={15} /></span>
                <input style={{ ...inputStyle, paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="Password (min 6 chars)"
                  value={signUpForm.password} onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.background = "rgba(139,92,246,0.05)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                  required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", display: "flex" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: "14px", borderRadius: 11, background: "linear-gradient(135deg,#9333ea,#7c3aed)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(147,51,234,0.35)", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <p style={{ textAlign: "center", fontSize: 12, color: "#334155", margin: 0 }}>
                By creating an account you agree to our{" "}
                <span style={{ color: "#a855f7", cursor: "pointer" }}>Terms of Service</span>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
