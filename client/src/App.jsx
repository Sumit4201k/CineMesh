import React, { useState, useEffect } from 'react';
import { Lobby } from './components/Lobby';
import { CinemaPlayer } from './components/CinemaPlayer';
import { HostControls } from './components/HostControls';
import { Chat } from './components/Chat';
import { useWebRTC } from './hooks/useWebRTC';
import { Film, LogOut, Copy, Check, Radio, Sparkles, Activity } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';

/**
 * @file App.jsx
 * @description CineMesh Theater Experience.
 * Art direction: Ambient screening room with projector glow,
 * responsive multi-column stage grid, and synchronized real-time P2P engine.
 */
export default function App() {
  const [session, setSession] = useState(null);
  const [copied, setCopied] = useState(false);
  const [initialRoomId, setInitialRoomId] = useState('');

  // Auto-detect invite link URL query parameter: ?room=XYZ
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room');
      if (roomParam) {
        setInitialRoomId(roomParam.trim());
      }
    } catch (e) {
      console.warn('Could not parse window query params:', e);
    }
  }, []);

  // Initialize WebRTC hook
  const {
    remoteStream,
    localVideoRef,
    peerCount,
    isStreaming,
    socket,
    startScreenShare,
    startLocalMovieFile,
  } = useWebRTC(session || {});

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}?room=${session?.roomId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // 1. Show Lobby Arrival Stage if no session active
  if (!session) {
    return (
      <Lobby
        initialRoomId={initialRoomId}
        onJoinRoom={(userData) => setSession(userData)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-cinema-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400 selection:text-cinema-950">
      {/* Top Theater Header & Telemetry Bar */}
      <header className="h-16 border-b border-neutral-800/80 bg-cinema-900/60 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-cinema-glow">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-extrabold text-base tracking-tight text-white">
                Cine<span className="text-amber-400">Mesh</span>
              </h1>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="font-mono text-[10px] text-neutral-500 uppercase">
              {session.isHost ? 'Broadcaster Seat' : 'Viewer Seat'} &bull; {session.userName}
            </p>
          </div>
        </div>

        {/* Room Code & Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cinema-950/80 border border-neutral-800 rounded-xl text-xs font-mono">
            <span className="text-neutral-500">ROOM:</span>
            <span className="font-semibold text-amber-400">{session.roomId}</span>
          </div>

          <Button
            onClick={handleCopyLink}
            variant="secondary"
            size="sm"
            icon={copied ? Check : Copy}
            className="text-xs"
          >
            {copied ? 'Link Copied' : 'Invite Friends'}
          </Button>

          <Button
            onClick={() => {
              setSession(null);
              window.history.replaceState({}, document.title, window.location.pathname);
              window.location.reload();
            }}
            variant="danger"
            size="sm"
            icon={LogOut}
            className="text-xs"
          >
            Leave
          </Button>
        </div>
      </header>

      {/* Main Theater Auditorium Grid */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left 3 Columns: Cinema Stage & Broadcaster Deck */}
        <div className="lg:col-span-3 space-y-6">
          <CinemaPlayer
            mediaStream={remoteStream}
            isHost={session.isHost}
            localVideoRef={localVideoRef}
            peerCount={peerCount}
            roomTitle={session.roomId}
          />

          {session.isHost && (
            <HostControls
              onStartScreenShare={startScreenShare}
              onSelectMovieFile={startLocalMovieFile}
              isStreaming={isStreaming}
            />
          )}
        </div>

        {/* Right 1 Column: Real-Time Lounge Chat Transcript */}
        <div className="lg:col-span-1 h-[500px] lg:h-[640px] sticky top-24">
          <Chat socket={socket} roomId={session.roomId} userName={session.userName} />
        </div>
      </main>
    </div>
  );
}
