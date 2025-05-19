import Notification from '../community/model/notification.model.js';
import { io } from '../index.js';
import { onlineUsers } from '../socket.js';

export const sendNotification = async ({ recipient, sender, type, post }) => {
  if (recipient.toString() === sender.toString()) return; // don't notify self

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    post,
  });

  const socketId = onlineUsers.get(recipient.toString());
  if (socketId) {
    io.to(socketId).emit('new-notification', notification);
  }
};
