import Job from '../../models/job.model.js';

export default async function listJobs(req, res) {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('company', 'name email');

    res.status(200).json({
      message: 'All open jobs fetched successfully',
      jobs,
    });
  } catch (error) {
    console.error('List Jobs Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
