
import Job from '../../models/job.model.js';

export default async function searchJobs(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: 'Search keyword is required' });
    }

    const regex = new RegExp(keyword, 'i'); // case-insensitive search

    const jobs = await Job.find({
      $or: [
        { title: regex },
        { description: regex },
        { qualifications: regex },
        { location: regex },
      ],
      status: 'open',
    });

    res.status(200).json({
      message: 'Jobs retrieved successfully',
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error('Search Jobs Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
