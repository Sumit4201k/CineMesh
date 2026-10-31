import React, { useState } from 'react';
import { Lobby } from './components/Lobby';
import { CinemaPlayer } from './components/CinemaPlayer';
import { HostControls } from './components/HostControls';
import { Chat } from './components/Chat';
import { useWebRTC } from './hooks/useWebRTC';
import { Tv, Share2, LogOut, Copy, Check } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';

export default function App() {
  const [session, setSession] = useState(null);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Show Lobby if no session active
  if (!session) {
    return <Lobby onJoinRoom={(userData) => setSession(userData)} />;
  }

  return (
    <div className="min-h-screen bg-cinema-950 text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-neutral-800/80 bg-cinema-900/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              Cine<span className="text-indigo-400">Mesh</span>
            </h1>
            <p className="text-[10px] text-neutral-400 font-medium">1080p Hi-Fi Watch Lounge</p>
          </div>
        </div>

        {/* Room Info & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-cinema-800/80 border border-neutral-700/60 rounded-xl text-xs">
            <span className="text-neutral-400">Room:</span>
            <span className="font-mono font-semibold text-indigo-300">{session.roomId}</span>
          </div>

          <Button onClick={handleCopyLink} variant="secondary" size="sm" icon={copied ? Check : Copy}>
            {copied ? 'Link Copied' : 'Invite Link'}
          </Button>

          <Button
            onClick={() => {
              setSession(null);
              window.location.reload();
            }}
            variant="ghost"
            size="sm"
            icon={LogOut}
            className="text-neutral-400 hover:text-red-400"
          >
            Leave
          </Button>
        </div>
      </header>

      {/* Main Theatre Grid */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Player & Broadcaster Controls */}
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

        {/* Right Column: Real-time Room Chat */}
        <div className="lg:col-span-1 h-[550px] lg:h-[620px] sticky top-22">
          <Chat socket={socket} roomId={session.roomId} userName={session.userName} />
        </div>
      </main>
    </div>
  );
}
