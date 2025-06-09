import Job from '../../models/job.model.js';
import Company from '../../models/company.model.js';

export default async function postJob(req, res) {
  try {
    const companyId = req.userId; // set by auth middleware

    const {
      title,
      description,
      qualifications,
      experienceRequired,
      location,
      salary,
      postedDate,
      applicants,
      status,
    } = req.body;

    // Create and save the job
    const job = new Job({
      company: companyId,
      title,
      description,
      qualifications: qualifications || [],
      experienceRequired,
      location,
      salary,
      postedDate: postedDate || Date.now(),
      applicants,
      status,
    });

    await job.save();

    // Push job ID into the company's jobsPosted array
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { jobsPosted: job._id } }
    );

    res.status(201).json({
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    console.error('Post Job Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
