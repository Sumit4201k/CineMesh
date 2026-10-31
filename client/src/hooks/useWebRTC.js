import { useState, useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../services/socketService';
import { ICE_SERVERS, enhanceAudioSDP, getDisplayMediaConstraints, captureLocalFileStream } from '../services/webrtcService';

export function useWebRTC({ roomId, userName, isHost }) {
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerCount, setPeerCount] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const localVideoRef = useRef(null);
  const peerConnectionsRef = useRef(new Map()); // socketId -> RTCPeerConnection
  const currentStreamRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket & WebRTC room
  useEffect(() => {
    if (!roomId || !userName) return;

    const socket = getSocket();
    socketRef.current = socket;

    socket.emit('join-room', { roomId, userName, isHost });
    setConnectionStatus('connected');

    // 1. Existing users in the room (called for new joiner)
    socket.on('all-users', async (existingUsers) => {
      setPeerCount(existingUsers.length);
      // If viewer joins and host is already present, wait for offer
    });

    // 2. A new user joined our room
    socket.on('user-joined', async ({ socketId, userName: newUserName, isHost: newIsHost }) => {
      setPeerCount((prev) => prev + 1);

      // If we are host and already have an active stream, initiate offer to the new viewer
      if (isHost && currentStreamRef.current) {
        await initiatePeerConnection(socketId, currentStreamRef.current);
      }
    });

    // 3. Receive SDP Offer (Viewer side)
    socket.on('offer', async ({ senderSocketId, sdp }) => {
      let pc = peerConnectionsRef.current.get(senderSocketId);
      if (!pc) {
        pc = createPeerConnection(senderSocketId);
        peerConnectionsRef.current.set(senderSocketId, pc);
      }

      await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
      const answer = await pc.createAnswer();
      const enhancedAnswerSdp = enhanceAudioSDP(answer.sdp);
      await pc.setLocalDescription(new RTCSessionDescription({ type: 'answer', sdp: enhancedAnswerSdp }));

      socket.emit('answer', {
        targetSocketId: senderSocketId,
        sdp: enhancedAnswerSdp,
      });
    });

    // 4. Receive SDP Answer (Host side)
    socket.on('answer', async ({ senderSocketId, sdp }) => {
      const pc = peerConnectionsRef.current.get(senderSocketId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
      }
    });

    // 5. Receive ICE Candidate
    socket.on('ice-candidate', async ({ senderSocketId, candidate }) => {
      const pc = peerConnectionsRef.current.get(senderSocketId);
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.warn('Error adding received ice candidate', e);
        }
      }
    });

    // 6. User left
    socket.on('user-left', (leftSocketId) => {
      setPeerCount((prev) => Math.max(0, prev - 1));
      const pc = peerConnectionsRef.current.get(leftSocketId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(leftSocketId);
      }
    });

    return () => {
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      socket.off('all-users');
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
    };
  }, [roomId, userName, isHost]);

  // PeerConnection Creator
  const createPeerConnection = (targetSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    return pc;
  };

  // Host initiates call to a specific viewer
  const initiatePeerConnection = async (targetSocketId, stream) => {
    let pc = peerConnectionsRef.current.get(targetSocketId);
    if (!pc) {
      pc = createPeerConnection(targetSocketId);
      peerConnectionsRef.current.set(targetSocketId, pc);
    }

    // Add media tracks
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    const offer = await pc.createOffer();
    const enhancedOfferSdp = enhanceAudioSDP(offer.sdp);
    await pc.setLocalDescription(new RTCSessionDescription({ type: 'offer', sdp: enhancedOfferSdp }));

    socketRef.current.emit('offer', {
      targetSocketId,
      sdp: enhancedOfferSdp,
    });
  };

  // Start Screen Share Mode
  const startScreenShare = async () => {
    try {
      const constraints = getDisplayMediaConstraints();
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

      currentStreamRef.current = stream;
      setLocalStream(stream);
      setIsStreaming(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }

      // Broadcast tracks to all currently connected peers
      peerConnectionsRef.current.forEach(async (pc, targetSocketId) => {
        await initiatePeerConnection(targetSocketId, stream);
      });

      // Handle stream end when user clicks "Stop Sharing" on browser banner
      stream.getVideoTracks()[0].onended = () => {
        setIsStreaming(false);
        setLocalStream(null);
      };
    } catch (err) {
      console.error('Screen sharing cancelled or failed:', err);
    }
  };

  // Start 6GB Local Movie File Mode
  const startLocalMovieFile = async (file) => {
    try {
      if (!localVideoRef.current) return;
      const { stream } = await captureLocalFileStream(file, localVideoRef.current);

      currentStreamRef.current = stream;
      setLocalStream(stream);
      setIsStreaming(true);

      localVideoRef.current.play().catch(() => {});

      // Broadcast tracks to all currently connected peers
      peerConnectionsRef.current.forEach(async (pc, targetSocketId) => {
        await initiatePeerConnection(targetSocketId, stream);
      });
    } catch (err) {
      console.error('Failed to capture local movie stream:', err);
    }
  };

  return {
    remoteStream,
    localStream,
    localVideoRef,
    peerCount,
    isStreaming,
    connectionStatus,
    socket: socketRef.current,
    startScreenShare,
    startLocalMovieFile,
  };
}
