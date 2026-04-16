# 🌐 StrangerWorld — Open Source Stranger Chat Platform

Connect with strangers worldwide. No login, no account, no limits. Text, video calls, and file sharing.

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)]()
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-blue.svg)]()
[![Redis](https://img.shields.io/badge/Redis-7.2-red.svg)]()

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Anonymous guest chat (no login) | ✅ |
| Real-time text messaging | ✅ |
| WebRTC P2P video/audio calls | ✅ |
| Photo, video, file sharing (25MB) | ✅ |
| Language preference matching | ✅ |
| Gender preference (Male / Female / Trans) | ✅ |
| Smart matching algorithm | ✅ |
| Content moderation (word filter + reporting) | ✅ |
| TURN server for NAT traversal | ✅ |
| Scalable Redis-backed queue | ✅ |
| PostgreSQL for analytics & moderation | ✅ |
| Docker Compose one-command deploy | ✅ |
| Open source (MIT) | ✅ |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                    │
│  React/Vanilla JS · Socket.IO client · WebRTC API       │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / WSS
┌───────────────────────▼─────────────────────────────────┐
│                    NGINX (Reverse Proxy)                 │
│          TLS termination · Static file serving          │
└──────┬───────────────────────────────┬──────────────────┘
       │ /api/*                        │ /socket.io/*
┌──────▼──────────┐            ┌───────▼────────────────┐
│  Express REST   │            │   Socket.IO Server     │
│  /api/stats     │            │   Real-time events:    │
│  /api/media     │            │   • guest:register     │
│  /api/health    │            │   • queue:join         │
└──────┬──────────┘            │   • chat:message       │
       │                       │   • webrtc:offer/ans   │
       │                       │   • media:share        │
       │                       │   • stranger:next      │
       │                       └───────┬────────────────┘
       │                               │
       └───────────────┬───────────────┘
                       │
         ┌─────────────▼─────────────────┐
         │         Redis 7.2             │
         │  • online:users (SET)         │
         │  • queue:waiting (SET)        │
         │  • room:{id} (HASH)           │
         │  • room:{id}:messages (LIST)  │
         │  • guest:{id} (HASH)          │
         │  • stats:* (counters)         │
         └─────────────┬─────────────────┘
                       │
         ┌─────────────▼─────────────────┐
         │       PostgreSQL 16           │
         │  • reports (moderation)       │
         │  • banned_ips                 │
         │  • daily_stats (analytics)    │
         │  • language_stats             │
         │  • blocked_words              │
         └───────────────────────────────┘

   WebRTC P2P (direct between browsers after signaling)
         ┌──────────────────────────────┐
         │       Coturn (TURN)          │
         │  ICE/STUN/TURN relay         │
         │  for NAT traversal           │
         └──────────────────────────────┘

   Large Files (>1MB)
         ┌──────────────────────────────┐
         │       AWS S3                 │
         │  Presigned URL upload        │
         │  Auto-expire after 24h       │
         └──────────────────────────────┘
```

---

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker + Docker Compose
- Node.js 20+ (for local dev)

### 1. Clone & configure
```bash
git clone https://github.com/yourname/strangerworld.git
cd strangerworld
cp .env.example .env
# Edit .env with your values
```

### 2. Start everything
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 3. Open the app
```
http://localhost
```

---

## ⚙️ Environment Variables

Create `.env` in project root:

```env
# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yoursite.com

# Redis
REDIS_URL=redis://redis:6379

# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=strangerworld
POSTGRES_USER=sw_user
POSTGRES_PASSWORD=your_secure_password

# AWS S3 (for large file sharing)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=strangerworld-media

# TURN Server
TURN_SECRET=your_turn_secret
TURN_REALM=yoursite.com
```

---

## 📡 Socket.IO Events Reference

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `guest:register` | `{gender, language, interests, mode}` | Register as guest |
| `queue:join` | — | Join matching queue |
| `chat:message` | `{text}` | Send text message |
| `chat:typing` | `{typing: bool}` | Typing indicator |
| `webrtc:offer` | `{sdp}` | WebRTC SDP offer |
| `webrtc:answer` | `{sdp}` | WebRTC SDP answer |
| `webrtc:ice-candidate` | `{candidate}` | ICE candidate |
| `media:share` | `{fileName, fileType, fileData, fileSize}` | Share file (<1MB inline, >1MB use S3) |
| `stranger:next` | — | Disconnect & find new match |
| `user:report` | `{reason}` | Report current stranger |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `guest:registered` | `{guestId}` | Registration confirmed |
| `online:count` | `number` | Live online user count |
| `queue:waiting` | `{position}` | Waiting in queue |
| `match:found` | `{roomId, partnerGender, partnerLanguage, partnerLocation}` | Match found |
| `chat:message` | `{id, from, text, timestamp}` | Incoming message |
| `chat:typing` | `{typing}` | Partner typing |
| `media:share` | `{from, fileName, fileType, fileData, fileSize}` | Incoming file |
| `stranger:disconnected` | — | Partner left |
| `error` | `{message}` | Error notification |

---

## 🔒 Security & Privacy

- **Zero PII stored** — no names, emails, IPs in main database
- **Session-scoped** — all guest data deleted on disconnect
- **Redis TTL** — all keys auto-expire (rooms: 24h, guests: 1h)
- **Content filter** — word-level filter + user reporting
- **Rate limiting** — per-IP limits on all REST endpoints
- **File validation** — type + size checks before transfer
- **Helmet.js** — security HTTP headers
- **TURN credentials** — time-limited, HMAC-signed

---

## 🌍 Scaling

For high traffic, scale horizontally:

```bash
# Multiple backend instances with Redis adapter
npm install @socket.io/redis-adapter

# In server.js
import { createAdapter } from '@socket.io/redis-adapter';
io.adapter(createAdapter(pubClient, subClient));
```

Then load-balance with Nginx sticky sessions (`ip_hash`).

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © StrangerWorld Contributors
