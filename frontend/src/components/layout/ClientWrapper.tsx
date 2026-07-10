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
    <div className="flex flex-col w-full min-h-screen bg-[#030712] text-slate-50">
      {!isChatRoom && (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 h-16 bg-[#030712]/85 backdrop-blur-xl border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-white">AnonVibe</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {["Features", "Communities", "Events", "Safety"].map(item => (
              <Link key={item} href={`/#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {userId ? (
              <>
                <Link href="/dashboard/user">
                  <button className="px-4 py-2 rounded-xl bg-transparent border border-white/10 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
                    Dashboard
                  </button>
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 text-sm font-semibold transition-colors">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuth("signin")} className="px-4 py-2 rounded-xl bg-transparent border border-white/10 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
                  Sign In
                </button>
                <button onClick={() => openAuth("signup")} className="px-4 py-2 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white text-sm font-semibold hover:shadow-[0_4px_16px_rgba(147,51,234,0.35)] transition-all">
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-1 text-slate-400 hover:text-white" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      )}

      {/* Mobile Nav */}
      <AnimatePresence>
        {navOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 p-4 flex flex-col gap-3 bg-[#0a0f1e]/98 backdrop-blur-xl border-b border-white/5 md:hidden"
          >
            {userId ? (
              <>
                <Link href="/dashboard/user" onClick={() => setNavOpen(false)}>
                  <button className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold text-left">
                    Dashboard
                  </button>
                </Link>
                <button onClick={handleLogout} className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold text-left">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { openAuth("signin"); setNavOpen(false); }} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold text-left">
                  Sign In
                </button>
                <button onClick={() => { openAuth("signup"); setNavOpen(false); }} className="w-full p-3 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 text-white text-sm font-semibold text-left">
                  Create Account
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Padding (if navbar is visible) */}
      <main className={`w-full ${!isChatRoom ? "pt-16" : ""}`}>
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
