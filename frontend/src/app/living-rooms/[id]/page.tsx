"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Clock, IndianRupee, Users, Star, ShieldCheck, User } from "lucide-react";
import { motion } from "framer-motion";
import BookingModal from "@/components/living-rooms/BookingModal";

// Mock Data for a single room
const ROOM_DATA = {
  id: "room-1",
  title: "Weekend Indie Music Night",
  hostName: "Alex Rivera",
  category: "Music Night",
  description: "Join us for an intimate evening of live indie music, good vibes, and great conversations. I'll be hosting a couple of local artists. Snacks and soft drinks will be provided, but feel free to BYOB! The space is cozy with ambient lighting and floor seating.",
  location: "Koramangala, Bangalore",
  distance: "2.5 km away",
  date: "Sat, Oct 15",
  time: "8:00 PM",
  duration: "3 Hours",
  price: 500,
  availableSlots: 8,
  totalSlots: 20,
  rating: 4.8,
  reviewsCount: 24,
  rules: ["No Smoking inside", "BYOB allowed", "Respect the artists", "Take off shoes at entrance"],
  images: [
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
  ]
};

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // In a real app, fetch room by params.id
  const room = ROOM_DATA;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${room.images[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent" />
        
        <button 
          onClick={() => router.back()}
          className="absolute top-24 left-6 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 flex flex-col md:flex-row gap-8">
        {/* Left Column: Details */}
        <div className="flex-1 space-y-8">
          
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold border border-purple-500/30">
              {room.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold">{room.title}</h1>
            
            <div className="flex items-center gap-4 text-white/70">
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-bold">{room.rating}</span>
                <span className="text-white/40">({room.reviewsCount} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{room.location} (Approx)</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8 text-white/50" />
            </div>
            <div>
              <p className="text-sm text-white/50">Hosted by</p>
              <p className="text-xl font-bold">{room.hostName}</p>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <ShieldCheck className="w-4 h-4" /> Identity Verified
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">About this room</h2>
            <p className="text-white/70 leading-relaxed text-lg">
              {room.description}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">House Rules</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.rules.map((rule, idx) => (
                <li key={idx} className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-white/90">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="w-full md:w-[380px] shrink-0">
          <div className="sticky top-28 bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-end gap-2 pb-6 border-b border-white/10">
              <span className="text-4xl font-bold">₹{room.price}</span>
              <span className="text-white/50 mb-1">/ person</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{room.date}</p>
                  <p className="text-sm text-white/50">{room.time} • {room.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{room.availableSlots} Slots Available</p>
                  <p className="text-sm text-white/50">Out of {room.totalSlots} total guests</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={room.availableSlots === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {room.availableSlots === 0 ? "Fully Booked" : "Book Slot"}
            </button>
            <p className="text-xs text-center text-white/40">You won't be charged yet. You only pay a 25% advance to reserve your spot.</p>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        roomName={room.title}
        pricePerPerson={room.price}
      />
    </div>
  );
}
