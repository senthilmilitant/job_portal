import Job from '../../models/job.model.js';

export default async function viewAppliedJobs(req, res) {
  try {
    const userId = req.userId;

    const appliedJobs = await Job.find({ applicants: userId })

    res.status(200).json({
      message: 'Applied jobs retrieved successfully',
      jobs: appliedJobs,
    });
  } catch (error) {
    console.error('View Applied Jobs Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
