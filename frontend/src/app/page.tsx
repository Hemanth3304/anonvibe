"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  MessageCircle, Heart, MapPin, Users, Radio, Calendar,
  Sparkles, Shield, Zap, ArrowRight, Star, Lock, ChevronRight,
  Globe, Menu, X
} from "lucide-react";
import AuthModal from "@/components/modals/AuthModal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

const FEATURES = [
  {
    id: "anon-chat",
    icon: MessageCircle,
    title: "Anonymous Chat",
    tagline: "Talk freely. No judgment.",
    color: "#22d3ee",
    gradient: "from-cyan-500/20 to-cyan-600/5",
    border: "rgba(34,211,238,0.2)",
    glow: "rgba(34,211,238,0.1)",
    requiresAuth: false,
    badge: "Free",
    badgeColor: "#22d3ee",
    features: [
      "Send & receive anonymous messages",
      "Anonymous polls & confessions",
      "Compliments & reactions",
      "No login for limited usage",
    ],
  },
  {
    id: "dating",
    icon: Heart,
    title: "Dating",
    tagline: "Find your match.",
    color: "#f472b6",
    gradient: "from-pink-500/20 to-pink-600/5",
    border: "rgba(244,114,182,0.2)",
    glow: "rgba(244,114,182,0.1)",
    requiresAuth: true,
    badge: "AI-Powered",
    badgeColor: "#f472b6",
    features: [
      "AI-powered compatibility scores",
      "Swipe, like & match",
      "AI ice breakers",
      "Verified profiles with safety tools",
    ],
  },
  {
    id: "nearby",
    icon: MapPin,
    title: "Nearby People",
    tagline: "Discover who's around.",
    color: "#fb923c",
    gradient: "from-orange-500/20 to-orange-600/5",
    border: "rgba(251,146,60,0.2)",
    glow: "rgba(251,146,60,0.1)",
    requiresAuth: true,
    badge: "Privacy-First",
    badgeColor: "#fb923c",
    features: [
      "Geohash-based proximity (±11km)",
      "Never reveals exact GPS",
      "Filter by age, interests & language",
      "\"2 km away\" — never coordinates",
    ],
  },
  {
    id: "communities",
    icon: Users,
    title: "Communities",
    tagline: "Find your tribe.",
    color: "#a855f7",
    gradient: "from-purple-500/20 to-purple-600/5",
    border: "rgba(168,85,247,0.2)",
    glow: "rgba(168,85,247,0.1)",
    requiresAuth: true,
    badge: "Explore",
    badgeColor: "#a855f7",
    features: [
      "Technology, Gaming, Music & more",
      "Posts, polls, media & comments",
      "Create your own community",
      "Moderators & pinned content",
    ],
  },
  {
    id: "living-rooms",
    icon: Radio,
    title: "Living Rooms",
    tagline: "Go live. Connect now.",
    color: "#34d399",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "rgba(52,211,153,0.2)",
    glow: "rgba(52,211,153,0.1)",
    requiresAuth: true,
    badge: "Live",
    badgeColor: "#34d399",
    features: [
      "Voice, video & text rooms",
      "Raise hand, mute & moderate",
      "Screen sharing",
      "Public, private or password rooms",
    ],
  },
  {
    id: "events",
    icon: Calendar,
    title: "Events",
    tagline: "Experience things together.",
    color: "#818cf8",
    gradient: "from-violet-500/20 to-violet-600/5",
    border: "rgba(129,140,248,0.2)",
    glow: "rgba(129,140,248,0.1)",
    requiresAuth: true,
    badge: "Nearby",
    badgeColor: "#818cf8",
    features: [
      "Discover local events on maps",
      "RSVP & QR check-in",
      "Host your own events",
      "Event analytics dashboard",
    ],
  },
];

