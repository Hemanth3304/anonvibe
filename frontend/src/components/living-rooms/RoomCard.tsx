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
    <div className="group relative card-surface hover-soft-lift overflow-hidden flex flex-col h-full bg-[var(--surface)] border-[var(--border-subtle)]">
      {/* Image & Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 rounded-sm bg-white/90 backdrop-blur-md text-[10px] font-bold text-[var(--primary)] uppercase tracking-wider border border-[var(--border-subtle)]">
            {category}
          </span>
          {isFull && (
            <span className="px-2.5 py-1 rounded-sm bg-[var(--secondary)]/90 backdrop-blur-md text-[10px] font-bold text-[var(--bg-primary)] uppercase tracking-wider border border-[var(--secondary)]">
              Fully Booked
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex items-center gap-1.5 text-[var(--secondary)] font-medium text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-white drop-shadow-md">{rating.toFixed(1)}</span>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-display font-bold text-white drop-shadow-md">₹{price}</span>
            <span className="text-xs text-white/90 drop-shadow-md font-body">per person</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">{title}</h3>
          <p className="text-sm text-[var(--text-tertiary)] font-body mt-1">Hosted by <span className="text-[var(--text-secondary)] font-medium">{hostName}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-[var(--text-secondary)] font-body">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="line-clamp-1">{location}</span>
              <span className="text-xs text-[var(--text-tertiary)]">{distance}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span>{date}</span>
              <span className="text-xs text-[var(--text-tertiary)]">{time}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-body">
            <Users className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className={isFull ? "text-[var(--text-tertiary)]" : "text-[var(--primary)] font-medium"}>
              {availableSlots} / {totalSlots} Slots
            </span>
          </div>
          
          <Link href={`/living-rooms/${id}`}>
            <button 
              disabled={isFull}
              className="px-4 py-2 rounded-lg btn-secondary text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFull ? "Full" : "Join"} <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
