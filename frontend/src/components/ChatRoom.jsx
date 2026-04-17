import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Image as ImageIcon, Loader2, Mic, MicOff, Video as VideoIcon, VideoOff, Flag, RefreshCw, Smile, Sticker } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ChatRoom({ socket, partner, mode, onNext }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [gifSearch, setGifSearch] = useState('');

  const scrollRef = useRef();
  const fileInputRef = useRef();
  
  // WebRTC refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    socket.on('chat:message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('chat:typing', ({ typing }) => {
      setIsTyping(typing);
    });

    return () => {
      socket.off('chat:message');
      socket.off('chat:typing');
    };
  }, [socket]);

  useEffect(() => {
    if (mode === 'video') {
      initializeWebRTC();
    }
    return () => {
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [mode]);

  const fetchGifs = async (query = '') => {
    try {
      const apiKey = 'dc6zaTOxFJmzC';
      const endpoint = query 
        ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=30`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=30`;
      const response = await axios.get(endpoint);
      setGifs(response.data.data);
    } catch (err) {
      console.error('Failed to fetch GIFs:', err);
    }
  };

  useEffect(() => {
    if (showGifPicker && gifs.length === 0) {
      fetchGifs();
    }
  }, [showGifPicker]);

  const sendGif = (gifUrl) => {
    socket.emit('chat:message', {
      text: 'Sent a GIF',
      fileUrl: gifUrl,
      fileType: 'image/gif'
    });
    setShowGifPicker(false);
  };

  const onEmojiClick = (emojiObject) => {
    setInputText(prev => prev + emojiObject.emoji);
  };

  useEffect(() => {
    if (mode === 'video') {
      const getDevices = async () => {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); // trigger permissions 
          const devices = await navigator.mediaDevices.enumerateDevices();
          setVideoDevices(devices.filter(d => d.kind === 'videoinput'));
          setAudioDevices(devices.filter(d => d.kind === 'audioinput'));
        } catch (e) {
          console.error('Device enumeration error', e);
        }
      };
      getDevices();
    }
  }, [mode]);

  const setupMediaStream = async () => {
    const constraints = {
      video: {
        deviceId: selectedVideo ? { exact: selectedVideo } : undefined,
        facingMode: isFlipped ? 'environment' : 'user'
      },
      audio: {
        deviceId: selectedAudio ? { exact: selectedAudio } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (peerConnection.current) {
        const senders = peerConnection.current.getSenders();
        stream.getTracks().forEach(track => {
          const sender = senders.find(s => s.track && s.track.kind === track.kind);
          if (sender) sender.replaceTrack(track);
          else peerConnection.current.addTrack(track, stream);
        });
      }
      
      if (localStream.current) {
        localStream.current.getTracks().forEach(t => t.stop());
      }
      
      localStream.current = stream;
      
      const vTrack = stream.getVideoTracks()[0];
      const aTrack = stream.getAudioTracks()[0];
      if (vTrack) vTrack.enabled = cameraActive;
      if (aTrack) aTrack.enabled = micActive;

    } catch (err) {
      console.error('Failed to setup media stream', err);
    }
  };

  useEffect(() => {
    if (localStream.current && peerConnection.current) {
       setupMediaStream();
    }
  }, [selectedVideo, selectedAudio, isFlipped]);

  // Buffer for ICE candidates that arrive before remoteDescription is set
  const iceCandidateBuffer = useRef([]);

  const initializeWebRTC = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/webrtc/ice-servers`);
      const iceServers = response.data.iceServers || [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ];

      const pc = new RTCPeerConnection({ iceServers });
      peerConnection.current = pc;

      // ── ICE candidate handler ──
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc:ice-candidate', { candidate: event.candidate });
        }
      };

      // ── Remote stream received ──
      pc.ontrack = (event) => {
        console.log('[WebRTC] ontrack fired', event.streams);
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // ── Connection state logging ──
      pc.onconnectionstatechange = () => {
        console.log('[WebRTC] Connection state:', pc.connectionState);
      };
      pc.oniceconnectionstatechange = () => {
        console.log('[WebRTC] ICE state:', pc.iceConnectionState);
      };

      // ── Register signaling listeners NOW (pc is ready) ──
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice-candidate');

      socket.on('webrtc:offer', async ({ sdp }) => {
        try {
          console.log('[WebRTC] Received offer');
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
          // Flush buffered ICE candidates
          for (const c of iceCandidateBuffer.current) {
            await pc.addIceCandidate(new RTCIceCandidate(c)).catch(console.error);
          }
          iceCandidateBuffer.current = [];
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc:answer', { sdp: answer.sdp });
          console.log('[WebRTC] Answer sent');
        } catch (err) {
          console.error('[WebRTC] Offer handling error:', err);
        }
      });

      socket.on('webrtc:answer', async ({ sdp }) => {
        try {
          console.log('[WebRTC] Received answer');
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
          // Flush buffered ICE candidates
          for (const c of iceCandidateBuffer.current) {
            await pc.addIceCandidate(new RTCIceCandidate(c)).catch(console.error);
          }
          iceCandidateBuffer.current = [];
        } catch (err) {
          console.error('[WebRTC] Answer handling error:', err);
        }
      });

      socket.on('webrtc:ice-candidate', async ({ candidate }) => {
        try {
          if (pc.remoteDescription) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } else {
            // Buffer until remote description is set
            console.log('[WebRTC] Buffering ICE candidate');
            iceCandidateBuffer.current.push(candidate);
          }
        } catch (err) {
          console.error('[WebRTC] ICE candidate error:', err);
        }
      });

      // ── Add local media tracks to peer connection ──
      await setupMediaStream();

      // ── Polite peer: only the peer with the smaller socket ID sends the offer ──
      // This prevents both peers from sending offers simultaneously (glare)
      const isOfferer = socket.id < partner.partnerSocketId;
      console.log(`[WebRTC] I am the ${isOfferer ? 'offerer' : 'answerer'}. My ID: ${socket.id}, Partner: ${partner.partnerSocketId}`);

      if (isOfferer) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('webrtc:offer', { sdp: offer.sdp });
        console.log('[WebRTC] Offer sent');
      }

    } catch (err) {
      console.error('[WebRTC] Init failed:', err);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'System: Failed to access camera/microphone.',
        from: 'system',
        timestamp: Date.now()
      }]);
    }
  };

  const toggleMic = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicActive(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraActive(videoTrack.enabled);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    socket.emit('chat:message', { text: inputText });
    setInputText('');
    socket.emit('chat:typing', { typing: false });
  };

  const handleTyping = (e) => {
    setInputText(e.target.value);
    socket.emit('chat:typing', { typing: e.target.value.length > 0 });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/api/media/presigned-url`, {
        fileName: file.name,
        fileType: file.type
      });

      const { url, key } = res.data;

      if (url.includes('placeholder')) {
         // Fallback if AWS is not configured
         socket.emit('chat:message', { 
           text: `Shared a file: ${file.name} (AWS S3 not configured, real upload skipped)`,
           fileUrl: null,
           fileType: file.type
         });
      } else {
         // Upload to real S3 pre-signed URL
         await axios.put(url, file, {
           headers: {
             'Content-Type': file.type
           }
         });
         
         const fileUrl = url.split('?')[0]; // Extracted S3 object URL
         socket.emit('chat:message', { 
           text: `Shared a file: ${file.name}`,
           fileUrl: fileUrl,
           fileType: file.type
         });
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`chat-container glass-panel animate-fade-in${mode === 'video' ? ' video-mode' : ''}`} style={{ flex: 1, minHeight: 0 }}>
      <div className="chat-sidebar">
        <div className="partner-info">
          <h3>Partner Info</h3>
          <p>Gender: {partner?.partnerGender}</p>
          {partner?.partnerPreference && (
            <p>Topic: <span className="pref-badge">{partner.partnerPreference}</span></p>
          )}
          <p>Location: {partner?.partnerLocation}</p>
        </div>

        {mode === 'video' && (
          <div className="video-section">
            <div className="video-container local">
              <video ref={localVideoRef} autoPlay playsInline muted />
              
              <div className="local-video-settings">
                <div className="inner-video-settings">
                  {videoDevices.length > 1 && (
                    <button className="flip-btn" onClick={() => setIsFlipped(!isFlipped)}>
                      <RefreshCw size={14} style={{ marginRight: '4px' }} /> Flip Camera
                    </button>
                  )}
                  <select value={selectedVideo} onChange={e => setSelectedVideo(e.target.value)}>
                    <option value="">Default Camera</option>
                    {videoDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.substring(0,5)}`}</option>)}
                  </select>
                  <select value={selectedAudio} onChange={e => setSelectedAudio(e.target.value)}>
                    <option value="">Default Microphone</option>
                    {audioDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.substring(0,5)}`}</option>)}
                  </select>
                </div>
              </div>

              <div className="video-controls">
                <button onClick={toggleMic} className={`control-btn ${!micActive ? 'disabled' : ''}`}>
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button onClick={toggleCamera} className={`control-btn ${!cameraActive ? 'disabled' : ''}`}>
                  {cameraActive ? <VideoIcon size={16} /> : <VideoOff size={16} />}
                </button>
              </div>
            </div>
            <div className="video-container remote">
              <span className="watermark">AnonVibe</span>
              <button className="report-btn" onClick={() => socket.emit('user:report')} title="Report User">
                <Flag size={20} />
              </button>
              <video ref={remoteVideoRef} autoPlay playsInline />
            </div>
          </div>
        )}

        <button onClick={onNext} className="glass-button next-btn">
          Next Stranger ⏭️
        </button>
      </div>

      <div className="chat-main">
        <div className="messages-list">
          <div className="system-msg">Connected! Say hello to the stranger.</div>
          {messages.map((msg, idx) => (
            <div key={msg.id || idx} className={`message ${msg.from === socket.id ? 'own' : msg.from === 'system' ? 'system' : ''}`}>
              <div className="msg-bubble">
                {msg.text}
                {msg.fileUrl && (
                  <div className="file-attachment">
                    {msg.fileType?.startsWith('image/') ? (
                      <img src={msg.fileUrl} alt="attachment" className="chat-img" />
                    ) : (
                      <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="file-link">Download File</a>
                    )}
                  </div>
                )}
              </div>
              <div className="msg-time">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          ))}
          {isTyping && <div className="typing-indicator">Stranger is typing...</div>}
          <div ref={scrollRef} />
        </div>

        {showGifPicker && (
          <div className="picker-overlay gif-picker glass-panel">
             <div className="picker-header">
                <input 
                  type="text" 
                  placeholder="Search GIFs..." 
                  value={gifSearch}
                  onChange={(e) => {
                    setGifSearch(e.target.value);
                    fetchGifs(e.target.value);
                  }}
                  autoFocus
                />
                <button onClick={() => setShowGifPicker(false)}>×</button>
             </div>
             <div className="gif-grid">
               {gifs.map(g => (
                 <img 
                   key={g.id} 
                   src={g.images.fixed_height_small.url} 
                   alt={g.title} 
                   onClick={() => sendGif(g.images.original.url)} 
                 />
               ))}
             </div>
          </div>
        )}

        {showEmojiPicker && (
          <div className="picker-overlay emoji-picker">
            <EmojiPicker 
              onEmojiClick={onEmojiClick} 
              theme={document.body.className === 'light' ? 'light' : 'dark'} 
              lazyLoadEmojis={true}
            />
          </div>
        )}

        <form className="chat-input" onSubmit={sendMessage}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            style={{ display: 'none' }} 
            accept="image/*, .pdf, .doc"
          />
          <button 
            type="button" 
            className="icon-btn" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="spin" size={20} /> : <ImageIcon size={20} />}
          </button>
          
          <button 
            type="button" 
            className={`icon-btn ${showGifPicker ? 'active' : ''}`}
            onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }}
            title="Send GIF"
          >
            <Sticker size={20} />
          </button>

          <button 
            type="button" 
            className={`icon-btn ${showEmojiPicker ? 'active' : ''}`}
            onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }}
            title="Insert Emoji"
          >
            <Smile size={20} />
          </button>

          <input 
            value={inputText}
            onChange={handleTyping}
            placeholder="Type a message..."
            autoFocus
          />
          <button type="submit" className="glass-button send-btn">
            <Send size={18} />
          </button>
        </form>
      </div>

      <style>{`
        /* ===== BASE CHAT LAYOUT ===== */
        .chat-container {
          display: grid;
          grid-template-columns: 280px 1fr;
          height: 100%;
          overflow: hidden;
        }
        .chat-sidebar {
          padding: 1.5rem;
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          overflow-y: auto;
        }
        .partner-info h3 { margin-bottom: 0.75rem; color: var(--accent-primary); font-size: 1rem; }
        .partner-info p { margin-bottom: 0.4rem; font-size: 0.85rem; color: var(--text-muted); }
        .pref-badge {
          display: inline-block;
          background: var(--accent-primary);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 99px;
          margin-left: 4px;
          letter-spacing: 0.3px;
        }
        
        /* ===== VIDEO SECTION ===== */
        .video-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
          min-height: 0;
        }
        .video-container {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(0,0,0,0.5);
          aspect-ratio: 4/3;
        }
        .local-video-settings {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 10;
        }
        .video-container.local:hover .local-video-settings {
          opacity: 1;
        }
        .inner-video-settings {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 85%;
        }
        .inner-video-settings select {
          padding: 6px 8px;
          background: rgba(255,255,255,0.9);
          border: none;
          color: #000;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        body.dark .inner-video-settings select {
          background: rgba(30,30,30,0.95);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .flip-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.9);
          color: #000;
          border: none;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.8rem;
        }
        body.dark .flip-btn {
          background: rgba(30,30,30,0.95);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .watermark {
          position: absolute;
          bottom: 8px;
          left: 8px;
          font-weight: 800;
          font-size: 1.2rem;
          color: rgba(255,255,255,0.4);
          z-index: 5;
          pointer-events: none;
        }
        .report-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0,0,0,0.3);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          transition: all 0.2s ease;
        }
        .report-btn:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
        }
        .video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .video-controls {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          background: rgba(0,0,0,0.4);
          padding: 4px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          border-radius: 50%;
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s;
        }
        .control-btn:hover { background: rgba(255,255,255,0.2); }
        .control-btn.disabled { color: #ef4444; }

        /* ===== NEXT BTN ===== */
        .next-btn { 
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); 
          margin-top: auto;
          flex-shrink: 0;
        }

        /* ===== CHAT MAIN PANEL ===== */
        .chat-main {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          position: relative;
        }
        .messages-list {
          flex: 1;
          padding: 1.5rem 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-height: 0;
        }
        .system-msg { text-align: center; color: var(--text-muted); font-size: 0.8rem; margin: 0.75rem 0; font-style: italic; }
        
        .message { max-width: 70%; align-self: flex-start; }
        .message.own { align-self: flex-end; }
        .message.system { align-self: center; background: none; }
        
        .msg-bubble {
          padding: 0.85rem 1.1rem;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          background: rgba(255, 255, 255, 0.05);
          font-size: 0.9rem; line-height: 1.5;
          word-break: break-word;
        }
        .message.own .msg-bubble {
          background: var(--accent-primary);
          border-bottom-left-radius: 18px;
          border-bottom-right-radius: 4px;
        }
        .message.system .msg-bubble {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5; border-radius: 8px; font-size: 0.85rem; padding: 0.5rem 1rem;
        }
        .msg-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; padding: 0 4px; }
        .message.own .msg-time { text-align: right; }
        .file-attachment { margin-top: 0.5rem; }
        .chat-img { max-width: 100%; border-radius: 8px; margin-top: 0.5rem; }
        .file-link { color: #93c5fd; text-decoration: underline; font-size: 0.9rem; }
        .typing-indicator { font-size: 0.8rem; color: var(--accent-primary); font-style: italic; }

        /* ===== CHAT INPUT ===== */
        .chat-input {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .chat-input input {
          flex: 1;
          min-width: 0;
        }
        .icon-btn {
          flex-shrink: 0;
          background: none; border: none; color: var(--text-muted);
          cursor: pointer; transition: 0.3s;
          display: flex; align-items: center; justify-content: center;
          padding: 4px;
        }
        .icon-btn:hover { color: var(--accent-primary); }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .send-btn {
          flex-shrink: 0;
          padding: 0;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          width: 42px; height: 42px;
        }

        /* ===== TABLET (≤900px) ===== */
        @media (max-width: 900px) {
          .chat-container {
            grid-template-columns: 220px 1fr;
          }
          .chat-sidebar {
            padding: 1rem;
            gap: 1rem;
          }
          .messages-list {
            padding: 1rem 1.25rem;
          }
          .chat-input {
            padding: 0.75rem 1rem;
          }
          .message { max-width: 80%; }
        }

        /* ===================================================
           MOBILE (≤600px) — Omegle-style full layout
           =================================================== */
        @media (max-width: 600px) {

          /* ── TEXT MODE: slim top bar + full chat ── */
          .chat-container:not(.video-mode) {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            overflow: hidden;
          }
          .chat-container:not(.video-mode) .chat-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
            padding: 0.5rem 0.75rem;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            gap: 0.5rem;
            overflow: visible;
            flex-shrink: 0;
          }
          .chat-container:not(.video-mode) .partner-info {
            display: flex;
            gap: 0.5rem;
            flex-wrap: nowrap;
            flex: 1;
            overflow: hidden;
            align-items: center;
          }
          .chat-container:not(.video-mode) .partner-info h3 { display: none; }
          .chat-container:not(.video-mode) .partner-info p {
            margin-bottom: 0;
            font-size: 0.72rem;
            white-space: nowrap;
          }
          .chat-container:not(.video-mode) .next-btn {
            margin-top: 0;
            padding: 0.4rem 0.75rem;
            font-size: 0.78rem;
            flex-shrink: 0;
            white-space: nowrap;
          }

          /* ── VIDEO MODE: Omegle layout ── */
          .chat-container.video-mode {
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          /* Sidebar becomes a grid:
             Row 1: video section (full width)
             Row 2: partner info | next button */
          .chat-container.video-mode .chat-sidebar {
            display: grid;
            grid-template-areas:
              "video video"
              "info  btn";
            grid-template-rows: auto auto;
            grid-template-columns: 1fr auto;
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
            padding: 0;
            gap: 0;
            overflow: visible;
            flex-shrink: 0;
          }

          /* Partner info → info cell */
          .chat-container.video-mode .partner-info {
            grid-area: info;
            display: flex;
            flex-direction: row;
            gap: 0.4rem;
            align-items: center;
            padding: 0.4rem 0.6rem;
            overflow: hidden;
          }
          .chat-container.video-mode .partner-info h3 { display: none; }
          .chat-container.video-mode .partner-info p {
            margin-bottom: 0;
            font-size: 0.7rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--text-muted);
          }

          /* Next button → btn cell */
          .chat-container.video-mode .next-btn {
            grid-area: btn;
            margin-top: 0;
            align-self: center;
            padding: 0.4rem 0.7rem;
            font-size: 0.75rem;
            white-space: nowrap;
            margin-right: 0.5rem;
          }

          /* Video section → video row (spans both columns) */
          .chat-container.video-mode .video-section {
            grid-area: video;
            display: flex !important;
            position: relative;
            width: 100%;
            height: 48vw;
            max-height: 52vh;
            min-height: 160px;
            background: #000;
            flex-shrink: 0;
          }

          /* Remote video = full background of video-section */
          .chat-container.video-mode .video-container.remote {
            position: absolute;
            inset: 0;
            width: 100% !important;
            height: 100% !important;
            aspect-ratio: unset;
            border-radius: 0;
            z-index: 1;
          }

          /* Local video = small PIP in top-right corner */
          .chat-container.video-mode .video-container.local {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 90px;
            height: 120px;
            aspect-ratio: unset;
            border-radius: 10px;
            border: 2px solid rgba(255, 255, 255, 0.4);
            z-index: 20;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
            overflow: hidden;
            background: #111;
          }
          .chat-container.video-mode .video-container.local video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .chat-container.video-mode .video-container.remote video {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          /* Hide local video settings overlay on mobile (too small) */
          .chat-container.video-mode .local-video-settings {
            display: none;
          }

          /* Mic/cam controls stay at bottom of remote video */
          .chat-container.video-mode .video-controls {
            z-index: 10;
            bottom: 8px;
          }

          /* Report button on remote video */
          .chat-container.video-mode .report-btn {
            z-index: 10;
            top: 8px;
            right: 8px;
          }

          /* Watermark */
          .chat-container.video-mode .watermark {
            font-size: 0.85rem;
            z-index: 5;
          }

          /* ── CHAT AREA: fills remaining height ── */
          .chat-container.video-mode .chat-main {
            flex: 1;
            min-height: 0;
          }
          .messages-list {
            padding: 0.6rem 0.75rem;
            gap: 0.4rem;
          }
          .message { max-width: 88%; }
          .msg-bubble { padding: 0.6rem 0.8rem; font-size: 0.85rem; }
          .chat-input {
            padding: 0.5rem 0.65rem;
            gap: 0.4rem;
          }
          .icon-btn svg { width: 17px; height: 17px; }
          .send-btn { width: 36px; height: 36px; }
        }
      `}</style>
    </div>
  );
}

export default ChatRoom;

