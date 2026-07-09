"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, RefreshCw, LogOut, Smile, Sparkles, User, Image as ImageIcon,
  MessageSquare, HelpCircle, Gamepad2, AlertCircle, Shield
} from "lucide-react";

interface ChatRoomProps {
  onLeave: () => void;
}

const ADJECTIVES = ["Silly", "Sneaky", "Fluffy", "Golden", "Dancing", "Clever", "Cool", "Brave", "Sleepy", "Happy"];
const ANIMALS = ["Panda", "Koala", "Fox", "Tiger", "Penguin", "Otter", "Dolphin", "Rabbit", "Squirrel", "Lion"];

const ICE_BREAKERS = [
  "What's your secret superpower?",
  "Would you rather travel to the past or the future?",
  "What is the most adventurous thing you've ever done?",
  "What's your current favorite song?",
  "Describe yourself in only three words.",
];

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isSystem?: boolean;
}

export default function ChatRoom({ onLeave }: ChatRoomProps) {
  const [guestName, setGuestName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [isMatching, setIsMatching] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize guest name
  useEffect(() => {
    let name = localStorage.getItem("anonvibe_guest_name");
    if (!name) {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const anim = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      const num = Math.floor(1000 + Math.random() * 9000);
      name = `${adj} ${anim} #${num}`;
      localStorage.setItem("anonvibe_guest_name", name);
    }
    setGuestName(name);
    startMatching();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function startMatching() {
    setIsMatching(true);
    setPartnerName("");
    setMessages([]);
    
    // Simulate finding a match in 2.5s
    setTimeout(() => {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const anim = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      const num = Math.floor(1000 + Math.random() * 9000);
      const partner = `${adj} ${anim} #${num}`;
      
      setPartnerName(partner);
      setIsMatching(false);
      
      setMessages([
        {
          id: "system-1",
          sender: "System",
          text: `⚡ Connected with ${partner}! Keep it friendly and fun.`,
          timestamp: new Date(),
          isSystem: true
        }
      ]);

      // Simulate a welcoming message from the partner after 1.5 seconds
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: "msg-partner-init",
            sender: partner,
            text: "Hey! What's up? 👋",
            timestamp: new Date()
          }
        ]);
      }, 1500);

    }, 2500);
  }

  function handleSend(textToSend = inputText) {
    if (!textToSend.trim()) return;

    const newMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: guestName,
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMsg]);
    if (textToSend === inputText) setInputText("");

    // Simulate partner typing and replying
    simulatePartnerReply();
  }

  function simulatePartnerReply() {
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replies = [
          "That's so interesting! Tell me more.",
          "Haha nice! I agree with that.",
          "Wow, really? I didn't expect that!",
          "I'm just listening to some music right now, you?",
          "That sounds cool. What are your plans for the weekend?",
          "To be honest, same here lol.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        setMessages(prev => [
          ...prev,
          {
            id: `msg-partner-${Date.now()}`,
            sender: partnerName,
            text: randomReply,
            timestamp: new Date()
          }
        ]);
      }, 1500);
    }, 1000);
  }

  // Styles
  const chatContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)",
    width: "100%",
    maxWidth: 960,
    margin: "64px auto 0",
    background: "rgba(10,14,28,0.7)",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    zIndex: 1,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    background: "rgba(15,23,42,0.8)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(8px)",
  };

  const messagesAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  const inputAreaStyle: React.CSSProperties = {
    padding: "20px 24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15,23,42,0.9)",
  };

  return (
    <div style={chatContainerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: isMatching ? "#fb923c" : "#34d399",
            boxShadow: isMatching ? "0 0 10px #fb923c" : "0 0 10px #34d399"
          }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#f8fafc" }}>
              {isMatching ? "Finding a vibe..." : partnerName}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {isMatching ? "Connecting to global network" : "Connected anonymously"}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={startMatching} disabled={isMatching}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: isMatching ? "not-allowed" : "pointer", transition: "all 0.2s"
            }}>
            <RefreshCw size={14} className={isMatching ? "animate-spin" : ""} /> Next Match
          </button>
          <button onClick={onLeave}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
            }}>
            <LogOut size={14} /> Exit Chat
          </button>
        </div>
      </div>

      {/* Main Body */}
      {isMatching ? (
        // Matching screen
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ position: "relative", width: 100, height: 100 }}>
            {/* Spinning/glowing dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "3px solid transparent", borderTopColor: "#9333ea", borderBottomColor: "#22d3ee"
              }}
            />
            <div style={{
              position: "absolute", inset: 15, borderRadius: "50%", background: "rgba(147,51,234,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <MessageSquare size={32} color="#a855f7" />
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc", marginBottom: 6 }}>Searching for a match...</h3>
            <p style={{ fontSize: 14, color: "#64748b", maxWidth: 300 }}>Looking for someone with a good vibe</p>
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 13, color: "#475569"
          }}>
            <Shield size={14} color="#64748b" /> Your identity is: {guestName}
          </div>
        </div>
      ) : (
        // Active Chat screen
        <>
          <div style={messagesAreaStyle}>
            {messages.map((msg) => {
              if (msg.isSystem) {
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                    <div style={{
                      padding: "6px 16px", borderRadius: 100, background: "rgba(147,51,234,0.08)",
                      border: "1px solid rgba(147,51,234,0.15)", color: "#c084fc", fontSize: 13, display: "flex", alignItems: "center", gap: 6
                    }}>
                      <Sparkles size={12} /> {msg.text}
                    </div>
                  </div>
                );
              }

              const isMe = msg.sender === guestName;
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", width: "100%" }}>
                  <div style={{ maxWidth: "70%" }}>
                    {/* Header name */}
                    {!isMe && (
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, marginLeft: 8 }}>{msg.sender}</div>
                    )}
                    {/* Message Bubble */}
                    <div style={{
                      padding: "12px 18px", borderRadius: 18,
                      borderTopRightRadius: isMe ? 4 : 18, borderTopLeftRadius: isMe ? 18 : 4,
                      background: isMe ? "linear-gradient(135deg, #9333ea, #7c3aed)" : "rgba(255,255,255,0.05)",
                      border: isMe ? "none" : "1px solid rgba(255,255,255,0.08)",
                      color: "#f8fafc", fontSize: 14, lineHeight: 1.5, wordBreak: "break-word"
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
                <div style={{
                  padding: "12px 18px", borderRadius: 18, borderTopLeftRadius: 4,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", gap: 4, alignItems: "center"
                }}>
                  <div className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#64748b" }} />
                  <div className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#64748b" }} />
                  <div className="typing-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#64748b" }} />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Ice Breakers */}
          <div style={{ display: "flex", gap: 8, padding: "0 24px 12px", overflowX: "auto", background: "rgba(15,23,42,0.9)" }}>
            {ICE_BREAKERS.map((q) => (
              <button key={q} onClick={() => handleSend(q)}
                style={{
                  whiteSpace: "nowrap", padding: "8px 16px", borderRadius: 100,
                  background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.2)",
                  color: "#c084fc", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(147,51,234,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(147,51,234,0.08)")}>
                <HelpCircle size={12} /> {q}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div style={inputAreaStyle}>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: "flex", gap: 12, width: "100%" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text" placeholder="Type a friendly message..." value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    width: "100%", padding: "14px 20px", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                    color: "#f8fafc", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
              <button type="submit"
                style={{
                  width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg, #9333ea, #7c3aed)", border: "none", color: "white", cursor: "pointer"
                }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes blink {
          50% { opacity: 0.3; }
        }
        .typing-dot {
          animation: blink 1s infinite alternate;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
