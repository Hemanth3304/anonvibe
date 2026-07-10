"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/modals/AuthModal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import AgeGate from "@/components/modals/AgeGate";
import { Sparkles, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signup");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId("");
      }
    });

    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent;
      openAuth(customEvent.detail || "signup");
    };
    window.addEventListener("open-auth", handleOpenAuth);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-auth", handleOpenAuth);
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserId("");
    setNavOpen(false);
    router.push("/");
  }

  function openAuth(tab: "signin" | "signup" = "signup") {
    setAuthTab(tab);
    setAuthOpen(true);
    setNavOpen(false);
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
    router.push("/dashboard/user");
  }

  // Hide global navbar in specific routes if needed (e.g. chat rooms)
  const isChatRoom = pathname?.startsWith('/chat');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {!isChatRoom && (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-20 card-surface border-b border-[var(--border-subtle)] bg-[var(--surface)]">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-subtle)]">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-[var(--text-primary)]">AnonVibe</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Communities", "Events", "Safety"].map(item => (
              <Link key={item} href={`/#${item.toLowerCase()}`} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                {item}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {userId ? (
              <>
                <Link href="/dashboard/user">
                  <button className="btn-secondary">Dashboard</button>
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuth("signin")} className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                  Log In
                </button>
                <button onClick={() => openAuth("signup")} className="btn-primary">
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors" onClick={() => setNavOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </nav>
      )}

      {/* Mobile Nav */}
      <AnimatePresence>
        {navOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[var(--bg-primary)] p-6 md:hidden flex flex-col gap-6 pt-24"
          >
            <button className="absolute top-6 right-6 p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors" onClick={() => setNavOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            {userId ? (
              <>
                <Link href="/dashboard/user" onClick={() => setNavOpen(false)}>
                  <button className="w-full btn-secondary text-left justify-start">
                    Dashboard
                  </button>
                </Link>
                <button onClick={handleLogout} className="w-full p-3 rounded-lg border border-[var(--border-medium)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] text-sm font-medium text-left">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { openAuth("signin"); setNavOpen(false); }} className="w-full btn-secondary text-left justify-start">
                  Sign In
                </button>
                <button onClick={() => { openAuth("signup"); setNavOpen(false); }} className="w-full btn-primary text-left justify-start">
                  Create Account
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Padding (if navbar is visible) */}
      <main className={`w-full flex-1 flex flex-col relative z-0 ${!isChatRoom ? "pt-20" : ""}`}>
        {children}
      </main>

      {/* Global Modals */}
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
