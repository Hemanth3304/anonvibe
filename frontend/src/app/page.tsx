"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  MessageCircle, Heart, MapPin, Users, Radio, Calendar,
  Sparkles, Shield, Zap, ArrowRight, Star, Lock, ChevronRight,
  Globe, Menu, X
} from "lucide-react";
import AuthModal from "@/components/modals/AuthModal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import AgeGate from "@/components/modals/AgeGate";
import ChatRoom from "@/components/chat/ChatRoom";

const FEATURES = [
  {
    id: "anon-chat",
    icon: MessageCircle,
    title: "Anonymous Chat",
    tagline: "Talk freely. No judgment.",
    color: "#22d3ee",
    border: "rgba(34,211,238,0.25)",
    glow: "rgba(34,211,238,0.12)",
    requiresAuth: false,
    badge: "Free",
    features: ["Send & receive anonymous messages", "Anonymous polls & confessions", "Compliments & reactions", "No login for limited usage"],
  },
  {
    id: "dating",
    icon: Heart,
    title: "Dating",
    tagline: "Find your match.",
    color: "#f472b6",
    border: "rgba(244,114,182,0.25)",
    glow: "rgba(244,114,182,0.12)",
    requiresAuth: true,
    badge: "AI-Powered",
    features: ["AI-powered compatibility scores", "Swipe, like & match", "AI ice breakers", "Verified profiles with safety tools"],
  },
  {
    id: "nearby",
    icon: MapPin,
    title: "Nearby People",
    tagline: "Discover who's around.",
    color: "#fb923c",
    border: "rgba(251,146,60,0.25)",
    glow: "rgba(251,146,60,0.12)",
    requiresAuth: true,
    badge: "Privacy-First",
    features: ["Geohash-based proximity (±11km)", "Never reveals exact GPS", "Filter by age, interests & language", "\"2 km away\" — never coordinates"],
  },
  {
    id: "communities",
    icon: Users,
    title: "Communities",
    tagline: "Find your tribe.",
    color: "#a855f7",
    border: "rgba(168,85,247,0.25)",
    glow: "rgba(168,85,247,0.12)",
    requiresAuth: true,
    badge: "Explore",
    features: ["Technology, Gaming, Music & more", "Posts, polls, media & comments", "Create your own community", "Moderators & pinned content"],
  },
  {
    id: "living-rooms",
    icon: Radio,
    title: "Living Rooms",
    tagline: "Go live. Connect now.",
    color: "#34d399",
    border: "rgba(52,211,153,0.25)",
    glow: "rgba(52,211,153,0.12)",
    requiresAuth: true,
    badge: "Live",
    features: ["Voice, video & text rooms", "Raise hand, mute & moderate", "Screen sharing", "Public, private or password rooms"],
  },
  {
    id: "events",
    icon: Calendar,
    title: "Events",
    tagline: "Experience things together.",
    color: "#818cf8",
    border: "rgba(129,140,248,0.25)",
    glow: "rgba(129,140,248,0.12)",
    requiresAuth: true,
    badge: "Nearby",
    features: ["Discover local events on maps", "RSVP & QR check-in", "Host your own events", "Event analytics dashboard"],
  },
];

