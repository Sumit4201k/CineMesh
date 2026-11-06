import React, { useRef } from 'react';
import { Monitor, Film, CheckCircle2, HardDrive } from 'lucide-react';
import { Button } from './ui/Button';

/**
 * @file HostControls.jsx
 * @description Tactile Broadcaster Command Center branded with CineMesh purple/cyan aesthetic.
 */
export function HostControls({ onStartScreenShare, onSelectMovieFile, isStreaming }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectMovieFile(file);
    }
  };

  return (
    <div className="bg-brand-card/90 border border-brand-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-tactile-card backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-lg text-white">
              Broadcaster Console
            </h2>
            {isStreaming && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/40 text-[11px] font-mono font-semibold text-brand-cyan">
                <CheckCircle2 className="w-3.5 h-3.5" /> Streaming Active
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Choose a stream source. Media streams directly peer-to-peer at 1080p60 with zero cloud compression.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode 1: High-Performance Screen Share */}
        <div className="p-5 rounded-2xl bg-brand-canvas/80 border border-brand-border hover:border-brand-borderLight transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 text-brand-purpleLight font-semibold text-sm mb-1.5 font-display">
              <Monitor className="w-4 h-4 text-brand-cyan" />
              <span>Source A: Screen & System Audio</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Capture your entire display, application, or Chrome tab. Perfect for YouTube, anime, or gaming. Check <strong className="text-neutral-200">"Share system audio"</strong> when prompted.
            </p>
          </div>

          <Button
            onClick={onStartScreenShare}
            variant="primary"
            size="md"
            icon={Monitor}
            className="mt-5 w-full font-bold"
          >
            {isStreaming ? 'Switch to Screen Share' : 'Start Screen Share'}
          </Button>
        </div>

        {/* Mode 2: Direct 6GB Local Movie Player */}
        <div className="p-5 rounded-2xl bg-brand-canvas/80 border border-brand-border hover:border-brand-borderLight transition-all flex flex-col justify-between group">
          <div>
            <div className="flex items-center gap-2 text-brand-cyan font-semibold text-sm mb-1.5 font-display">
              <HardDrive className="w-4 h-4 text-brand-cyan" />
              <span>Source B: Local 6GB Cinema File</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pipes any local <code className="text-brand-cyan font-mono bg-brand-card px-1 py-0.5 rounded">.mp4</code> or <code className="text-brand-cyan font-mono bg-brand-card px-1 py-0.5 rounded">.mkv</code> directly from disk into WebRTC. Zero upload time, uncompressed bitstream quality.
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
            variant="cyan"
            size="md"
            icon={Film}
            className="mt-5 w-full font-bold"
          >
            {isStreaming ? 'Choose Another Movie File' : 'Select Local Movie File (6GB+)'}
          </Button>
        </div>
      </div>
    </div>
  );
}
