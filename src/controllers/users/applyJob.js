// src/controllers/user/applyJob.js
import Job from '../../models/job.model.js';
import User from '../../models/user.model.js';

export default async function applyJob(req, res) {
  try {
    const userId = req.userId;
    const { jobId } = req.body;

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const user = await User.findById(userId);
    const alreadyApplied = user.appliedJobs.some(j => j.job.toString() === jobId);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add job to user's appliedJobs
    user.appliedJobs.push({ job: jobId });
    await user.save();

    // Optionally: Add user to job's applicants list (if tracking from job side)

    res.status(200).json({ message: 'Successfully applied for the job' });
  } catch (error) {
    console.error('Apply Job Error:', error );
    res.status(500).json({ message: 'Internal server error' });
  }
}
