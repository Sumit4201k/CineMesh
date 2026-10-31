/**
 * @file sdpMunger.js
 * @description Modifies WebRTC Session Description Protocol (SDP) strings.
 * 
 * WHY IS THIS NEEDED?
 * By default, browsers optimize WebRTC audio for voice calls (32kbps Mono).
 * They aggressively filter out background noise, which cuts off movie soundtracks and bass.
 * 
 * SDP MUNGING SOLUTION:
 * We intercept the SDP text and append flags directly to the Opus codec:
 * - stereo=1: Enables 2-channel stereo.
 * - sprop-stereo=1: Informs remote peer that stereo audio is arriving.
 * - maxaveragebitrate=262144: Unlocks 256 kbps (lossless perception quality).
 * - cbr=1: Constant Bitrate to avoid jitter during explosive movie scenes.
 * - b=AS:8000: Allocates up to 8 Mbps for high-framerate 1080p60 video.
 */

export function enhanceAudioSDP(sdp) {
  if (!sdp) return sdp;
  let modifiedSdp = sdp;

  // 1. Inject Stereo & 256kbps parameters into Opus audio description line
  if (modifiedSdp.includes('opus/48000')) {
    modifiedSdp = modifiedSdp.replace(
      /(a=fmtp:\d+ [^\r\n]+)/g,
      '$1;stereo=1;sprop-stereo=1;maxaveragebitrate=262144;cbr=1;maxplaybackrate=48000'
    );
  }

  // 2. Inject 8 Mbps bandwidth allocation for 1080p60 video line
  if (modifiedSdp.includes('m=video') && !modifiedSdp.includes('b=AS:')) {
    modifiedSdp = modifiedSdp.replace(
      /(m=video [^\r\n]+\r\n)/g,
      '$1b=AS:8000\r\n'
    );
  }

  return modifiedSdp;
}
