const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, methods: ['GET', 'POST'] }));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'CineMesh Signaling' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
});

// In-memory room store: roomId -> Map<socketId, { userName, isHost }>
const rooms = new Map();

io.on('connection', (socket) => {
  // 1. Join room
  socket.on('join-room', ({ roomId, userName, isHost }) => {
    socket.join(roomId);
    socket.data = { roomId, userName, isHost };

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const currentRoom = rooms.get(roomId);

    // Collect all existing user socket IDs in this room (excluding joining socket)
    const existingUserIds = Array.from(currentRoom.keys());

    // Register user in room map
    currentRoom.set(socket.id, { userName, isHost });

    // Notify joining user of everyone already in the room
    socket.emit('all-users', existingUserIds);

    // Notify everyone else in the room that a new user joined
    socket.to(roomId).emit('user-joined', {
      socketId: socket.id,
      userName,
      isHost,
    });
  });

  // 2. WebRTC SDP Offer relay
  socket.on('offer', ({ targetSocketId, sdp }) => {
    io.to(targetSocketId).emit('offer', {
      senderSocketId: socket.id,
      sdp,
    });
  });

  // 3. WebRTC SDP Answer relay
  socket.on('answer', ({ targetSocketId, sdp }) => {
    io.to(targetSocketId).emit('answer', {
      senderSocketId: socket.id,
      sdp,
    });
  });

  // 4. WebRTC ICE Candidate relay
  socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('ice-candidate', {
      senderSocketId: socket.id,
      candidate,
    });
  });

  // 5. Room Chat message relay
  socket.on('chat-message', ({ roomId, message, senderName, timestamp }) => {
    io.to(roomId).emit('chat-message', {
      senderSocketId: socket.id,
      senderName,
      message,
      timestamp: timestamp || new Date().toISOString(),
    });
  });

  // 6. Disconnect handling & cleanup
  socket.on('disconnect', () => {
    const roomId = socket.data?.roomId;
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.delete(socket.id);

      if (room.size === 0) {
        rooms.delete(roomId);
      } else {
        socket.to(roomId).emit('user-left', socket.id);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`CineMesh Signaling Server running on port ${PORT}`);
  });
}

module.exports = { app, server, io };
