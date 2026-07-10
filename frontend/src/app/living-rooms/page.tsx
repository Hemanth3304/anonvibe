"use client";

import { motion } from "framer-motion";
import { Users, Home, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LivingRoomsEntry() {
  const [hoveredCard, setHoveredCard] = useState<"host" | "join" | null>(null);

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden flex flex-col items-center justify-center p-6 py-12">
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-surface border-[var(--secondary)] mb-4"
          >
            <Sparkles className="w-4 h-4 text-[var(--secondary)]" />
            <span className="text-sm font-medium tracking-wide text-[var(--secondary)] text-label uppercase">
              Living Rooms
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-normal tracking-tight text-[var(--primary)]"
          >
            Connect in Real Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] font-body max-w-2xl mx-auto"
          >
            Host unforgettable gatherings or join exciting local events happening right now in your city.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Host Card */}
          <Link href="/living-rooms/host">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onHoverStart={() => setHoveredCard("host")}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group card-surface hover-soft-lift p-8 md:p-10 flex flex-col gap-6 h-full overflow-hidden"
            >
              <div className="w-16 h-16 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-subtle)] text-[var(--primary)] group-hover:bg-[var(--bg-tertiary)] transition-colors duration-300 relative z-10">
                <Home className="w-8 h-8" />
              </div>
              
              <div className="space-y-3 relative z-10">
                <h2 className="text-2xl font-display font-bold text-[var(--primary)] transition-colors duration-300">
                  Host a Room
                </h2>
                <p className="text-[var(--text-tertiary)] font-body text-base leading-relaxed">
                  Create a space for people to gather. Set the rules, choose the vibe, and start earning by hosting local events.
                </p>
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between relative z-10">
                <span className="text-[var(--primary)] font-bold font-body flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                  Start Hosting <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Join Card */}
          <Link href="/living-rooms/join">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onHoverStart={() => setHoveredCard("join")}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group card-surface hover-soft-lift p-8 md:p-10 flex flex-col gap-6 h-full overflow-hidden"
            >
              <div className="w-16 h-16 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-subtle)] text-[var(--primary)] group-hover:bg-[var(--bg-tertiary)] transition-colors duration-300 relative z-10">
                <Users className="w-8 h-8" />
              </div>
              
              <div className="space-y-3 relative z-10">
                <h2 className="text-2xl font-display font-bold text-[var(--primary)] transition-colors duration-300">
                  Join a Room
                </h2>
                <p className="text-[var(--text-tertiary)] font-body text-base leading-relaxed">
                  Browse active living rooms near you. Find the perfect vibe, buy a ticket, and meet new people in your area.
                </p>
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between relative z-10">
                <span className="text-[var(--primary)] font-bold font-body flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                  Find Rooms <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
