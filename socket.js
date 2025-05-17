import { io } from './index.js'; // Import the io instance

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinSession', (sessionId) => {
    socket.join(sessionId); // Join room by session ID
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
