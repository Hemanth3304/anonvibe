"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Heart, Briefcase, Gamepad2, BookOpen, Music,
  Code, Camera, Trophy, Film, Globe, MapPin, ChevronRight, Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface OnboardingFlowProps {
  userId: string;
  onComplete: () => void;
}

const PURPOSES = [
  { id: "friends", label: "Make Friends", icon: Users, color: "#22d3ee" },
  { id: "dating", label: "Dating", icon: Heart, color: "#f472b6" },
  { id: "networking", label: "Networking", icon: Briefcase, color: "#fb923c" },
  { id: "gaming", label: "Gaming", icon: Gamepad2, color: "#a855f7" },
  { id: "study", label: "Study", icon: BookOpen, color: "#34d399" },
  { id: "music", label: "Music", icon: Music, color: "#818cf8" },
];

const INTERESTS = [
  { id: "technology", label: "Technology", icon: Code },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "music", label: "Music", icon: Music },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "movies", label: "Movies", icon: Film },
  { id: "programming", label: "Programming", icon: Code },
  { id: "travel", label: "Travel", icon: Globe },
];

const LANGUAGES = [
  "English", "Hindi", "Spanish", "French", "German",
  "Japanese", "Korean", "Chinese", "Arabic", "Portuguese",
  "Russian", "Italian", "Turkish", "Dutch", "Bengali",
];

const STEPS = ["Purpose", "Interests", "Languages", "Location", "Profile"];

