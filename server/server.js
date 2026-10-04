import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

const rooms = new Map();

function seedRooms() {
  const initialRooms = [
    { id: 'room-1', name: 'Gaming Lounge', topic: 'PUBG Squad', live: true, members: [] },
    { id: 'room-2', name: 'Night Chill', topic: 'Music & talk', live: true, members: [] },
    { id: 'room-3', name: 'Study Circle', topic: 'Focus mode', live: false, members: [] },
    { id: 'room-4', name: 'Arabic Talk', topic: 'Chat & vibes', live: true, members: [] },
  ];

  initialRooms.forEach((room) => rooms.set(room.id, room));
}

seedRooms();

function getRoomList() {
  return [...rooms.values()].map((room) => ({
    id: room.id,
    name: room.name,
    topic: room.topic,
    live: room.live,
    members: room.members.length,
  }));
}

io.on('connection', (socket) => {
  socket.emit('rooms:update', getRoomList());

  socket.on('create-room', ({ name, topic, host }) => {
    const roomId = `room-${Date.now()}`;
    const room = {
      id: roomId,
      name,
      topic,
      live: true,
      members: [{ id: socket.id, name: host || 'Host', muted: false }],
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    io.emit('rooms:update', getRoomList());
    socket.emit('room:joined', { room, participants: room.members });
  });

  socket.on('join-room', ({ roomId, username }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const exists = room.members.some((member) => member.id === socket.id);
    if (!exists) {
      room.members.push({ id: socket.id, name: username || 'Guest', muted: false });
    }

    socket.join(roomId);
    io.to(roomId).emit('room:participants', room.members);
    io.emit('rooms:update', getRoomList());
    socket.emit('room:joined', { room, participants: room.members });
  });

  socket.on('send-message', ({ roomId, user, text }) => {
    if (!roomId || !text) return;
    io.to(roomId).emit('room:message', {
      id: Date.now().toString(),
      user,
      text,
      mine: false,
    });
  });

  socket.on('toggle-mic', ({ roomId, muted }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const member = room.members.find((item) => item.id === socket.id);
    if (member) member.muted = muted;

    io.to(roomId).emit('room:participants', room.members);
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of rooms.entries()) {
      const idx = room.members.findIndex((member) => member.id === socket.id);
      if (idx >= 0) {
        room.members.splice(idx, 1);
        io.to(roomId).emit('room:participants', room.members);
      }
    }
    io.emit('rooms:update', getRoomList());
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`max132 server running on http://localhost:${PORT}`);
});
