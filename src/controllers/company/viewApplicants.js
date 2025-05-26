
import Job from '../../models/job.model.js';


export default async function viewApplicants(req, res) {
  try {
    const companyId = req.userId;
    const { jobId } = req.params;

    // Find the job and ensure it belongs to the logged-in company
    const job = await Job.findOne({ _id: jobId, company: companyId }).populate('applicants', '-password');
    
    if (!job) { 
      console.log(companyId, jobId);
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    res.status(200).json({
      message: 'Applicants retrieved successfully',
      applicants: job.applicants,
    });
  } catch (error) {
    console.error('View Applicants Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
