import React, { useState, useEffect } from 'react';
import { Play, Tv, Sparkles, Dice5, Radio, Film, Activity, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { generateRandomGuestName } from '../services/guestNames';

/**
 * @file Lobby.jsx
 * @description Cinema Lounge Arrival Stage branded with official CineMesh logo and palette.
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
    <div className="min-h-screen flex flex-col justify-between bg-brand-canvas brand-stage-glow text-neutral-100 relative selection:bg-brand-purple selection:text-brand-cyan overflow-hidden">
      {/* Top Technical Telemetry Strip */}
      <header className="w-full border-b border-brand-border/80 bg-brand-canvas/70 backdrop-blur-md px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {/* Official CineMesh Logo */}
          <img
            src="/cinemesh-logo.png"
            alt="CineMesh Logo"
            className="h-7 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(109,24,242,0.35)]"
          />
          <span className="hidden sm:inline font-mono text-[10px] text-brand-cyan/80 uppercase tracking-widest pl-2 border-l border-brand-border">
            P2P Cinema Engine
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Badge variant="cyan" icon={Activity}>Direct WebRTC Mesh</Badge>
          <Badge variant="purple" icon={Sparkles}>Opus 256kbps Stereo</Badge>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-lg bg-brand-card/90 border border-brand-border rounded-3xl p-6 sm:p-9 shadow-player-stage backdrop-blur-2xl relative">
          
          {/* Logo Showcase inside Card */}
          <div className="text-center mb-6">
            <div className="inline-block p-2 rounded-2xl bg-brand-canvas/80 border border-brand-border mb-3 shadow-inner">
              <img
                src="/cinemesh-logo.png"
                alt="CineMesh"
                className="h-10 sm:h-12 w-auto mx-auto object-contain drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              />
            </div>
            <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              Watch 1080p movies and screen shares with friends with uncompressed, cinema-fidelity stereo sound.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tactile Role Switcher */}
            <div className="p-1 bg-brand-canvas rounded-2xl border border-brand-border grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setIsHost(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  isHost
                    ? 'bg-brand-purple text-white shadow-brand-glow font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isHost ? 'text-brand-cyan' : 'text-neutral-500'}`} />
                Host a Lounge
              </button>
              <button
                type="button"
                onClick={() => setIsHost(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
                  !isHost
                    ? 'bg-brand-purple text-white shadow-brand-glow font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Tv className={`w-3.5 h-3.5 ${!isHost ? 'text-brand-cyan' : 'text-neutral-500'}`} />
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
                    className="text-brand-cyan hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 transition"
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
                className="w-full px-4 py-3 bg-brand-canvas border border-brand-border rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all font-medium"
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
                className="w-full px-4 py-3 bg-brand-canvas border border-brand-border rounded-xl text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all"
              />
            </div>

            {/* Action CTA */}
            <Button
              type="submit"
              variant={isHost ? 'primary' : 'cyan'}
              size="lg"
              icon={Play}
              className="w-full text-base font-bold shadow-lg mt-3"
            >
              {isHost ? 'Launch Cinema Lounge' : 'Join Lounge'}
            </Button>
          </form>

          {/* Security & P2P Footnote */}
          <div className="mt-8 pt-4 border-t border-brand-border flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
            <Lock className="w-3.5 h-3.5 text-brand-cyan" />
            <span>End-to-End Encrypted DTLS / SRTP Audio & Video</span>
          </div>
        </div>
      </main>

      {/* Footer System Specs */}
      <footer className="w-full px-6 py-4 border-t border-brand-border bg-brand-canvas/80 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-neutral-500 gap-3 z-10">
        <div className="flex items-center gap-4">
          <span className="text-neutral-400 font-medium">Modes:</span>
          <span>1080p60 Screen Share</span>
          <span>&bull;</span>
          <span>6GB Local Movie Direct Stream</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-brand-cyan/80">
          <span>Engine: WebRTC Mesh + Google STUN</span>
        </div>
      </footer>
    </div>
  );
}
