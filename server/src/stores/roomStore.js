/**
 * @file roomStore.js
 * @description In-memory state store for CineMesh rooms.
 * 
 * WHY IN-MEMORY (₹0 BUDGET)?
 * In WebRTC, heavy media (1080p video & 48kHz audio) streams peer-to-peer.
 * The signaling server only needs to track room codes and socket IDs (< 1MB RAM).
 * We do NOT need expensive cloud Redis servers to handle watch parties.
 */

class RoomStore {
  constructor() {
    // Structure: Map<roomId, Map<socketId, { userName: string, isHost: boolean }>>
    this.rooms = new Map();
  }

  /**
   * Adds a user to a room. Creates the room if it doesn't exist yet.
   * @param {string} roomId - Unique identifier for the room
   * @param {string} socketId - Socket.IO client connection ID
   * @param {object} userData - { userName: string, isHost: boolean }
   * @returns {string[]} Array of existing socket IDs already present in the room (excluding joining user)
   */
  addUser(roomId, socketId, userData) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    const currentRoom = this.rooms.get(roomId);
    const existingUserIds = Array.from(currentRoom.keys());

    currentRoom.set(socketId, userData);
    return existingUserIds;
  }

  /**
   * Removes a user from a room on disconnect or leave.
   * Cleans up the room automatically if empty to prevent memory leaks.
   * @param {string} roomId 
   * @param {string} socketId 
   * @returns {boolean} True if room is now empty and deleted; false if peers remain.
   */
  removeUser(roomId, socketId) {
    if (!this.rooms.has(roomId)) return true;

    const currentRoom = this.rooms.get(roomId);
    currentRoom.delete(socketId);

    if (currentRoom.size === 0) {
      this.rooms.delete(roomId);
      return true;
    }
    return false;
  }

  /**
   * Get all active sockets in a room
   * @param {string} roomId 
   * @returns {Map|null}
   */
  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }
}

// Export singleton instance
const roomStore = new RoomStore();
module.exports = { roomStore, RoomStore };
