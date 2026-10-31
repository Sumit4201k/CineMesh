/**
 * @file index.js
 * @description Main entry point for the CineMesh Signaling Server.
 * Sets up Express HTTP server, CORS policies, health check API, and initializes Socket.IO.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { registerSignalingHandlers } = require('./handlers/signalingHandler');

const app = express();

// Configure CORS for client access
const corsOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, methods: ['GET', 'POST'] }));
app.use(express.json());

/**
 * Health check endpoint for uptime monitors (Render/Koyeb pingers)
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'CineMesh Signaling' });
});

// Create HTTP server & Socket.IO signaling hub
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
});

// Attach signaling event listeners to every connecting socket
io.on('connection', (socket) => {
  registerSignalingHandlers(io, socket);
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🎬 CineMesh Signaling Server running on port ${PORT}`);
  });
}

module.exports = { app, server, io };
