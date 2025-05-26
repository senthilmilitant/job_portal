
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel', // Dynamic reference for User or Company
    required: true,
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Company'], // Sender can be either User or Company
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'receiverModel', // Dynamic reference for User or Company
    required: true,
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['User', 'Company'], // Receiver can be either User or Company
  },

  content: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },

  read: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Message', messageSchema);
