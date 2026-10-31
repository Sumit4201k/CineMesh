/**
 * CineMesh WebRTC Service Engine
 * Provides STUN configuration, SDP munging for 256kbps stereo audio,
 * and high-resolution 1080p60 media stream constraints.
 */

export const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

/**
 * Returns media constraints optimized for 1080p60 screen capture
 * with all aggressive voice processing filters disabled for lossless cinema audio.
 */
export function getDisplayMediaConstraints() {
  return {
    video: {
      width: { ideal: 1920, max: 1920 },
      height: { ideal: 1080, max: 1080 },
      frameRate: { ideal: 60, max: 60 },
      cursor: 'always',
    },
    audio: {
      echoCancellation: false, // Preserves ambient soundtrack
      noiseSuppression: false, // Keeps full frequency range
      autoGainControl: false,  // Preserves wide cinema dynamic range
      channelCount: 2,         // Stereo audio
      sampleRate: 48000,
    },
  };
}

/**
 * Munges SDP to enforce stereo Opus audio at 256 kbps (lossless perception)
 * and allocate up to 8 Mbps for 1080p60 video.
 */
export function enhanceAudioSDP(sdp) {
  if (!sdp) return sdp;
  let modifiedSdp = sdp;

  // Enhance Opus audio fmtp line with stereo and high bitrate parameters
  if (modifiedSdp.includes('opus/48000')) {
    modifiedSdp = modifiedSdp.replace(
      /(a=fmtp:\d+ [^\r\n]+)/g,
      '$1;stereo=1;sprop-stereo=1;maxaveragebitrate=262144;cbr=1;maxplaybackrate=48000'
    );
  }

  // Inject 8Mbps video allocation if not present
  if (modifiedSdp.includes('m=video') && !modifiedSdp.includes('b=AS:')) {
    modifiedSdp = modifiedSdp.replace(
      /(m=video [^\r\n]+\r\n)/g,
      '$1b=AS:8000\r\n'
    );
  }

  return modifiedSdp;
}

/**
 * Mounts a local video file (up to 6GB+) into an HTML5 video element
 * and captures its stream dynamically at 60 FPS without uploading to any cloud bucket.
 */
export function captureLocalFileStream(file, videoElement) {
  return new Promise((resolve, reject) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      videoElement.src = fileUrl;
      videoElement.load();

      videoElement.onloadedmetadata = () => {
        const stream = videoElement.captureStream ? videoElement.captureStream(60) : videoElement.mozCaptureStream(60);
        resolve({ stream, fileUrl });
      };

      videoElement.onerror = (e) => reject(e);
    } catch (err) {
      reject(err);
    }
  });
}
