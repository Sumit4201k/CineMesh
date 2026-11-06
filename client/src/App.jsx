import React, { useState, useEffect } from 'react';
import { Lobby } from './components/Lobby';
import { CinemaPlayer } from './components/CinemaPlayer';
import { HostControls } from './components/HostControls';
import { Chat } from './components/Chat';
import { useWebRTC } from './hooks/useWebRTC';
import { LogOut, Copy, Check, Radio } from 'lucide-react';
import { Button } from './components/ui/Button';

/**
 * @file App.jsx
 * @description CineMesh Theater Experience branded with official logo & purple/cyan styling.
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
    <div className="min-h-screen bg-brand-canvas text-neutral-100 flex flex-col font-sans selection:bg-brand-purple selection:text-brand-cyan">
      {/* Top Theater Header & Telemetry Bar */}
      <header className="h-16 border-b border-brand-border/80 bg-brand-canvas/70 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="/cinemesh-logo.png"
            alt="CineMesh"
            className="h-8 w-auto object-contain drop-shadow-[0_0_12px_rgba(109,24,242,0.4)]"
          />
          <div className="hidden sm:block pl-3 border-l border-brand-border">
            <p className="font-mono text-[10px] text-brand-cyan/80 uppercase">
              {session.isHost ? 'Broadcaster Seat' : 'Viewer Seat'} &bull; {session.userName}
            </p>
          </div>
        </div>

        {/* Room Code & Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-card/90 border border-brand-border rounded-xl text-xs font-mono">
            <span className="text-neutral-500">ROOM:</span>
            <span className="font-semibold text-brand-cyan">{session.roomId}</span>
          </div>

          <Button
            onClick={handleCopyLink}
            variant="cyan"
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
