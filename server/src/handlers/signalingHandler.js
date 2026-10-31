/**
 * @file signalingHandler.js
 * @description Handles WebRTC SDP offers, SDP answers, ICE candidates,
 * room join events, chat messages, and socket disconnect cleanup.
 * 
 * WEBRTC DATA FLOW:
 * 1. Join Room: User connects to a room code; server introduces peers.
 * 2. Offer: Host generates SDP description (1080p, 256kbps stereo) and sends it here.
 *    Server forwards it directly to the target viewer's socket.
 * 3. Answer: Viewer sets remote description, creates SDP answer, and server routes it back to host.
 * 4. ICE Candidates: Both computers discover network paths (IP:Port via STUN) and exchange them.
 * 5. Direct Stream: Once ICE connects, media flows directly between browsers; server is idle.
 */

const { roomStore } = require('../stores/roomStore');

function registerSignalingHandlers(io, socket) {
  // ==========================================
  // 1. ROOM JOINING & PEER DISCOVERY
  // ==========================================
  socket.on('join-room', ({ roomId, userName, isHost }) => {
    socket.join(roomId);
    socket.data = { roomId, userName, isHost };

    // Register user in store and get other peers already waiting in the lounge
    const existingUserIds = roomStore.addUser(roomId, socket.id, { userName, isHost });

    // Tell the newly joined user about everyone already in the room
    socket.emit('all-users', existingUserIds);

    // Notify other peers in the room that a new participant has arrived
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      userName,
      isHost,
    });
  });

  // ==========================================
  // 2. WEBRTC SDP OFFER RELAY (Host -> Viewer)
  // ==========================================
  socket.on('offer', ({ targetSocketId, sdp }) => {
    io.to(targetSocketId).emit('offer', {
      senderSocketId: socket.id,
      sdp,
    });
  });

  // ==========================================
  // 3. WEBRTC SDP ANSWER RELAY (Viewer -> Host)
  // ==========================================
  socket.on('answer', ({ targetSocketId, sdp }) => {
    io.to(targetSocketId).emit('answer', {
      senderSocketId: socket.id,
      sdp,
    });
  });

  // ==========================================
  // 4. ICE CANDIDATE EXCHANGE (NAT Traversal)
  // ==========================================
  socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('ice-candidate', {
      senderSocketId: socket.id,
      candidate,
    });
  });

  // ==========================================
  // 5. ROOM CHAT RELAY
  // ==========================================
  socket.on('chat-message', ({ roomId, message, senderName, timestamp }) => {
    io.to(roomId).emit('chat-message', {
      senderSocketId: socket.id,
      senderName,
      message,
      timestamp: timestamp || new Date().toISOString(),
    });
  });

  // ==========================================
  // 6. DISCONNECTION & CLEANUP
  // ==========================================
  socket.on('disconnect', () => {
    const roomId = socket.data?.roomId;
    if (roomId) {
      roomStore.removeUser(roomId, socket.id);
      // Notify remaining peers in the room that this user left
      socket.to(roomId).emit('user-left', socket.id);
    }
  });
}

module.exports = { registerSignalingHandlers };
