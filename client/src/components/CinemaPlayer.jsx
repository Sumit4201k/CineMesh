import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Radio, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export function CinemaPlayer({
  mediaStream,
  isHost,
  localVideoRef,
  peerCount = 0,
  roomTitle = 'CineMesh Lounge',
}) {
  const remoteVideoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Mount incoming remote stream for viewers
  useEffect(() => {
    if (!isHost && remoteVideoRef.current && mediaStream) {
      remoteVideoRef.current.srcObject = mediaStream;
      remoteVideoRef.current.play().catch((err) => {
        console.warn('Autoplay waiting for user gesture:', err);
      });
    }
  }, [mediaStream, isHost]);

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    const video = isHost ? localVideoRef?.current : remoteVideoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const video = isHost ? localVideoRef?.current : remoteVideoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const video = isHost ? localVideoRef?.current : remoteVideoRef.current;
    if (video) {
      video.volume = val;
      video.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/80 group select-none"
    >
      {/* Video Viewport */}
      {isHost ? (
        <video
          ref={localVideoRef}
          className="w-full h-full object-contain"
          playsInline
          muted={false}
        />
      ) : (
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
        />
      )}

      {/* Top Header Overlay */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2">
          <Badge variant="live" icon={Radio}>LIVE 1080p</Badge>
          <Badge variant="hifi" icon={Sparkles}>Hi-Fi Stereo 256kbps</Badge>
        </div>

        <div className="flex items-center gap-3 text-neutral-300 text-sm font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-neutral-800 backdrop-blur-md">
            <Users className="w-4 h-4 text-indigo-400" />
            {peerCount} {peerCount === 1 ? 'Viewer' : 'Viewers'}
          </span>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Play/Pause & Volume */}
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-white/10"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
          </Button>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition">
              {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Fullscreen Button */}
        <Button
          onClick={toggleFullscreen}
          variant="ghost"
          size="sm"
          className="p-2 rounded-lg hover:bg-white/10"
        >
          <Maximize className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
