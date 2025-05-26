import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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

  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isPremium: {
    type: Boolean,
    default: false,
  },

  designation: {
    type: String,
    trim: true,
  },

  profileImage: {
    type: String,
    default: '',
  },

  appliedJobs: [
    {
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('User', userSchema);
