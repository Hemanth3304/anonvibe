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
    // Round to 1 decimal (approx 11km precision) to protect privacy
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
    // Skip DB write for demo users or if Supabase not configured
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

  return (
    <div className="modal-overlay">
      <motion.div
        className="w-full max-w-lg"
        style={{ background: "rgba(10,15,30,0.98)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 24, padding: 40 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-1.5 rounded-full transition-all duration-500"
                style={{ background: i < step ? "linear-gradient(90deg, #9333ea, #7c3aed)" : "rgba(255,255,255,0.08)" }}
              />
              <span className="text-xs" style={{ color: i < step ? "#c084fc" : "#475569" }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Purpose */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Why are you here?</h2>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>Choose your primary reason for joining AnonVibe</p>
                <div className="grid grid-cols-2 gap-3">
                  {PURPOSES.map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      onClick={() => setPurpose(id)}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        background: purpose === id ? `${color}18` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${purpose === id ? color + "60" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <Icon size={20} style={{ color }} className="mb-2" />
                      <span className="font-semibold text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Choose your interests</h2>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>Select at least 1. This powers your AI recommendations.</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(({ id, label }) => (
                    <button key={id} onClick={() => toggleInterest(id)} className={`tag-pill ${interests.includes(id) ? "selected" : ""}`}>
                      {interests.includes(id) && <Check size={12} className="inline mr-1" />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Languages */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Select languages</h2>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>Match with people who speak your language</p>
                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                  {LANGUAGES.map((lang) => (
                    <button key={lang} onClick={() => toggleLanguage(lang)} className={`tag-pill ${languages.includes(lang) ? "selected" : ""}`}>
                      {languages.includes(lang) && <Check size={12} className="inline mr-1" />}
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.3)" }}>
                  <MapPin size={28} style={{ color: "#a855f7" }} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Enable Location</h2>
                <p className="text-sm mb-2" style={{ color: "#64748b" }}>
                  AnonVibe only stores your <strong className="text-purple-400">approximate location</strong> (±11 km).
                  Your exact GPS coordinates are never saved or shared.
                </p>
                {locationShared ? (
                  <div className="p-3 rounded-xl mt-4" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}>
                    <Check className="inline mr-2" size={16} style={{ color: "#34d399" }} />
                    <span style={{ color: "#34d399" }}>Approximate location enabled</span>
                  </div>
                ) : (
                  <button onClick={requestLocation} className="btn-primary mt-4 mx-auto block">
                    Enable Approximate Location
                  </button>
                )}
                <p className="text-xs mt-3" style={{ color: "#334155" }}>You can skip this step and enable it later in settings.</p>
              </div>
            )}

            {/* Step 5: Profile */}
            {step === 5 && (
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)", fontSize: 36 }}>
                  🎉
                </div>
                <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                  Your profile is ready. You can add a photo later in your profile settings.
                </p>
                <div className="p-4 rounded-xl text-left space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#64748b" }}>Purpose</span>
                    <span className="font-semibold capitalize">{purpose}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#64748b" }}>Interests</span>
                    <span className="font-semibold">{interests.length} selected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#64748b" }}>Languages</span>
                    <span className="font-semibold">{languages.join(", ") || "—"}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : undefined}
            className="btn-ghost text-sm"
            style={{ visibility: step > 1 ? "visible" : "hidden" }}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
            disabled={!canProceed() || loading}
          >
            {loading ? "Saving..." : step === 5 ? "Enter AnonVibe 🚀" : "Continue"}
            {!loading && step < 5 && <ChevronRight size={16} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
