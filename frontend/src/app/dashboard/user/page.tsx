"use client";

import { Calendar, Ticket, Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

const BOOKINGS = [
  { 
    id: "LR-8472-X9M", 
    title: "Weekend Indie Music Night", 
    date: "Oct 15, 2026", 
    time: "8:00 PM",
    guests: 2,
    paid: "₹250",
    status: "Confirmed",
    statusIcon: CheckCircle2,
    statusColor: "text-green-400"
  },
  { 
    id: "LR-9921-A4B", 
    title: "Tech Startup Networking", 
    date: "Oct 16, 2026", 
    time: "4:00 PM",
    guests: 1,
    paid: "₹250",
    status: "Upcoming",
    statusIcon: Clock,
    statusColor: "text-blue-400"
  },
  { 
    id: "LR-1102-M8K", 
    title: "House Party", 
    date: "Sep 20, 2026", 
    time: "9:00 PM",
    guests: 4,
    paid: "₹1000",
    status: "Cancelled",
    statusIcon: XCircle,
    statusColor: "text-red-400"
  }
];

export default function UserDashboardPage() {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 py-12 flex flex-col items-center font-body">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--primary)]">My Bookings</h1>
            <p className="text-[var(--text-tertiary)] mt-1">Manage your tickets and upcoming events.</p>
          </div>
          <Link href="/living-rooms/join">
            <button className="btn-secondary">
              Find More Rooms
            </button>
          </Link>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {BOOKINGS.map((booking) => (
            <div key={booking.id} className="card-surface p-6 flex flex-col md:flex-row gap-6 justify-between md:items-center hover-soft-lift">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--primary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2 py-1 rounded">ID: {booking.id}</span>
                  <div className={`flex items-center gap-1 text-xs font-medium ${booking.status === "Cancelled" ? "text-red-600" : booking.status === "Confirmed" ? "text-green-600" : "text-blue-600"}`}>
                    <booking.statusIcon className="w-4 h-4" /> {booking.status}
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-[var(--primary)]">{booking.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {booking.date} • {booking.time}</span>
                  <span>•</span>
                  <span>{booking.guests} Guests</span>
                  <span>•</span>
                  <span>Advance Paid: <strong className="text-[var(--text-primary)]">{booking.paid}</strong></span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <button className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-[var(--border-subtle)]">
                  Contact Host
                </button>
                {booking.status !== "Cancelled" && (
                  <button className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-2 text-sm px-4 py-2">
                    <Ticket className="w-4 h-4" /> View Ticket
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