const STATS = [
  { value: "10M+", label: "Messages Sent" },
  { value: "500K+", label: "Active Users" },
  { value: "150+", label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const TRUST_ITEMS = [
  { icon: Shield, label: "End-to-End Privacy" },
  { icon: Zap, label: "AI Moderation" },
  { icon: Globe, label: "150+ Countries" },
  { icon: Star, label: "4.9★ Rating" },
];

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState("");
  const [navOpen, setNavOpen] = useState(false);

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
    // In a real app: redirect to /home
    alert("Welcome to AnonVibe! 🎉 (Home page coming soon)");
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
    }),
  };

  return (
    <div className="bg-mesh min-h-screen">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(3,7,18,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg">AnonVibe</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "#94a3b8" }}>
          {["Features", "Communities", "Events", "Safety"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="btn-ghost text-sm px-4 py-2" onClick={() => openAuth("signin")}>Sign In</button>
          <button className="btn-primary text-sm px-5 py-2.5" onClick={() => openAuth("signup")}>Get Started</button>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden text-slate-400" onClick={() => setNavOpen(!navOpen)}>
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Nav Panel */}
      {navOpen && (
        <motion.div
          className="fixed top-16 left-0 right-0 z-30 p-4 space-y-3 md:hidden"
          style={{ background: "rgba(10,15,30,0.98)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="btn-secondary w-full" onClick={() => { openAuth("signin"); setNavOpen(false); }}>Sign In</button>
          <button className="btn-primary w-full" onClick={() => { openAuth("signup"); setNavOpen(false); }}>Create Account</button>
        </motion.div>
      )}

      {/* ── Hero ── */}
      <section className="relative pt-44 pb-20 px-6 text-center overflow-hidden">
        {/* Background glows */}
        <div className="glow-dot w-96 h-96 top-10 left-1/2 -translate-x-1/2" style={{ background: "rgba(147,51,234,0.12)" }} />

        <motion.div initial={{ y: 15 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
            style={{ background: "rgba(147,51,234,0.1)", border: "1px solid rgba(147,51,234,0.25)", color: "#c084fc" }}>
            <Sparkles size={14} />
            <span>The #1 Social Discovery Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Meet New People.
            <br />
            <span className="gradient-text">Join Communities.</span>
            <br />
            Chat Anonymously.
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4" style={{ color: "#94a3b8" }}>
            Anonymous Chat • Dating • Nearby People • Living Rooms • Communities • Events
          </p>

          <p className="text-base max-w-xl mx-auto mb-10" style={{ color: "#64748b" }}>
            AnonVibe is a modern social discovery platform where you can connect authentically — safely and privately.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              id="start-chat-btn"
              className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4"
              onClick={() => openAuth("signup")}
            >
              <MessageCircle size={18} />
              Start Anonymous Chat
            </button>
            <button
              id="signin-btn"
              className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-4"
              onClick={() => openAuth("signin")}
            >
              Sign In
              <ArrowRight size={16} />
            </button>
            <button
              id="create-account-btn"
              className="btn-ghost flex items-center justify-center gap-2 text-base px-8 py-4"
              onClick={() => openAuth("signup")}
            >
              Create Account
            </button>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
                <Icon size={15} style={{ color: "#a855f7" }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-sm" style={{ color: "#64748b" }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you need to <span className="gradient-text">connect</span>
            </h2>
            <p className="text-lg" style={{ color: "#64748b" }}>
              Six powerful ways to discover and engage with people around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.id}
                id={`feature-${f.id}`}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="p-7 cursor-pointer group relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${f.border}`,
                  borderRadius: 20,
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  transition: "all 0.3s ease",
                }}
                whileHover={{ y: -4, boxShadow: `0 20px 60px ${f.glow}` }}
                onClick={() => f.requiresAuth && openAuth("signup")}
              >
                {/* Glow background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 30% 20%, ${f.glow} 0%, transparent 70%)` }}
                />

                <div className="relative z-10">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${f.color}18`, border: `1px solid ${f.color}40` }}
                    >
                      <f.icon size={22} style={{ color: f.color }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {f.requiresAuth && <Lock size={12} style={{ color: "#475569" }} />}
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${f.badgeColor}18`, color: f.badgeColor, border: `1px solid ${f.badgeColor}40` }}
                      >
                        {f.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-1">{f.title}</h3>
                  <p className="text-sm mb-5" style={{ color: "#64748b" }}>{f.tagline}</p>

                  <ul className="space-y-2.5">
                    {f.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm" style={{ color: "#94a3b8" }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: f.color }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="mt-6 flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                    style={{ color: f.color }}
                  >
                    {f.requiresAuth ? "Sign up to unlock" : "Start for free"}
                    <ChevronRight size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.15), rgba(124,58,237,0.1))", border: "1px solid rgba(147,51,234,0.2)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glow-dot w-64 h-64 top-0 left-1/2 -translate-x-1/2" style={{ background: "rgba(147,51,234,0.15)" }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to <span className="gradient-text">connect?</span>
            </h2>
            <p className="text-lg mb-8" style={{ color: "#94a3b8" }}>
              Join half a million people already discovering meaningful connections on AnonVibe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto sm:mx-0" onClick={() => openAuth("signup")}>
                <Sparkles size={18} />
                Create Free Account
              </button>
              <button className="btn-secondary text-base px-10 py-4 mx-auto sm:mx-0" onClick={() => openAuth("signin")}>
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-bold">AnonVibe</span>
          </div>
          <p className="text-sm" style={{ color: "#334155" }}>
            © 2026 AnonVibe. Anonymous. Secure. Social.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: "#475569" }}>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Safety</a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {authOpen && (
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
          defaultTab={authTab}
        />
      )}

      {showOnboarding && userId && (
        <OnboardingFlow userId={userId} onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}
