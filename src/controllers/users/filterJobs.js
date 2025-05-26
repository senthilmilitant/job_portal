
import Job from '../../models/job.model.js';

export default async function filterJobs(req, res) {
  try {
    const { location, experienceRequired, qualification } = req.query;

    const filter = { status: 'open' };

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (experienceRequired) {
      filter.experienceRequired = { $lte: Number(experienceRequired) };
    }

    if (qualification) {
      filter.qualifications = { $in: [new RegExp(qualification, 'i')] };
    }

    const jobs = await Job.find(filter).sort({ postedDate: -1 });

    res.status(200).json({
      message: 'Filtered jobs retrieved successfully',
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Filter Jobs Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
