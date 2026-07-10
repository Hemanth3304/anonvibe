"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Users, IndianRupee, CreditCard, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  pricePerPerson: number;
}

export default function BookingModal({ isOpen, onClose, roomName, pricePerPerson }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(1);
  const advancePercentage = 25;

  const totalAmount = pricePerPerson * guests;
  const advanceAmount = (totalAmount * advancePercentage) / 100;
  const remainingAmount = totalAmount - advanceAmount;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
              <h2 className="text-xl font-bold text-white">Book Slot</h2>
              <p className="text-white/50 text-sm mt-1">{roomName}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-3">Number of Guests</label>
                  <div className="flex items-center gap-4 bg-black/50 p-2 rounded-xl border border-white/10 w-fit">
                    <button 
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xl font-bold text-white">{guests}</span>
                    <button 
                      onClick={() => setGuests(guests + 1)}
                      className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Price per person</span>
                    <span className="text-white">₹{pricePerPerson}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Total Guests</span>
                    <span className="text-white">x {guests}</span>
                  </div>
                  <div className="border-t border-purple-500/20 pt-3 flex justify-between items-center font-bold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-white">₹{totalAmount}</span>
                  </div>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-medium text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" /> Payment Breakdown
                  </h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Advance to pay now ({advancePercentage}%)</span>
                    <span className="text-green-400 font-bold">₹{advanceAmount}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/70">Pay remaining to host later</span>
                    <span className="text-white font-medium">₹{remainingAmount}</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4">Guest Details</h3>
                {Array.from({ length: guests }).map((_, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4">
                    <h4 className="text-sm font-medium text-purple-400">Guest {i + 1} {i === 0 ? "(You)" : ""}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-500" />
                      <input type="number" placeholder="Age" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-500" />
                      <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-500">
                        <option value="">Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <input type="tel" placeholder="Phone Number" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-purple-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Booking Confirmed!</h3>
                <p className="text-white/50 text-sm max-w-sm mx-auto">
                  Your advance payment of ₹{advanceAmount} was successful. We've sent the ticket and exact location to your email.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 inline-block mt-4">
                  <p className="text-xs text-white/50 mb-1">Booking ID</p>
                  <p className="text-lg font-mono text-purple-400">LR-8472-X9M</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/50">
            {step === 1 && (
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors flex justify-center items-center gap-2"
              >
                Proceed to Details <ArrowRight className="w-5 h-5" />
              </button>
            )}
            {step === 2 && (
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors flex justify-center items-center gap-2"
                >
                  Pay ₹{advanceAmount} <CreditCard className="w-5 h-5" />
                </button>
              </div>
            )}
            {step === 3 && (
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
              >
                View Ticket in Dashboard
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
