"use client";

import HostWizard from "@/components/living-rooms/HostWizard";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HostRoomPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden flex flex-col items-center p-6">
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full card-surface border-[var(--secondary)] text-[var(--secondary)] text-label uppercase"
            >
              <Sparkles className="w-3 h-3" /> Step-by-Step Guide
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-display font-normal tracking-tight text-[var(--primary)]">
              Host a Living Room
            </h1>
          </div>
          
          <Link href="/living-rooms" className="text-sm font-body font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
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