const STATS = [
  { value: "10M+", label: "Messages Sent" },
  { value: "500K+", label: "Active Users" },
  { value: "150+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [inChat, setInChat] = useState(false);
  const router = useRouter();

  function openAuth(tab: "signin" | "signup" = "signup") {
    setAuthTab(tab);
    setAuthOpen(true);
  }

  function handleAuthSuccess(id: string) {
    setUserId(id);
    setAuthOpen(false);
    setShowOnboarding(true);
  }

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    alert("Welcome to AnonVibe! 🎉 (Home page coming soon)");
  }

  return (
    <div style={{ background: "#030712", minHeight: "100vh", overflowX: "hidden", color: "#f8fafc" }}>
      {/* Gradient mesh background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(139,92,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 10%, rgba(244,114,182,0.08) 0%, transparent 60%)"
      }} />

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 64,
        background: "rgba(3,7,18,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#9333ea,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={15} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px" }}>AnonVibe</span>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }} className="hide-mobile">
          {["Features", "Communities", "Events", "Safety"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: "#94a3b8", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#f8fafc")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}>
              {item}
            </a>
          ))}
        </div>

        {/* Desktop auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hide-mobile">
          <button onClick={() => openAuth("signin")} style={{ padding: "8px 18px", borderRadius: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
          <button onClick={() => openAuth("signup")} style={{ padding: "8px 18px", borderRadius: 10, background: "linear-gradient(135deg,#9333ea,#7c3aed)", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(147,51,234,0.35)" }}>Get Started</button>
        </div>

        {/* Mobile menu toggle */}
        <button className="show-mobile" onClick={() => setNavOpen(!navOpen)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 4 }}>
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {navOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 40, padding: 16, display: "flex", flexDirection: "column", gap: 10, background: "rgba(10,15,30,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={() => { openAuth("signin"); setNavOpen(false); }} style={{ padding: "12px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#f8fafc", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Sign In</button>
            <button onClick={() => { openAuth("signup"); setNavOpen(false); }} style={{ padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#9333ea,#7c3aed)", border: "none", color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Create Account</button>
          </motion.div>
        )}
      </AnimatePresence>

      {!inChat ? (
        <>
          {/* ── Hero ── */}
          <section style={{ position: "relative", zIndex: 1, paddingTop: 120, paddingBottom: 80, textAlign: "center", paddingLeft: 24, paddingRight: 24 }}>
        {/* Glow */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "rgba(147,51,234,0.1)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <motion.div initial={{ y: 12 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} style={{ position: "relative" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, background: "rgba(147,51,234,0.1)", border: "1px solid rgba(147,51,234,0.25)", color: "#c084fc", fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
            <Sparkles size={13} />
            <span>The #1 Social Discovery Platform</span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 20, fontFamily: "inherit" }}>
            Meet New People.<br />
            <span style={{ background: "linear-gradient(135deg,#c084fc 0%,#818cf8 50%,#22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Join Communities.
            </span><br />
            Chat Anonymously.
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#94a3b8", maxWidth: 560, margin: "0 auto 12px" }}>
            Anonymous Chat • Dating • Nearby People • Living Rooms • Communities • Events
          </p>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 460, margin: "0 auto 36px" }}>
            AnonVibe is a modern social discovery platform where you can connect authentically — safely and privately.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 40 }}>
            <button id="start-chat-btn" onClick={() => setInChat(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "linear-gradient(135deg,#9333ea,#7c3aed)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(147,51,234,0.4)" }}>
              <MessageCircle size={17} />Start Anonymous Chat
            </button>
            <button id="signin-btn" onClick={() => openAuth("signin")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Sign In <ArrowRight size={15} />
            </button>
            <button id="create-account-btn" onClick={() => openAuth("signup")} style={{ padding: "14px 28px", borderRadius: 12, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Create Account
            </button>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
            {[{ icon: Shield, label: "End-to-End Privacy" }, { icon: Zap, label: "AI Moderation" }, { icon: Globe, label: "150+ Countries" }, { icon: Star, label: "4.9★ Rating" }].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b" }}>
                <Icon size={14} color="#a855f7" />{label}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="stats-grid">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center", padding: "24px 16px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, background: "linear-gradient(135deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section id="features" style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px" }}>
              Everything you need to <span style={{ background: "linear-gradient(135deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>connect</span>
            </h2>
            <p style={{ fontSize: 16, color: "#64748b" }}>Six powerful ways to discover and engage with people around the world.</p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <motion.div key={f.id} id={`feature-${f.id}`} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                onClick={() => {
                  if (f.id === "anon-chat") {
                    setInChat(true);
                  } else if (f.id === "living-rooms") {
                    router.push("/living-rooms");
                  } else if (f.requiresAuth) {
                    openAuth("signup");
                  }
                }}
                style={{ padding: 28, borderRadius: 20, background: "rgba(255,255,255,0.04)", border: `1px solid ${f.border}`, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}
                whileHover={{ y: -4, boxShadow: `0 20px 60px ${f.glow}, 0 0 0 1px ${f.border}` }}
              >
                {/* Icon row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${f.color}18`, border: `1px solid ${f.color}40` }}>
                    <f.icon size={21} color={f.color} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {f.requiresAuth && <Lock size={11} color="#475569" />}
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}40` }}>{f.badge}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.2px" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{f.tagline}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {f.features.map(feat => (
                    <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#94a3b8" }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: f.color, marginTop: 5, flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, background: "none", border: "none", padding: 0, color: f.color, cursor: "pointer" }}>
                  {f.requiresAuth ? "Sign up to unlock" : "Start for free"} <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "60px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", padding: "56px 40px", borderRadius: 28, background: "linear-gradient(135deg,rgba(147,51,234,0.12),rgba(124,58,237,0.08))", border: "1px solid rgba(147,51,234,0.2)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 300, background: "rgba(147,51,234,0.12)", borderRadius: "50%", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px" }}>
              Ready to <span style={{ background: "linear-gradient(135deg,#c084fc,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>connect?</span>
            </h2>
            <p style={{ fontSize: 16, color: "#94a3b8", marginBottom: 28 }}>Join half a million people already discovering meaningful connections on AnonVibe.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <button onClick={() => openAuth("signup")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, background: "linear-gradient(135deg,#9333ea,#7c3aed)", border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                <Sparkles size={16} />Create Free Account
              </button>
              <button onClick={() => openAuth("signin")} style={{ padding: "14px 28px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#f8fafc", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#9333ea,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={12} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15 }}>AnonVibe</span>
          </div>
          <p style={{ fontSize: 13, color: "#334155" }}>© 2026 AnonVibe. Anonymous. Secure. Social.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Safety"].map(link => (
              <a key={link} href="#" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
        </>
      ) : (
        <ChatRoom onLeave={() => setInChat(false)} />
      )}

      {/* ── Responsive Styles ── */}
      <style>{`
        .hide-mobile { display: flex !important; }
        .show-mobile { display: none !important; }
        .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Modals */}
      {authOpen && (
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} defaultTab={authTab} />
      )}
      {showOnboarding && userId && (
        <OnboardingFlow userId={userId} onComplete={handleOnboardingComplete} />
      )}
      <AgeGate />
    </div>
  );
}
