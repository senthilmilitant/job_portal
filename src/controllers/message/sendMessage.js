import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';

export default async function sendMessage(req, res) {
  try {
    const senderId = req.userId;
    const senderRole = req.userRole;
    const { receiverId, receiverRole, content } = req.body;

    // Fetch sender's latest data from DB to check premium status
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

    // Create and save message
    const message = new Message({
      sender: senderId,
      senderModel: senderRole === 'User' ? 'User' : 'Company',
      receiver: receiverId,
      receiverModel: receiverRole === 'User' ? 'User' : 'Company',
      content,
    });

    await message.save();

    res.status(201).json({ message: 'Message sent successfully', messageData: message });
  } catch (error) {
    console.error('Send Message Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
