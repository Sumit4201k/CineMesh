import React, { useRef } from 'react';
import { Monitor, Film, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

export function HostControls({ onStartScreenShare, onSelectMovieFile, isStreaming }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectMovieFile(file);
    }
  };

  return (
    <div className="bg-cinema-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Broadcaster Dashboard
            {isStreaming && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Streaming Active
              </span>
            )}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Choose your broadcast mode. Both modes stream at 1080p with lossless 48kHz stereo sound.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode 1: Screen Share */}
        <div className="p-4 rounded-xl bg-cinema-800/60 border border-neutral-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
              <Monitor className="w-4 h-4" /> Mode 1: Screen & System Audio
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Capture your entire screen, window, or Chrome tab. Ensure <strong>"Also share system audio"</strong> is checked for crisp audio.
            </p>
          </div>
          <Button
            onClick={onStartScreenShare}
            variant="primary"
            size="md"
            icon={Monitor}
            className="mt-4 w-full"
          >
            {isStreaming ? 'Switch to Screen Share' : 'Start Screen Share'}
          </Button>
        </div>

        {/* Mode 2: 6GB Local Movie File */}
        <div className="p-4 rounded-xl bg-cinema-800/60 border border-neutral-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1">
              <Film className="w-4 h-4" /> Mode 2: Direct 6GB Movie Player
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Pick any local <code className="text-emerald-300">.mp4</code> or <code className="text-emerald-300">.mkv</code> file up to 6GB+. Plays straight from disk into WebRTC with zero upload wait time.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/mkv"
            onChange={handleFileChange}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="hifi"
            size="md"
            icon={Film}
            className="mt-4 w-full"
          >
            {isStreaming ? 'Change Local Movie File' : 'Select Local Movie File'}
          </Button>
        </div>
      </div>
    </div>
  );
}
