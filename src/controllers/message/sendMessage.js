

import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';

let io;
let connectedClients;

export function initSocketDependencies(ioInstance, clientMap) {
  io = ioInstance;
  connectedClients = clientMap;
}

export default async function sendMessage(req, res) {
  try {
    const senderId = req.userId;
    const senderRole = req.userRole; // 'user' or 'company'
    const { receiverId, receiverRole, content } = req.body;

    // Validate sender
    let senderData;
    if (senderRole === 'user') {
      senderData = await User.findById(senderId);
      if (!senderData) return res.status(404).json({ message: 'Sender not found' });
      if (!senderData.isPremium) {
        return res.status(403).json({ message: 'Only premium users can send messages' });
      }
    } else if (senderRole === 'company') {
      senderData = await Company.findById(senderId);
      if (!senderData) return res.status(404).json({ message: 'Sender not found' });
    } else {
      return res.status(403).json({ message: 'Unauthorized sender role' });
    }

    // Validate receiver
    let receiverData;
    if (receiverRole === 'user') {
      receiverData = await User.findById(receiverId);
      if (!receiverData) return res.status(404).json({ message: 'Receiver not found' });
      if (!receiverData.isPremium) {
        return res.status(403).json({ message: 'Only premium users can receive messages' });
      }
    } else if (receiverRole === 'company') {
      receiverData = await Company.findById(receiverId);
      if (!receiverData) return res.status(404).json({ message: 'Receiver not found' });
    } else {
      return res.status(403).json({ message: 'Unauthorized receiver role' });
    }

    // Save message
    const message = new Message({
      sender: senderId,
      senderModel: senderRole === 'user' ? 'User' : 'Company',
      receiver: receiverId,
      receiverModel: receiverRole === 'user' ? 'User' : 'Company',
      content,
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate({ path: 'sender', model: senderRole === 'user' ? 'User' : 'Company', select: 'name email' })
      .populate({ path: 'receiver', model: receiverRole === 'user' ? 'User' : 'Company', select: 'name email' });

    // Emit via Socket.IO if connected
    const receiverSocket = connectedClients?.get(receiverId);
    if (receiverSocket) {
      receiverSocket.emit('receiveMessage', populatedMessage);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: populatedMessage
    });

  } catch (error) {
    console.error('Send Message Error:', error);
    if (res && typeof res.status === 'function') {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
