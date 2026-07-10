"use client";

import HostWizard from "@/components/living-rooms/HostWizard";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HostRoomPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#0A0A0A] text-white relative overflow-x-hidden flex flex-col items-center p-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        <div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
          style={{ pointerEvents: "none" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3" /> Step-by-Step Guide
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Host a Living Room
            </h1>
          </div>
          
          <Link href="/living-rooms" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
            Cancel
          </Link>
        </div>

        {/* Wizard Component */}
        <div className="flex-1 flex flex-col">
          <HostWizard />
        </div>
      </div>
    </div>
  );
}
