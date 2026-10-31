/**
 * @file webrtcService.js
 * @description Central export barrel for all WebRTC and media capture services.
 * Keeps existing imports clean and fully backward-compatible.
 */

export { ICE_SERVERS } from './webrtc/webrtcConfig';
export { enhanceAudioSDP } from './webrtc/sdpMunger';
export { getDisplayMediaConstraints, captureLocalFileStream } from './media/mediaCapture';
