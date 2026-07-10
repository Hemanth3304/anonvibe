"use client";

import { motion } from "framer-motion";
import { Users, Home, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LivingRoomsEntry() {
  const [hoveredCard, setHoveredCard] = useState<"host" | "join" | null>(null);

  return (
    <div className="w-full min-h-full bg-[#0A0A0A] text-white relative overflow-hidden flex flex-col items-center justify-center p-6 py-12 flex-1">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
        <div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
          style={{ pointerEvents: "none" }}
        />
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium tracking-wide text-white/80 uppercase">
              Living Rooms
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60"
          >
            Connect in Real Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto"
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
              className="relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[22px] p-8 md:p-10 flex flex-col gap-6 overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                  <Home className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    Host a Room
                  </h2>
                  <p className="text-white/50 text-lg leading-relaxed">
                    Create a space for people to gather. Set the rules, choose the vibe, and start earning by hosting local events.
                  </p>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-purple-400 font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                    Start Hosting <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
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
              className="relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent overflow-hidden h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-[22px] p-8 md:p-10 flex flex-col gap-6 overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  <Users className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                    Join a Room
                  </h2>
                  <p className="text-white/50 text-lg leading-relaxed">
                    Discover amazing local events and gatherings near you. Meet new people and experience your city together.
                  </p>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between">
                  <span className="text-blue-400 font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                    Explore Rooms <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
