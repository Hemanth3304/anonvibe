"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  useEffect(() => {
    // Supabase handles the OAuth token exchange automatically
    // We just redirect to the home page once done
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.href = "/";
      }
    };
    setTimeout(checkSession, 1000);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "#030712",
      display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16
    }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(139,92,246,0.3)", borderTop: "3px solid #9333ea", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "#64748b", fontSize: 15 }}>Completing sign-in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
