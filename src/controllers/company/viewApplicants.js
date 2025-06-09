

import Job from '../../models/job.model.js';
import User from '../../models/user.model.js';

const viewApplicants = async (req, res) => {
  try {
    const companyId = req.userId; // from verifyToken middleware
    const jobId = req.params.jobId;

    // Find the job and ensure it belongs to the company
    const job = await Job.findOne({ _id: jobId, company: companyId }).populate('applicants', '-password');

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }
    console.log(job.applicants);
    // Return the list of applicants
    res.status(200).json({
      jobTitle: job.title,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error while fetching applicants' });
  }
};

export default viewApplicants;
