"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  MessageCircle, Heart, MapPin, Users, Radio, Calendar,
  Sparkles, Shield, Zap, ArrowRight, Star, Lock, ChevronRight,
  Globe, Menu, X, Video
} from "lucide-react";
import AuthModal from "@/components/modals/AuthModal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import AgeGate from "@/components/modals/AgeGate";
import ChatRoom from "@/components/chat/ChatRoom";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });

    // Listen for auth changes (like when OAuth redirects back)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserId("");
  }

  function openAuth(tab: "signin" | "signup" = "signup") {
    window.dispatchEvent(new CustomEvent("open-auth", { detail: tab }));
  }

  function handleAuthSuccess(id: string) {
    setUserId(id);
    setAuthOpen(false);
    if (authTab === "signup") {
      setShowOnboarding(true);
    }
  }

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    alert("Welcome to AnonVibe! 🎉 (Home page coming soon)");
  }
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] w-full overflow-hidden">
      {!inChat ? (
        <>
          {/* ── Hero ── */}
          <section className="relative z-10 pt-24 pb-24 px-6 text-center max-w-6xl mx-auto flex flex-col items-center justify-center">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative z-10 flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full card-surface border-[var(--secondary)] text-[var(--secondary)] text-label mb-8">
                <Sparkles size={14} className="text-[var(--secondary)]" />
                <span>The #1 Social Discovery Platform</span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl md:text-7xl font-display font-normal tracking-tight leading-[1.1] mb-6 text-[var(--primary)]">
                Meet New People.<br />
                <span className="italic">Join Communities.</span><br />
                Chat Anonymously.
              </h1>

              <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed font-body">
                AnonVibe is a modern social discovery platform where you can connect authentically — safely and privately through Anonymous Chat, Dating, Living Rooms, and Events.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full sm:w-auto mb-16">
                <button id="start-chat-btn" onClick={() => setInChat(true)} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base">
                  <MessageCircle size={18} />Start Anonymous Chat
                </button>
                <Link href="/living-rooms" className="w-full sm:w-auto">
                  <button className="btn-secondary w-full flex items-center justify-center gap-2 px-8 py-4 text-base">
                    <Video size={18} />Join a Living Room
                  </button>
                </Link>
                {userId ? (
                  <button id="dashboard-btn" onClick={() => router.push("/dashboard/user")} className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base">
                    Go to Dashboard <ArrowRight size={15} />
                  </button>
                ) : (
                  <>
                    <button id="signin-btn" onClick={() => openAuth("signin")} className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base">
                      Sign In <ArrowRight size={15} />
                    </button>
                    <button id="create-account-btn" onClick={() => openAuth("signup")} className="btn-secondary w-full sm:w-auto px-8 py-4 text-base">
                      Create Account
                    </button>
                  </>
                )}
              </div>

              {/* Trust strip */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
                {[{ icon: Shield, label: "End-to-End Privacy" }, { icon: Zap, label: "AI Moderation" }, { icon: Globe, label: "150+ Countries" }, { icon: Star, label: "4.9★ Rating" }].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-tertiary)" }}>
                    <Icon size={14} color="var(--primary)" />{label}
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* ── Stats ── */}
          <section className="relative z-10 py-12 px-6">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center p-6 card-surface">
                  <div className="text-4xl font-display font-normal text-[var(--primary)] mb-2">{stat.value}</div>
                  <div className="text-[var(--text-secondary)] text-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

      {/* ── Feature Cards ── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-normal mb-4 tracking-tight text-[var(--primary)]">
              Everything you need to connect
            </h2>
            <p className="text-lg text-[var(--text-secondary)] font-body">Six powerful ways to discover and engage with people around the world.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.id} id={`feature-${f.id}`} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
                onClick={() => {
                  if (f.id === "anon-chat") {
                    setInChat(true);
                  } else if (f.id === "living-rooms") {
                    router.push('/living-rooms');
                  } else if (f.requiresAuth) {
                    if (userId) {
                      router.push("/dashboard/user");
                    } else {
                      openAuth("signup");
                    }
                  }
                }}
                className="card-surface hover-soft-lift p-8 cursor-pointer relative overflow-hidden flex flex-col h-full"
              >
                {/* Icon row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <f.icon size={21} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {f.requiresAuth && <Lock size={11} className="text-[var(--text-tertiary)]" />}
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--primary)] border border-[var(--border-subtle)] uppercase tracking-wider">{f.badge}</span>
                  </div>
                </div>

                <h3 className="text-[1.15rem] font-bold mb-1.5 tracking-tight text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-tertiary)] mb-5">{f.tagline}</p>

                <ul className="list-none p-0 m-0 flex flex-col gap-3 flex-1">
                  {f.features.map(feat => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-[var(--secondary)]" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button className="mt-8 flex items-center gap-1 text-sm font-bold bg-transparent border-none p-0 cursor-pointer transition-opacity hover:opacity-80 text-[var(--primary)]">
                  {f.requiresAuth ? (userId ? "Go to Dashboard" : "Sign up to unlock") : "Start for free"} <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center py-16 px-8 md:px-12 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] relative overflow-hidden card-surface-lg">
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-display font-normal mb-4 tracking-tight text-[var(--primary)]">
              Ready to <span className="italic">connect?</span>
            </h2>
            <p className="text-lg text-[var(--text-secondary)] font-body mb-10 max-w-xl mx-auto">Join half a million people already discovering meaningful connections on AnonVibe.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {userId ? (
                <button onClick={() => router.push("/dashboard/user")} className="btn-primary w-full sm:w-auto">
                  <Sparkles size={18} />Go to Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => openAuth("signup")} className="btn-primary w-full sm:w-auto">
                    <Sparkles size={18} />Create Free Account
                  </button>
                  <button onClick={() => openAuth("signin")} className="btn-secondary w-full sm:w-auto">
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-8 px-6 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <Sparkles size={12} className="text-[var(--primary)]" />
            </div>
            <span className="font-display font-bold text-sm text-[var(--text-primary)]">AnonVibe</span>
          </div>
          <p className="text-sm text-[var(--text-tertiary)] font-body">© 2026 AnonVibe. Anonymous. Secure. Social.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Safety"].map(link => (
              <a key={link} href="#" className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] font-body transition-colors">{link}</a>
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

    </div>
  );
}
