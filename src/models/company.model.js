
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    trim: true,
  },

  jobsPosted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Company', companySchema);
