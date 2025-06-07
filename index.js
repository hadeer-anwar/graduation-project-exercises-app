import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({ path: "./.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// ✅ Initialize socket logic AFTER io is ready
import { initSocket } from './socket.js';
initSocket(io);

export { io }; // so other files like sendNotification.js can still use it

// Mongo connection
const db = process.env.DB_URL;
mongoose.connect(db)
  .then(() => console.log("Database Is Connected ✅"))
  .catch(err => console.error("Failed to connect to database", err));

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
