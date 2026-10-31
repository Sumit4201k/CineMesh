import React, { useState } from 'react';
import { Play, Tv, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

export function Lobby({ onJoinRoom }) {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(true);

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-cinema-950 relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-cinema-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-3 text-indigo-400">
            <Tv className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Cine<span className="text-indigo-400">Mesh</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            1080p Screen & 6GB Movie P2P Streaming
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-cinema-950 rounded-xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setIsHost(true)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isHost ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Host a Room
            </button>
            <button
              type="button"
              onClick={() => setIsHost(false)}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isHost ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Join with Code
            </button>
          </div>

          {/* User Name Field */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Your Display Name
            </label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-4 py-2.5 bg-cinema-800 border border-neutral-700/60 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Room ID Field */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              {isHost ? 'Room Code (Optional, leave blank to auto-generate)' : 'Room Code'}
            </label>
            <input
              type="text"
              required={!isHost}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder={isHost ? 'e.g. marvel-night (optional)' : 'Enter room code'}
              className="w-full px-4 py-2.5 bg-cinema-800 border border-neutral-700/60 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button
            type="submit"
            variant={isHost ? 'primary' : 'hifi'}
            size="lg"
            icon={Play}
            className="w-full mt-2"
          >
            {isHost ? 'Create Cinema Lounge' : 'Join Lounge'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-neutral-800/80 text-center flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          End-to-End Encrypted P2P Media (Zero Server Egress)
        </div>
      </div>
    </div>
  );
}
