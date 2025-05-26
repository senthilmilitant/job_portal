import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  qualifications: {
    type: [String],
    default: [],
  },
  experienceRequired: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    default: '',
  },
  salary: {
    type: Number,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
});

export default mongoose.model('Job', jobSchema);
