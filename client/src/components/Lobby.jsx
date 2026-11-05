import React, { useState, useEffect } from 'react';
import { Play, Tv, Sparkles, ShieldCheck, Dice5, Radio, Film, Activity, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { generateRandomGuestName } from '../services/guestNames';

/**
 * @file Lobby.jsx
 * @description Cinema Lounge Arrival Stage.
 * Art direction: Midnight screening theater with warm amber projector lighting,
 * tactile mode switch, and instant zero-click guest entry for invited friends.
 */
export function Lobby({ onJoinRoom, initialRoomId = '' }) {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState(initialRoomId);
  const [isHost, setIsHost] = useState(!initialRoomId);

  useEffect(() => {
    if (initialRoomId) {
      setRoomId(initialRoomId);
      setIsHost(false);
      setUserName(generateRandomGuestName());
    }
  }, [initialRoomId]);

  const handleRerollName = () => {
    setUserName(generateRandomGuestName());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    const finalRoomId = roomId.trim() || `mesh-${Math.random().toString(36).substring(2, 8)}`;
    onJoinRoom({
      roomId: finalRoomId,
      userName: userName.trim(),
      isHost,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cinema-950 projector-stage-glow text-neutral-100 relative selection:bg-amber-400 selection:text-cinema-950 overflow-hidden">
      {/* Top Technical Telemetry Strip */}
      <header className="w-full border-b border-neutral-800/80 bg-cinema-950/70 backdrop-blur-md px-6 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold tracking-tight text-white text-base">CineMesh</span>
            <span className="font-mono text-[10px] text-amber-400/80 uppercase">v1.2 // P2P Engine</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Badge variant="cyan" icon={Activity}>Direct WebRTC Mesh</Badge>
          <Badge variant="hifi" icon={Sparkles}>Opus 256kbps Stereo</Badge>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-lg bg-cinema-900/90 border border-neutral-800/90 rounded-3xl p-6 sm:p-9 shadow-player-stage backdrop-blur-2xl relative">
          
          {/* Subtle Ambient Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-800/70 border border-neutral-700/60 text-[11px] font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>₹0 Bandwidth &bull; Zero Cloud Egress</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Cinema-Grade Streaming
            </h1>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Watch 1080p movies and screen shares with friends with uncompressed, cinema-fidelity stereo sound.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tactile Role Switcher */}
            <div className="p-1 bg-cinema-950 rounded-2xl border border-neutral-800/90 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setIsHost(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  isHost
                    ? 'bg-cinema-850 text-white shadow-sm border border-neutral-700/80 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isHost ? 'text-amber-400' : 'text-neutral-500'}`} />
                Host a Lounge
              </button>
              <button
                type="button"
                onClick={() => setIsHost(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isHost
                    ? 'bg-cinema-850 text-white shadow-sm border border-neutral-700/80 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Tv className={`w-3.5 h-3.5 ${!isHost ? 'text-amber-400' : 'text-neutral-500'}`} />
                Join with Code
              </button>
            </div>

            {/* Display Name Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-neutral-300">Your Alias</label>
                {initialRoomId && (
                  <button
                    type="button"
                    onClick={handleRerollName}
                    className="text-amber-400/90 hover:text-amber-300 font-mono text-[11px] flex items-center gap-1 transition"
                  >
                    <Dice5 className="w-3 h-3" /> Re-roll Guest Name
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-4 py-3 bg-cinema-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-medium"
              />
            </div>

            {/* Room Code Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-neutral-300">
                  {isHost ? 'Lounge Code (Optional)' : 'Lounge Code'}
                </label>
                {isHost && (
                  <span className="font-mono text-[10px] text-neutral-500">Auto-generates if empty</span>
                )}
              </div>
              <input
                type="text"
                required={!isHost}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder={isHost ? 'e.g. dune-night' : 'Enter 6-char code'}
                className="w-full px-4 py-3 bg-cinema-950 border border-neutral-800 rounded-xl text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
              />
            </div>

            {/* Action CTA */}
            <Button
              type="submit"
              variant={isHost ? 'primary' : 'hifi'}
              size="lg"
              icon={Play}
              className="w-full text-base font-bold shadow-lg mt-3"
            >
              {isHost ? 'Launch Cinema Lounge' : 'Join Lounge'}
            </Button>
          </form>

          {/* Security & P2P Footnote */}
          <div className="mt-8 pt-4 border-t border-neutral-800/80 flex items-center justify-center gap-2 text-xs font-mono text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted DTLS / SRTP Audio & Video</span>
          </div>
        </div>
      </main>

      {/* Footer System Specs */}
      <footer className="w-full px-6 py-4 border-t border-neutral-800/60 bg-cinema-950/80 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-3 z-10">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400 font-medium">Modes:</span>
          <span>1080p60 Screen Share</span>
          <span>&bull;</span>
          <span>6GB Local Movie Direct Stream</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
          <span>Engine: WebRTC Mesh + Google STUN</span>
        </div>
      </footer>
    </div>
  );
}
