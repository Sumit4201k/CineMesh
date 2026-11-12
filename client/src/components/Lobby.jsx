import React, { useState, useEffect } from 'react';
import { Play, Tv, Sparkles, Dice5, Radio, Film, Activity, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { generateRandomGuestName } from '../services/guestNames';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/**
 * @file Lobby.jsx
 * @description Cinema Lounge Arrival Stage branded with official CineMesh logo and palette.
 */
export function Lobby({ onJoinRoom, initialRoomId = '' }) {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState(initialRoomId);
  const [isHost, setIsHost] = useState(!initialRoomId);
  const reduceMotion = useReducedMotion();

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
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-between bg-brand-canvas brand-stage-glow text-neutral-100 relative selection:bg-brand-purple selection:text-white overflow-hidden rule-grid">
      <div className="projection-mark" aria-hidden="true">CM—001</div>
      {/* Top Technical Telemetry Strip */}
      <header className="w-full border-b border-brand-border px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {/* Official CineMesh Logo */}
          <img
            src="/cinemesh-logo.png"
            alt="CineMesh Logo"
            className="h-6 sm:h-7 w-auto object-contain"
          />
          <span className="hidden sm:inline font-mono text-[10px] text-brand-cyan/80 uppercase tracking-widest pl-2 border-l border-brand-border">
            PRIVATE SCREENING ROOM
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-5">
          <Badge variant="signalAmber" icon={Activity}>Direct WebRTC</Badge>
          <Badge variant="signalCrimson" icon={Sparkles}>Stereo 256kbps</Badge>
        </div>
      </header>

      {/* Main Center Stage */}
      <main className="flex-1 grid lg:grid-cols-[1.15fr_.85fr] gap-12 xl:gap-20 items-center max-w-7xl w-full mx-auto px-4 py-5 sm:p-10 lg:p-12 z-10">
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .42, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex min-h-[540px] flex-col justify-between border-l-2 border-brand-purple pl-9 py-4"
        >
          <div>
            <p className="font-mono text-[11px] text-brand-cyan tracking-[.24em] mb-8">PRIVATE SCREENING / DIRECT PLAYBACK</p>
            <h1 className="font-display text-7xl xl:text-[6.4rem] leading-[.86] tracking-[-.035em] text-neutral-100 max-w-2xl">A private room<br />for watching<br /><em className="text-brand-cyan not-italic">together.</em></h1>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 max-w-lg pt-8 border-t border-brand-border text-sm">
            <span className="font-mono text-[10px] text-brand-cyan tracking-widest">01</span><p className="m-0 text-neutral-300">Share a screen or open a local film.</p>
            <span className="font-mono text-[10px] text-brand-cyan tracking-widest">02</span><p className="m-0 text-neutral-300">Invite friends with one private link.</p>
            <span className="font-mono text-[10px] text-brand-cyan tracking-widest">03</span><p className="m-0 text-neutral-300">Playback travels directly between peers.</p>
          </div>
        </motion.section>
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .42, delay: reduceMotion ? 0 : .08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg ml-auto bg-brand-card border border-brand-border p-5 sm:p-9 shadow-player-stage relative form-frame"
        >
          <div className="absolute -top-px -left-px bg-brand-cyan text-brand-navy px-2.5 py-1 font-mono text-[9px] tracking-[.18em]">ADMIT ONE</div>
          
          {/* Logo Showcase inside Card */}
          <div className="text-left mt-4 mb-5 sm:mb-7">
            <div className="inline-block py-2 mb-3">
              <img
                src="/cinemesh-logo.png"
                alt="CineMesh"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </div>
            <p className="text-[13px] sm:text-sm text-neutral-400 max-w-sm leading-relaxed">
              Choose your seat, name the room, and begin the screening.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Tactile Role Switcher */}
            <div className="bg-brand-canvas border border-brand-border grid grid-cols-2 relative">
              <button
                type="button"
                onClick={() => setIsHost(true)}
                className={`relative min-h-12 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 ${
                  isHost
                    ? 'text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {isHost && <motion.span layoutId="role-selection" className="absolute inset-0 bg-brand-purple" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
                <Radio className={`relative z-10 w-3.5 h-3.5 ${isHost ? 'text-brand-cyan' : 'text-neutral-500'}`} />
                <span className="relative z-10">Host a Room</span>
              </button>
              <button
                type="button"
                onClick={() => setIsHost(false)}
                className={`relative min-h-12 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 ${
                  !isHost
                    ? 'text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {!isHost && <motion.span layoutId="role-selection" className="absolute inset-0 bg-brand-purple" transition={{ type: 'spring', stiffness: 480, damping: 38 }} />}
                <Tv className={`relative z-10 w-3.5 h-3.5 ${!isHost ? 'text-brand-cyan' : 'text-neutral-500'}`} />
                <span className="relative z-10">Join a Room</span>
              </button>
            </div>

            {/* Display Name Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-mono uppercase tracking-wider text-[10px] text-neutral-300">Your name</label>
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
                className="w-full min-h-12 px-4 py-3 bg-brand-canvas border border-brand-border text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all font-medium"
              />
            </div>

            {/* Room Code Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-neutral-300">
                  {isHost ? 'Room code (optional)' : 'Room code'}
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
                className="w-full min-h-12 px-4 py-3 bg-brand-canvas border border-brand-border text-base sm:text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 transition-all"
              />
            </div>

            {/* Action CTA */}
            <Button
              type="submit"
              variant={isHost ? 'primary' : 'cyan'}
              size="lg"
              icon={Play}
              className="w-full min-h-12 text-sm sm:text-base font-bold shadow-lg mt-2 sm:mt-3"
            >
              {isHost ? 'Open Screening Room' : 'Enter Screening Room'}
            </Button>
          </form>

          {/* Security & P2P Footnote */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={isHost ? 'host' : 'guest'} initial={reduceMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .14 }} className="mt-6 sm:mt-8 pt-4 border-t border-brand-border flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-400 text-center">
            <Lock className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{isHost ? 'YOU CONTROL THE SCREENING' : 'DIRECT PEER-TO-PEER PLAYBACK'}</span>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </main>

      {/* Footer System Specs */}
      <footer className="mobile-safe-footer w-full px-4 sm:px-8 py-3 sm:py-4 border-t border-brand-border bg-brand-canvas flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-neutral-500 gap-2 sm:gap-3 z-10">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden whitespace-nowrap">
          <span className="text-neutral-400 font-medium">SCREENING MODES</span>
          <span>1080p60 Screen</span>
          <span className="hidden min-[400px]:inline">&bull;</span>
          <span>Local Film File</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-brand-cyan/80">
          <span>WEBRTC / DTLS / SRTP</span>
        </div>
      </footer>
    </div>
  );
}
