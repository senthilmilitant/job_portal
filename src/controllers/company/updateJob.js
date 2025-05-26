import Job from '../../models/job.model.js';

export default async function updateJob(req, res) {
  try {
    const companyId = req.userId;
    const { jobId } = req.params;
    const updateData = req.body;

    console.log('companyId:', companyId, 'jobId:', jobId);
    console.log('Update data received:', updateData);

    const allowedFields = [
      'title',
      'description',
      'qualifications',
      'experienceRequired',
      'location',
      'salary',
      'status',
      'postedDate',
      // Do not allow full replacement of applicants array; handle separately if needed
    ];

    const filteredData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    console.log('Filtered data to update:', filteredData);

    // If you want to handle applicants as array updates, you need custom logic here
    // e.g., if (updateData.applicantsToAdd) { $push: { applicants: ... } }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, company: companyId },
      filteredData,
      { new: true }
    ).exec();

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found or access denied' });
    }

    console.log('Updated job:', updatedJob);

    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
