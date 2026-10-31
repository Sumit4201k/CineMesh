const request = require('supertest');
const { io: ioClient } = require('socket.io-client');
const http = require('http');

// Helper to wait for a socket event with timeout
function waitFor(socket, event, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event '${event}' after ${timeout}ms`));
    }, timeout);

    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

// Helper to create client socket connected to the test server
function createClientSocket(url) {
  return ioClient(url, {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false
  });
}

describe('CineMesh Signaling Server Test Suite', () => {
  let app;
  let server;
  let io;
  let serverUrl;
  let port;

  beforeAll(async () => {
    const serverModule = require('../src/index');
    app = serverModule.app || serverModule;
    server = serverModule.server || (app && app.listen ? http.createServer(app) : serverModule);
    io = serverModule.io;

    if (server && !server.listening) {
      await new Promise((resolve) => {
        server.listen(0, () => {
          port = server.address().port;
          serverUrl = `http://localhost:${port}`;
          resolve();
        });
      });
    } else if (server && server.listening) {
      port = server.address().port;
      serverUrl = `http://localhost:${port}`;
    }
  });

  afterAll(async () => {
    if (io && typeof io.close === 'function') {
      io.close();
    }
    if (server && typeof server.close === 'function') {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // 1. Health check HTTP endpoint
  describe('GET /health', () => {
    test('returns 200 and { status: "healthy", service: "CineMesh Signaling" }', async () => {
      const res = await request(app || server || serverUrl).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'healthy',
        service: 'CineMesh Signaling'
      });
    });
  });

  // 2. Room creation and joining
  describe('Room creation and joining', () => {
    let hostSocket;
    let viewerSocket;

    afterEach(() => {
      if (hostSocket && hostSocket.connected) hostSocket.disconnect();
      if (viewerSocket && viewerSocket.connected) viewerSocket.disconnect();
    });

    test('host creates room and viewer joins, verifying user-joined and all-users events', async () => {
      hostSocket = createClientSocket(serverUrl);
      await waitFor(hostSocket, 'connect');

      const roomId = 'room-101';

      // Host joins room
      hostSocket.emit('join-room', {
        roomId,
        userName: 'HostAlice',
        isHost: true
      });

      // Small tick to ensure host is registered in room
      await new Promise((r) => setTimeout(r, 100));

      if (io) {
        const room = io.sockets.adapter.rooms.get(roomId);
        expect(room).toBeDefined();
        expect(room.has(hostSocket.id)).toBe(true);
      }

      // Host prepares to receive 'user-joined' event
      const hostUserJoinedPromise = waitFor(hostSocket, 'user-joined');

      // Viewer connects and joins room
      viewerSocket = createClientSocket(serverUrl);
      await waitFor(viewerSocket, 'connect');

      const viewerAllUsersPromise = waitFor(viewerSocket, 'all-users');

      viewerSocket.emit('join-room', {
        roomId,
        userName: 'ViewerBob',
        isHost: false
      });

      // Verify host receives 'user-joined' with Bob's socketId, userName, and isHost
      const joinedUser = await hostUserJoinedPromise;
      expect(joinedUser.socketId).toBe(viewerSocket.id);
      expect(joinedUser.userName).toBe('ViewerBob');
      expect(joinedUser.isHost).toBe(false);

      // Verify viewer receives 'all-users' list containing Alice's socketId
      const allUsers = await viewerAllUsersPromise;
      expect(Array.isArray(allUsers)).toBe(true);
      const hasAlice = allUsers.some((u) => {
        const socketId = typeof u === 'string' ? u : (u.socketId || u.id);
        return socketId === hostSocket.id;
      });
      expect(hasAlice).toBe(true);
    });
  });

  // 3. SDP Offer & Answer relaying
  describe('SDP Offer & Answer relaying', () => {
    let clientA;
    let clientB;

    beforeEach(async () => {
      clientA = createClientSocket(serverUrl);
      clientB = createClientSocket(serverUrl);

      await Promise.all([
        waitFor(clientA, 'connect'),
        waitFor(clientB, 'connect')
      ]);

      const aJoined = waitFor(clientA, 'all-users', 1000).catch(() => null);
      clientA.emit('join-room', { roomId: 'room-webrtc-1', userName: 'PeerA', isHost: true });
      await aJoined;

      const userJoinedPromise = waitFor(clientA, 'user-joined');
      clientB.emit('join-room', { roomId: 'room-webrtc-1', userName: 'PeerB', isHost: false });
      await userJoinedPromise;
    });

    afterEach(() => {
      if (clientA && clientA.connected) clientA.disconnect();
      if (clientB && clientB.connected) clientB.disconnect();
    });

    test('relays offer from Client A to Client B and answer from Client B to Client A', async () => {
      const mockOfferSDP = { type: 'offer', sdp: 'v=0\r\no=alice...mock-sdp-offer' };
      const mockAnswerSDP = { type: 'answer', sdp: 'v=0\r\no=bob...mock-sdp-answer' };

      // Set up offer listener on Client B
      const bOfferPromise = waitFor(clientB, 'offer');

      // Client A sends offer to Client B
      clientA.emit('offer', {
        targetSocketId: clientB.id,
        target: clientB.id,
        to: clientB.id,
        sdp: mockOfferSDP
      });

      const receivedOffer = await bOfferPromise;
      const offerSenderId = receivedOffer.senderSocketId || receivedOffer.from || receivedOffer.sender;
      expect(offerSenderId).toBe(clientA.id);
      expect(receivedOffer.sdp).toEqual(mockOfferSDP);

      // Set up answer listener on Client A
      const aAnswerPromise = waitFor(clientA, 'answer');

      // Client B sends answer to Client A
      clientB.emit('answer', {
        targetSocketId: clientA.id,
        target: clientA.id,
        to: clientA.id,
        sdp: mockAnswerSDP
      });

      const receivedAnswer = await aAnswerPromise;
      const answerSenderId = receivedAnswer.senderSocketId || receivedAnswer.from || receivedAnswer.sender;
      expect(answerSenderId).toBe(clientB.id);
      expect(receivedAnswer.sdp).toEqual(mockAnswerSDP);
    });
  });

  // 4. ICE Candidate relaying
  describe('ICE Candidate relaying', () => {
    let clientA;
    let clientB;

    beforeEach(async () => {
      clientA = createClientSocket(serverUrl);
      clientB = createClientSocket(serverUrl);

      await Promise.all([
        waitFor(clientA, 'connect'),
        waitFor(clientB, 'connect')
      ]);

      const aJoined = waitFor(clientA, 'all-users', 1000).catch(() => null);
      clientA.emit('join-room', { roomId: 'room-ice-1', userName: 'PeerA', isHost: true });
      await aJoined;

      const userJoinedPromise = waitFor(clientA, 'user-joined');
      clientB.emit('join-room', { roomId: 'room-ice-1', userName: 'PeerB', isHost: false });
      await userJoinedPromise;
    });

    afterEach(() => {
      if (clientA && clientA.connected) clientA.disconnect();
      if (clientB && clientB.connected) clientB.disconnect();
    });

    test('relays ice-candidate from Client A to Client B', async () => {
      const mockCandidate = {
        candidate: 'candidate:842163049 1 udp 1677729535 192.168.1.100 54321 typ host',
        sdpMid: '0',
        sdpMLineIndex: 0
      };

      const bIcePromise = waitFor(clientB, 'ice-candidate');

      clientA.emit('ice-candidate', {
        targetSocketId: clientB.id,
        target: clientB.id,
        to: clientB.id,
        candidate: mockCandidate
      });

      const receivedData = await bIcePromise;
      expect(receivedData.candidate).toEqual(mockCandidate);
      const iceSenderId = receivedData.senderSocketId || receivedData.from || receivedData.sender;
      expect(iceSenderId).toBe(clientA.id);
    });
  });

  // 5. Disconnect handling
  describe('Disconnect handling', () => {
    let clientA;
    let clientB;

    beforeEach(async () => {
      clientA = createClientSocket(serverUrl);
      clientB = createClientSocket(serverUrl);

      await Promise.all([
        waitFor(clientA, 'connect'),
        waitFor(clientB, 'connect')
      ]);

      const aJoined = waitFor(clientA, 'all-users', 1000).catch(() => null);
      clientA.emit('join-room', { roomId: 'room-disconnect-1', userName: 'PeerA', isHost: true });
      await aJoined;

      const userJoinedPromise = waitFor(clientA, 'user-joined');
      clientB.emit('join-room', { roomId: 'room-disconnect-1', userName: 'PeerB', isHost: false });
      await userJoinedPromise;
    });

    afterEach(() => {
      if (clientA && clientA.connected) clientA.disconnect();
      if (clientB && clientB.connected) clientB.disconnect();
    });

    test('notifies remaining peer with user-left when a user disconnects', async () => {
      const userLeftPromise = waitFor(clientA, 'user-left');

      const clientBIdBeforeDisconnect = clientB.id;
      clientB.disconnect();

      const leftData = await userLeftPromise;
      const leftSocketId = typeof leftData === 'string' ? leftData : leftData.socketId;
      expect(leftSocketId).toBe(clientBIdBeforeDisconnect);
    });
  });
});