export default function OnboardingFlow({ userId, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [locationShared, setLocationShared] = useState(false);
  const [locationGeohash, setLocationGeohash] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleInterest(id: string) {
    setInterests((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) => prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]);
  }

  function geohash(lat: number, lon: number): string {
    const roundedLat = Math.round(lat * 10) / 10;
    const roundedLon = Math.round(lon * 10) / 10;
    return `${roundedLat},${roundedLon}`;
  }

  function requestLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const hash = geohash(pos.coords.latitude, pos.coords.longitude);
      setLocationGeohash(hash);
      setLocationShared(true);
    });
  }

  async function saveStep(stepNum: number, data: object) {
    if (userId.startsWith("demo-") || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    try {
      await supabase
        .from("profiles")
        .upsert({ id: userId, onboarding_step: stepNum, ...data }, { onConflict: "id" });
    } catch {
      // Non-blocking
    }
  }

  async function handleNext() {
    setLoading(true);
    if (step === 1) await saveStep(1, { purpose });
    if (step === 2) await saveStep(2, { interests });
    if (step === 3) await saveStep(3, { languages });
    if (step === 4) await saveStep(4, { locationGeohash });
    setLoading(false);

    if (step < 5) setStep(step + 1);
    else onComplete();
  }

  const canProceed = () => {
    if (step === 1) return !!purpose;
    if (step === 2) return interests.length >= 1;
    if (step === 3) return languages.length >= 1;
    return true;
  };

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(3,7,18,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  };

  const modalBoxStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 480,
    background: "rgba(10,14,28,0.98)",
    border: "1px solid rgba(139,92,246,0.22)",
    borderRadius: 24,
    padding: "36px 32px 32px",
    position: "relative",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
    boxSizing: "border-box",
  };

  const progressBarContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
    width: "100%",
  };

  const progressStepStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  };

  const progressLineStyle = (isActive: boolean): React.CSSProperties => ({
    width: "100%",
    height: 3,
    borderRadius: 100,
    background: isActive ? "linear-gradient(90deg, #9333ea, #7c3aed)" : "rgba(255,255,255,0.08)",
    transition: "background 0.3s ease",
  });

  const progressLabelStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: 11,
    fontWeight: 600,
    color: isActive ? "#c084fc" : "#475569",
    transition: "color 0.3s ease",
  });

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginTop: 20,
  };

  const purposeButtonStyle = (isSelected: boolean, color: string): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "18px 16px",
    borderRadius: 14,
    background: isSelected ? `${color}15` : "rgba(255,255,255,0.03)",
    border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    gap: 8,
  });

  const tagContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
    maxHeight: 240,
    overflowY: "auto",
    paddingRight: 4,
  };

  const tagButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 100,
    background: isSelected ? "rgba(147,51,234,0.18)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${isSelected ? "rgba(147,51,234,0.5)" : "rgba(255,255,255,0.08)"}`,
    color: isSelected ? "#c084fc" : "#94a3b8",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const locationCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "12px 0",
  };

  const summaryBoxStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 24,
    boxSizing: "border-box",
  };

  const summaryRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14,
  };

  const navRowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 36,
  };

  return (
    <div style={overlayStyle}>
      <motion.div
        style={modalBoxStyle}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Progress Bar */}
        <div style={progressBarContainerStyle}>
          {STEPS.map((s, i) => (
            <div key={s} style={progressStepStyle}>
              <div style={progressLineStyle(i < step)} />
              <span style={progressLabelStyle(i < step)}>{s}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Purpose */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Why are you here?</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Choose your primary reason for joining AnonVibe</p>
                <div style={gridStyle}>
                  {PURPOSES.map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      onClick={() => setPurpose(id)}
                      style={purposeButtonStyle(purpose === id, color)}
                    >
                      <Icon size={20} color={color} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#f8fafc" }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Choose your interests</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Select at least 1. This powers your AI recommendations.</p>
                <div style={tagContainerStyle}>
                  {INTERESTS.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => toggleInterest(id)}
                      style={tagButtonStyle(interests.includes(id))}
                    >
                      {interests.includes(id) && <Check size={12} />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Languages */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>Select languages</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Match with people who speak your language</p>
                <div style={tagContainerStyle}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      style={tagButtonStyle(languages.includes(lang))}
                    >
                      {languages.includes(lang) && <Check size={12} />}
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div style={locationCardStyle}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.3)", marginBottom: 16
                }}>
                  <MapPin size={24} color="#a855f7" />
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>Enable Location</h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5, maxWidth: 360, margin: "0 auto 20px" }}>
                  AnonVibe only stores your <strong style={{ color: "#c084fc" }}>approximate location</strong> (±11 km).
                  Your exact GPS coordinates are never saved or shared.
                </p>
                {locationShared ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12,
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399", fontSize: 14, fontWeight: 600
                  }}>
                    <Check size={16} />
                    <span>Approximate location enabled</span>
                  </div>
                ) : (
                  <button
                    onClick={requestLocation}
                    style={{
                      padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, #9333ea, #7c3aed)",
                      border: "none", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(147,51,234,0.3)"
                    }}
                  >
                    Enable Approximate Location
                  </button>
                )}
                <p style={{ fontSize: 12, color: "#475569", marginTop: 12 }}>You can skip this step and enable it later in settings.</p>
              </div>
            )}

            {/* Step 5: Profile */}
            {step === 5 && (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #9333ea, #7c3aed)", fontSize: 32
                }}>
                  🎉
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>You&apos;re all set!</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                  Your profile is ready. You can add a photo later in your profile settings.
                </p>
                <div style={summaryBoxStyle}>
                  <div style={summaryRowStyle}>
                    <span style={{ color: "#64748b", fontWeight: 500 }}>Purpose</span>
                    <span style={{ fontWeight: 600, color: "#f8fafc", textTransform: "capitalize" }}>{purpose}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span style={{ color: "#64748b", fontWeight: 500 }}>Interests</span>
                    <span style={{ fontWeight: 600, color: "#f8fafc" }}>{interests.length} selected</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span style={{ color: "#64748b", fontWeight: 500 }}>Languages</span>
                    <span style={{ fontWeight: 600, color: "#f8fafc" }}>{languages.join(", ") || "—"}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={navRowStyle}>
          <button
            onClick={() => step > 1 ? setStep(step - 1) : undefined}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8",
              padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
              visibility: step > 1 ? "visible" : "hidden", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#f8fafc"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none",
              background: !canProceed() ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #9333ea, #7c3aed)",
              color: !canProceed() ? "#475569" : "white",
              cursor: !canProceed() || loading ? "not-allowed" : "pointer",
              boxShadow: !canProceed() ? "none" : "0 4px 16px rgba(147,51,234,0.3)",
              transition: "all 0.2s"
            }}
          >
            {loading ? "Saving..." : step === 5 ? "Enter AnonVibe 🚀" : "Continue"}
            {!loading && step < 5 && <ChevronRight size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
