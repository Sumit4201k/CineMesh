import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Sparkles, Radio, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

/**
 * @file CinemaPlayer.jsx
 * @description Cinema stage video player branded with CineMesh purple/cyan styling.
 */
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const activeFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(activeFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // iOS webkit fullscreen event listeners
  useEffect(() => {
    const activeVideo = isHost ? localVideoRef?.current : remoteVideoRef.current;
    if (!activeVideo) return;

    const onBegin = () => setIsFullscreen(true);
    const onEnd = () => setIsFullscreen(false);

    activeVideo.addEventListener('webkitbeginfullscreen', onBegin);
    activeVideo.addEventListener('webkitendfullscreen', onEnd);

    return () => {
      activeVideo.removeEventListener('webkitbeginfullscreen', onBegin);
      activeVideo.removeEventListener('webkitendfullscreen', onEnd);
    };
  }, [isHost, localVideoRef]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3500);
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

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    const video = isHost ? localVideoRef?.current : remoteVideoRef.current;

    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      (video && video.webkitDisplayingFullscreen)
    );

    if (isCurrentlyFullscreen) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (video && video.webkitExitFullscreen) {
        video.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    } else {
      try {
        if (container && container.requestFullscreen) {
          await container.requestFullscreen();
          setIsFullscreen(true);
        } else if (container && container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
          setIsFullscreen(true);
        } else if (video && typeof video.webkitEnterFullscreen === 'function') {
          video.webkitEnterFullscreen();
          setIsFullscreen(true);
        } else if (video && video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.warn('Fullscreen fallback trigger:', err);
        if (video && typeof video.webkitEnterFullscreen === 'function') {
          video.webkitEnterFullscreen();
          setIsFullscreen(true);
        }
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-player-stage border border-brand-border group select-none flex items-center justify-center"
    >
      {/* Video Viewport */}
      {isHost ? (
        <video
          ref={localVideoRef}
          className="w-full h-full object-contain"
          playsInline
          webkit-playsinline="true"
          muted={false}
        />
      ) : (
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          webkit-playsinline="true"
        />
      )}

      {/* Standby screen when not broadcasting */}
      {!mediaStream && !localVideoRef?.current?.srcObject && !localVideoRef?.current?.src && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-radial from-brand-card/70 to-black pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center text-brand-cyan mb-4 shadow-cyan-glow">
            <Radio className="w-8 h-8 animate-pulse text-brand-cyan" />
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            {isHost ? 'Cinema Stage Ready' : 'Connecting to Stream...'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            {isHost
              ? 'Choose "Screen & System Audio" or select a local 6GB movie file below to begin.'
              : 'Waiting for host broadcast to commence. Audio will stream in 256kbps stereo.'}
          </p>
        </div>
      )}

      {/* Top HUD Telemetry Overlay */}
      <div
        className={`absolute top-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 pointer-events-auto">
          <Badge variant="live" icon={Radio}>1080p 60fps</Badge>
          <Badge variant="cyan" icon={Sparkles}>Hi-Fi Stereo 256kbps</Badge>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs pointer-events-auto">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-card/90 rounded-md border border-brand-border backdrop-blur-md text-neutral-200">
            <Users className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{peerCount} {peerCount === 1 ? 'Peer' : 'Peers'}</span>
          </span>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Play/Pause & Volume Slider */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="sm"
            className="p-2.5 rounded-full hover:bg-white/10 text-white"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
          </Button>

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-brand-border">
            <button onClick={toggleMute} className="text-neutral-400 hover:text-white transition">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-brand-cyan" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 sm:w-28 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
            />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="p-2.5 rounded-xl hover:bg-white/10 text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5 text-white" />
            ) : (
              <Maximize className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
