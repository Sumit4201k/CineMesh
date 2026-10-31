/**
 * @file mediaCapture.js
 * @description Handles video and audio stream acquisition for both:
 * 1. Desktop & System Audio Screen Share
 * 2. Direct 6GB Local Movie File Streaming (Zero-upload architecture)
 */

/**
 * Returns DisplayMedia constraints configured for:
 * - 1920x1080 resolution @ 60 FPS
 * - Echo cancellation OFF (Preserves cinema reverb and spatial effects)
 * - Noise suppression OFF (Preserves background score and subtle instruments)
 * - Auto gain control OFF (Preserves cinematic dynamic volume range)
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
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: 2, // Stereo 2-channel
      sampleRate: 48000,
    },
  };
}

/**
 * Streams a local 6GB+ movie file directly into WebRTC:
 * - Uses URL.createObjectURL() to create an in-memory pointer without loading 6GB into RAM.
 * - Extracts live decoded frames & audio output via HTMLMediaElement.captureStream(60).
 * - Zero wait time, zero cloud egress costs!
 * 
 * @param {File} file - Local movie file (.mp4, .mkv, .webm)
 * @param {HTMLVideoElement} videoElement - Reference to player video tag
 * @returns {Promise<{ stream: MediaStream, fileUrl: string }>}
 */
export function captureLocalFileStream(file, videoElement) {
  return new Promise((resolve, reject) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      videoElement.src = fileUrl;
      videoElement.load();

      videoElement.onloadedmetadata = () => {
        // captureStream(60) grabs the rendered frames at 60 FPS
        const stream = videoElement.captureStream
          ? videoElement.captureStream(60)
          : videoElement.mozCaptureStream(60);
        resolve({ stream, fileUrl });
      };

      videoElement.onerror = (e) => reject(e);
    } catch (err) {
      reject(err);
    }
  });
}
