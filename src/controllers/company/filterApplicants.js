
import Job from '../../models/job.model.js';
import User from '../../models/user.model.js';

export default async function filterApplicants(req, res) {
  try {
    const companyId = req.userId;
    const { jobId } = req.params;
    const { experienceRequired, location, qualifications } = req.query;

    // Ensure the job belongs to the company
    const job = await Job.findOne({ _id: jobId, company: companyId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    // Build filter query for applicants
    const filter = { _id: { $in: job.applicants } };

    if (experienceRequired) {
      filter.experienceRequired = { $gte: parseInt(experienceRequired) };
    }

    if (location) {
      filter.location = location;
    }

    if (qualifications) {
      filter.qualifications = { $regex: new RegExp(qualifications, 'i') }; // case-insensitive match
    }

    const filteredApplicants = await User.find(filter).select('-password');

    res.status(200).json({
      message: 'Filtered applicants retrieved successfully',
      applicants: filteredApplicants,
    });
  } catch (error) {
    console.error('Filter Applicants Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
