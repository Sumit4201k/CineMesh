import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
