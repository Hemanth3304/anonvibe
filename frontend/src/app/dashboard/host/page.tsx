"use client";

import { Users, IndianRupee, Calendar, TrendingUp, Settings, Eye } from "lucide-react";
import Link from "next/link";

// Mock Data
const STATS = [
  { label: "Total Earnings", value: "₹24,500", icon: IndianRupee, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Total Guests", value: "142", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Rooms Hosted", value: "8", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Profile Views", value: "1.2k", icon: Eye, color: "text-pink-400", bg: "bg-pink-500/10" }
];

const ACTIVE_ROOMS = [
  { id: "room-1", title: "Weekend Indie Music Night", date: "Oct 15", slots: "8/20", revenue: "₹6,000", status: "Upcoming" },
  { id: "room-2", title: "Tech Startup Networking", date: "Oct 16", slots: "38/50", revenue: "₹38,000", status: "Upcoming" }
];

export default function HostDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Host Dashboard</h1>
            <p className="text-white/50 mt-1">Manage your rooms, guests, and earnings.</p>
          </div>
          <Link href="/living-rooms/host">
            <button className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors">
              Host New Room
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Rooms */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Active Rooms</h2>
            <button className="text-purple-400 text-sm hover:text-purple-300">View All</button>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10 text-sm text-white/50">
                  <tr>
                    <th className="p-4 font-medium">Room Title</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Slots Filled</th>
                    <th className="p-4 font-medium">Est. Revenue</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {ACTIVE_ROOMS.map((room) => (
                    <tr key={room.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-medium">{room.title}</td>
                      <td className="p-4 text-white/70">{room.date}</td>
                      <td className="p-4 text-white/70">{room.slots}</td>
                      <td className="p-4 text-green-400">{room.revenue}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                          {room.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs">
                            Manage
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-xs">
                            Guest List
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
