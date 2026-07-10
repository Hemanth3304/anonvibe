"use client";

import { MapPin, Calendar, IndianRupee, Users, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface RoomCardProps {
  id: string;
  title: string;
  hostName: string;
  category: string;
  location: string;
  distance: string;
  date: string;
  time: string;
  price: number;
  availableSlots: number;
  totalSlots: number;
  rating: number;
  image: string;
}

export default function RoomCard({
  id,
  title,
  hostName,
  category,
  location,
  distance,
  date,
  time,
  price,
  availableSlots,
  totalSlots,
  rating,
  image
}: RoomCardProps) {
  const isFull = availableSlots === 0;

  return (
    <div className="group relative bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col h-full">
      {/* Image & Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2 py-1 rounded-md bg-black/50 backdrop-blur-md text-xs font-medium text-white border border-white/10">
            {category}
          </span>
          {isFull && (
            <span className="px-2 py-1 rounded-md bg-red-500/80 backdrop-blur-md text-xs font-bold text-white uppercase border border-red-500/20">
              Fully Booked
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex items-center gap-1.5 text-yellow-400 font-medium text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-bold text-white">₹{price}</span>
            <span className="text-xs text-white/50">per person</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{title}</h3>
          <p className="text-sm text-white/50 mt-1">Hosted by <span className="text-white/80">{hostName}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-white/70">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="line-clamp-1">{location}</span>
              <span className="text-xs text-white/40">{distance}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span>{date}</span>
              <span className="text-xs text-white/40">{time}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-white/50" />
            <span className={isFull ? "text-red-400" : "text-green-400"}>
              {availableSlots} / {totalSlots} Slots
            </span>
          </div>
          
          <Link href={`/living-rooms/${id}`}>
            <button 
              disabled={isFull}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFull ? "Full" : "Join"} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
