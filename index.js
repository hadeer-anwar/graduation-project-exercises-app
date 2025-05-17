
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path: "./.env"
})

import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

const db = process.env.DB_URL
mongoose.connect(db).then(async()=>{
    console.log("Database Is Connected ✅");
}).catch(err => {
    console.error("Failed to connect to database", err);
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});