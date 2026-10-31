# CineMesh 🎬⚡
> **High-Fidelity 1080p Screen & 6GB Movie P2P Streaming Engine with Lossless Opus Stereo Audio (₹0 Budget)**

CineMesh is a decentralized watch-party and screen-sharing web application built for seamless peer-to-peer streaming with friends. It delivers direct 1080p60 video and uncompressed, unfiltered stereo audio with zero cloud egress fees.

---

## 🌟 Key Features

- **P2P WebRTC Star/Mesh Architecture**: Media streams directly from host to viewers. Zero cloud storage or bandwidth bills.
- **6GB+ Local Movie Streaming**: In-browser local file mounting via `URL.createObjectURL()` and `captureStream()`. Plays large files straight from your hard drive with zero upload wait time.
- **Hi-Fi Stereo Sound (Opus 256kbps)**: All speech suppression, acoustic echo cancellation (AEC), and auto gain control (AGC) are turned off in SDP negotiations so background scores and bass come through crisp.
- **Cross-Platform**: Broadcaster streams from desktop/laptop; friends can join and watch on any device (**iPhone Safari, Android Chrome, Mac, Windows, Smart TV**).
- **Dark-Mode Cinema UI**: Reusable React components styled with Tailwind CSS, custom theater mode, volume booster, and live room chat.
- **Test-Driven Development (TDD)**: Comprehensive automated test suites across both backend and frontend.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Vitest, React Testing Library
- **Signaling Backend**: Node.js, Express, Socket.IO, Jest, Supertest
- **Protocols & Media APIs**: WebRTC (`RTCPeerConnection`), SDP Munging, HTML5 Media Capture API (`getDisplayMedia`, `captureStream`)
- **NAT Traversal**: Google Public STUN (`stun:stun.l.google.com:19302`)

---

## 🚀 Local Development Quickstart

### Prerequisites
- Node.js >= 18
- npm >= 9

### 1. Clone & Install
```bash
git clone https://github.com/your-username/cinemesh.git
cd cinemesh

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Start the Signaling Server
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start the Frontend Client
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

---

## 🧪 Running the Automated Test Suites

```bash
# Run server tests (Jest)
cd server
npm test

# Run frontend tests (Vitest)
cd client
npm test
```

---

## 🚢 Zero-Cost Deployment Guide

### Deploy Signaling Server (Render.com - 100% Free)
1. Sign in to [Render.com](https://render.com).
2. Click **New +** $\to$ **Web Service** and connect your GitHub repo.
3. Settings:
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. Copy your backend URL (e.g. `https://cinemesh-server.onrender.com`).

### Deploy Frontend (Vercel - 100% Free)
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
4. Add Environment Variable:
   - `VITE_SIGNALING_SERVER_URL` = `https://cinemesh-server.onrender.com`
5. Click **Deploy**. Your site is now live worldwide at `https://cinemesh.vercel.app`!
