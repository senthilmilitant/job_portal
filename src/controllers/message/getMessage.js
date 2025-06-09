import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';

const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.userRole?.toLowerCase();

    if (role === 'user') {
      const user = await User.findById(userId);
      if (!user || !user.isPremium) {
        return res.status(403).json({ message: 'Only premium users can access messages' });
      }
    } else if (role === 'company') {
      const company = await Company.findById(userId);
      if (!company) {
        return res.status(403).json({ message: 'Only premium users and companies can access messages' });
      }
    }

    // ✅ Mark all unread messages where the current user is the receiver as read
    await Message.updateMany(
      { receiver: userId, read: false },
      { $set: { read: true } }
    );

    // ✅ Fetch updated messages
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).sort({ timestamp: 1 });

    // ✅ Inline population
    const populatedMessages = await Promise.all(
      messages.map(async (msg) => {
        const senderModel = msg.senderModel === 'Company' ? Company : User;
        const receiverModel = msg.receiverModel === 'Company' ? Company : User;

        const [sender, receiver] = await Promise.all([
          senderModel.findById(msg.sender, 'name email'),
          receiverModel.findById(msg.receiver, 'name email')
        ]);

        return {
          ...msg.toObject(),
          sender,
          receiver,
        };
      })
    );

    res.status(200).json({ messages: populatedMessages });
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default getMessages;
