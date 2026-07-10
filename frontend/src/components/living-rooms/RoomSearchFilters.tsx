"use client";

import { Search, MapPin, Calendar, Filter, X, IndianRupee } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomSearchFilters() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
          <input 
            type="text" 
            placeholder="Search by city, area, or pincode..." 
            className="w-full bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg pl-12 pr-4 py-4 text-[var(--text-primary)] font-body focus:outline-none focus:border-[var(--primary)] transition-colors soft-shadow"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 md:px-6 py-4 rounded-lg border transition-colors flex items-center gap-2 ${showFilters ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
        >
          {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          <span className="hidden md:inline font-body font-medium">{showFilters ? 'Close' : 'Filters'}</span>
        </button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg grid grid-cols-1 md:grid-cols-4 gap-6 soft-shadow">
              
              {/* Category */}
              <div>
                <label className="block text-[var(--text-tertiary)] text-label mb-2">Category</label>
                <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded px-4 py-2.5 text-[var(--text-primary)] font-body text-sm focus:border-[var(--primary)] outline-none">
                  <option>All Categories</option>
                  <option>House Party</option>
                  <option>Gaming</option>
                  <option>Networking</option>
                  <option>Music Night</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[var(--text-tertiary)] text-label mb-2">Date</label>
                <input type="date" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded px-4 py-2.5 text-[var(--text-primary)] font-body text-sm focus:border-[var(--primary)] outline-none" />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[var(--text-tertiary)] text-label mb-2">Budget (Max)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                  <input type="number" placeholder="5000" className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded pl-9 pr-4 py-2.5 text-[var(--text-primary)] font-body text-sm focus:border-[var(--primary)] outline-none" />
                </div>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-[var(--text-tertiary)] text-label mb-2">Distance</label>
                <select className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded px-4 py-2.5 text-[var(--text-primary)] font-body text-sm focus:border-[var(--primary)] outline-none">
                  <option>Anywhere</option>
                  <option>Within 5 km</option>
                  <option>Within 10 km</option>
                  <option>Within 25 km</option>
                </select>
              </div>

              <div className="md:col-span-4 flex justify-end pt-4 border-t border-[var(--border-subtle)]">
                <button className="btn-primary">
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
