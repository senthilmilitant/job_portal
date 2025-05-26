import Message from '../../models/message.model.js';
import User from '../../models/user.model.js';


const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const role = req.userRole?.toLowerCase();

    // Check if sender is allowed (only premium users or companies)
    if (role === 'user') {
      const user = await User.findById(userId);
      if (!user || !user.isPremium) {
        return res.status(403).json({ message: 'Only premium users can access messages' });
      }
    } else if (role == 'company') {
      const company = await Company.findById(userId);
      if (!company) {
        return res.status(403).json({ message: 'Only premium users and companies can access messages' });
      }
      
    }

    // Fetch messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Get Messages Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default getMessages;
