import { describe, it, expect } from 'vitest';
import { enhanceAudioSDP, getDisplayMediaConstraints, ICE_SERVERS } from '../services/webrtcService';

describe('WebRTC & SDP Munging Engine', () => {
  it('provides public Google STUN servers with zero-cost NAT traversal', () => {
    expect(ICE_SERVERS.iceServers).toBeDefined();
    expect(ICE_SERVERS.iceServers.length).toBeGreaterThanOrEqual(1);
    expect(ICE_SERVERS.iceServers[0].urls).toContain('stun:stun.l.google.com:19302');
  });

  it('builds display media constraints that disable speech filters for lossless stereo sound', () => {
    const constraints = getDisplayMediaConstraints();

    expect(constraints.video.width.ideal).toBe(1920);
    expect(constraints.video.height.ideal).toBe(1080);
    expect(constraints.video.frameRate.ideal).toBe(60);

    // Audio Hi-Fi settings
    expect(constraints.audio.echoCancellation).toBe(false);
    expect(constraints.audio.noiseSuppression).toBe(false);
    expect(constraints.audio.autoGainControl).toBe(false);
    expect(constraints.audio.channelCount).toBe(2);
  });

  it('modifies SDP offer to inject stereo and 256kbps Opus high-fidelity flags', () => {
    const rawSdp = [
      'v=0',
      'o=- 123456 2 IN IP4 127.0.0.1',
      's=-',
      't=0 0',
      'm=audio 9 UDP/TLS/RTP/SAVPF 111',
      'a=rtpmap:111 opus/48000/2',
      'a=fmtp:111 minptime=10;useinbandfec=1',
      'm=video 9 UDP/TLS/RTP/SAVPF 96',
      'a=rtpmap:96 VP8/90000',
    ].join('\r\n');

    const mungedSdp = enhanceAudioSDP(rawSdp);

    // Verifies stereo and bitrate parameters injected into fmtp line
    expect(mungedSdp).toContain('stereo=1');
    expect(mungedSdp).toContain('sprop-stereo=1');
    expect(mungedSdp).toContain('maxaveragebitrate=262144');
    expect(mungedSdp).toContain('cbr=1');
    expect(mungedSdp).toContain('b=AS:8000'); // Video bitrate 8Mbps
  });
});
