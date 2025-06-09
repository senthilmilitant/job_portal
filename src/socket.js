
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/message.model.js';

export const connectedClients = new Map();

export default function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token?.split(' ')[1];
    if (!token) return next(new Error('No token provided'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      return next();
    } catch {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user;
    connectedClients.set(id, socket);

    console.log(`${role} connected with ID: ${id}`);

    socket.on('sendMessage', async ({ receiverId, receiverModel, content }) => {
      try {
        const newMessage = await Message.create({
          sender: id,
          receiver: receiverId,
          senderModel: role.charAt(0).toUpperCase() + role.slice(1),
          receiverModel,
          content,
        });

        const receiverSocket = connectedClients.get(receiverId);
        if (receiverSocket) {
          receiverSocket.emit('receiveMessage', newMessage);
        }

        socket.emit('messageDelivered', newMessage);
      } catch (err) {
        console.error('sendMessage error:', err);
        socket.emit('errorMessage', err.message);
      }
    });

    socket.on('markAsRead', async (messageId) => {
      try {
        await Message.findByIdAndUpdate(messageId, { read: true });
        console.log(`Message ${messageId} marked as read`);
      } catch (err) {
        console.error('Error updating read status:', err);
        socket.emit('errorMessage', 'Failed to update message read status');
      }
    });

    socket.on('disconnect', () => {
      connectedClients.delete(id);
      console.log(`${id} disconnected`);
    });
  });

  return io;
}
