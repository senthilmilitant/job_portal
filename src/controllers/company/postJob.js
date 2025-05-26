import Job from '../../models/job.model.js';

export default async function postJob(req, res) {
  try {
    const companyId = req.userId; // assuming company is authenticated via middleware

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

    const job = new Job({
      company: companyId,
      title,
      description,
      qualifications: qualifications.split(',').map(q => q.trim()), // store as array
      experienceRequired,
      location,
      salary,
      postedDate: postedDate || Date.now(),
      applicants,
      status,
    });

    await job.save();

    res.status(201).json({
      message: 'Job posted successfully',
      job,
    });
  } catch (error) {
    console.error('Post Job Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
