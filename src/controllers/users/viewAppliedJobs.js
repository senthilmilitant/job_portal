import User from '../../models/user.model.js';

export default async function viewAppliedJobs(req, res) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate({
        path: 'appliedJobs.job',
        model: 'Job'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const appliedJobs = user.appliedJobs.map(entry => ({
      job: entry.job,
      appliedAt: entry.appliedAt
    }));

    res.status(200).json({
      message: 'Applied jobs retrieved successfully',
      jobs: appliedJobs
    });
  } catch (error) {
    console.error('View Applied Jobs Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
