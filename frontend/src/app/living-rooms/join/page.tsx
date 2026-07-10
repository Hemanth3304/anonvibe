"use client";

import RoomSearchFilters from "@/components/living-rooms/RoomSearchFilters";
import RoomCard from "@/components/living-rooms/RoomCard";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock Data
const MOCK_ROOMS = [
  {
    id: "room-1",
    title: "Weekend Indie Music Night",
    hostName: "Alex Rivera",
    category: "Music Night",
    location: "Koramangala, Bangalore",
    distance: "2.5 km away",
    date: "Sat, Oct 15",
    time: "8:00 PM",
    price: 500,
    availableSlots: 8,
    totalSlots: 20,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "room-2",
    title: "FIFA & Pizza Night",
    hostName: "Sam Sharma",
    category: "Gaming",
    location: "Indiranagar, Bangalore",
    distance: "4.0 km away",
    date: "Fri, Oct 14",
    time: "7:30 PM",
    price: 300,
    availableSlots: 0,
    totalSlots: 6,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "room-3",
    title: "Tech Startup Networking",
    hostName: "Priya Patel",
    category: "Networking",
    location: "HSR Layout, Bangalore",
    distance: "1.2 km away",
    date: "Sun, Oct 16",
    time: "4:00 PM",
    price: 1000,
    availableSlots: 12,
    totalSlots: 50,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function JoinRoomPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#0A0A0A] text-white relative overflow-x-hidden flex flex-col p-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        <div
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"
          style={{ pointerEvents: "none" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3" /> Find Your Vibe
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Join a Living Room
            </h1>
          </div>
          
          <Link href="/living-rooms" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
            Back to Menu
          </Link>
        </div>

        {/* Search and Filters */}
        <RoomSearchFilters />

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {MOCK_ROOMS.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </div>
    </div>
  );
}
