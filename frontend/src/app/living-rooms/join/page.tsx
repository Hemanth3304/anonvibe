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
    <div className="w-full min-h-[calc(100vh-64px)] bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-x-hidden flex flex-col items-center p-6">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8 flex-1">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full card-surface border-[var(--secondary)] text-[var(--secondary)] text-label uppercase"
            >
              <Sparkles className="w-3 h-3" /> Find Your Vibe
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-display font-normal tracking-tight text-[var(--primary)]">
              Join a Living Room
            </h1>
          </div>
          
          <Link href="/living-rooms" className="text-sm font-body font-medium text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
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
