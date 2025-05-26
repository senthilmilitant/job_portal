// src/controllers/company/deleteJob.js

import Job from '../../models/job.model.js';

export default async function deleteJob(req, res) {
  try {
    const companyId = req.userId;  // Make sure this is set from your auth middleware
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Find and delete the job only if it belongs to the logged-in company
    const deletedJob = await Job.findOneAndDelete({ _id: jobId, company: companyId });

    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
