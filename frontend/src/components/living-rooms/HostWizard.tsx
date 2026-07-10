"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export default function HostWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 9;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[600px]">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-white/50 mb-2 px-1">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {step === 1 && <Step1HostInfo />}
            {step === 2 && <Step2RoomDetails />}
            {step === 3 && <Step3Location />}
            {step === 4 && <Step4Images />}
            {step === 5 && <Step5Guests />}
            {step === 6 && <Step6Pricing />}
            {step === 7 && <Step7DateTime />}
            {step === 8 && <Step8Rules />}
            {step === 9 && <Step9Publish />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        {step < totalSteps ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => alert("Publishing Room...")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-all"
          >
            Publish Room <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// --- Placeholder Step Components ---
// In a real app, these would be in separate files and use a shared form state context

const Step1HostInfo = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Host Information</h2>
    <p className="text-white/50">Verify your details before hosting.</p>
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1 text-white/70">Full Name</label>
        <input type="text" defaultValue="John Doe" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white" disabled />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-white/70">Age</label>
          <input type="text" defaultValue="25" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white" disabled />
        </div>
        <div>
          <label className="block text-sm mb-1 text-white/70">Gender</label>
          <input type="text" defaultValue="Male" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white" disabled />
        </div>
      </div>
    </div>
  </div>
);

const Step2RoomDetails = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Room Details</h2>
    <p className="text-white/50">What kind of room are you hosting?</p>
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1 text-white/70">Room Title</label>
        <input type="text" placeholder="e.g. Weekend House Party" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/70">Category</label>
        <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none">
          <option>House Party</option>
          <option>Birthday Party</option>
          <option>Gaming</option>
          <option>Movie Night</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/70">Description</label>
        <textarea rows={4} placeholder="Describe the vibe..." className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"></textarea>
      </div>
    </div>
  </div>
);

const Step3Location = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Location</h2>
    <p className="text-white/50">Where is the event taking place?</p>
    {/* Map placeholder */}
    <div className="w-full h-48 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30">
      Interactive Map Placeholder
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1 text-white/70">City</label>
        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/70">Area</label>
        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
    </div>
    <div>
      <label className="block text-sm mb-1 text-white/70">Complete Address (Kept private until booked)</label>
      <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
    </div>
  </div>
);

const Step4Images = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Upload Images</h2>
    <p className="text-white/50">Add a cover image and up to 10 photos of the venue.</p>
    <div className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
      <span className="text-white/50">Click to upload or drag & drop</span>
    </div>
  </div>
);

const Step5Guests = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Guest Details</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1 text-white/70">Max Guests</label>
        <input type="number" defaultValue={10} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/70">Gender Preference</label>
        <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none">
          <option>Mixed (Everyone)</option>
          <option>Male Only</option>
          <option>Female Only</option>
        </select>
      </div>
    </div>
  </div>
);

const Step6Pricing = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Pricing</h2>
    <p className="text-white/50">Set a fee per person and advance percentage.</p>
    <div className="space-y-4">
      <div>
        <label className="block text-sm mb-1 text-white/70">Charge Per Person (₹)</label>
        <input type="number" placeholder="e.g. 1000" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/70">Advance Payment (%)</label>
        <input type="number" defaultValue={25} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
    </div>
  </div>
);

const Step7DateTime = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Date & Time</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm mb-1 text-white/70">Date</label>
        <input type="date" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
      <div>
        <label className="block text-sm mb-1 text-white/70">Start Time</label>
        <input type="time" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none" />
      </div>
    </div>
  </div>
);

const Step8Rules = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Rules</h2>
    <p className="text-white/50">Select rules for your room.</p>
    <div className="space-y-2">
      {["No Smoking", "No Alcohol", "Bring ID", "No Pets", "Dress Code", "Respect Everyone"].map(rule => (
        <label key={rule} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
          <input type="checkbox" className="w-4 h-4 accent-purple-500" />
          <span className="text-white">{rule}</span>
        </label>
      ))}
    </div>
  </div>
);

const Step9Publish = () => (
  <div className="space-y-6 text-center py-8">
    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Ready to Publish!</h2>
    <p className="text-white/50">Your room is set up. You can preview it before making it live.</p>
    
    <div className="bg-black/50 border border-white/10 rounded-xl p-6 mt-8 max-w-sm mx-auto text-left space-y-4">
      <h3 className="font-semibold text-lg border-b border-white/10 pb-2">Summary</h3>
      <div className="flex justify-between text-sm">
        <span className="text-white/50">Title:</span>
        <span className="text-white font-medium">House Party</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/50">Price/Person:</span>
        <span className="text-green-400 font-medium">₹1000</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/50">Advance:</span>
        <span className="text-white font-medium">₹250 (25%)</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-white/50">Est. Earnings:</span>
        <span className="text-white font-medium">₹10,000</span>
      </div>
    </div>
  </div>
);
