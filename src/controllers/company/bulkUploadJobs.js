import Job from '../../models/job.model.js';
import { postJobSchema } from '../../validations/jobValidation.js';
import XLSX from 'xlsx';

export default async function bulkUploadJobs(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Excel file is required' });
    }

    // Read Excel from buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawJobsData = XLSX.utils.sheet_to_json(sheet);

    if (!rawJobsData.length) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    // Mapping for common misspellings or whitespace issues
    const fieldMappings = {
      'salry': 'salary',
      'qualifcation': 'qualifications',
      'experianceRequired': 'experienceRequired',
      // Add more mappings as needed
    };

    // Normalize keys (trim + fix misspellings)
    const jobsData = rawJobsData.map(row => {
      const normalized = {};
      for (const key in row) {
        if (Object.hasOwnProperty.call(row, key)) {
          const trimmedKey = key.trim();
          const correctedKey = fieldMappings[trimmedKey] || trimmedKey;
          normalized[correctedKey] = row[key];
        }
      }
      return normalized;
    });

    const validJobs = [];
    const errors = [];

    for (let [index, job] of jobsData.entries()) {
      // Convert qualifications from stringified array or string to actual array
      if (typeof job.qualifications === 'string') {
        try {
          const parsed = JSON.parse(job.qualifications);
          if (Array.isArray(parsed)) {
            job.qualifications = parsed;
          } else {
            job.qualifications = [job.qualifications];
          }
        } catch {
          // If JSON.parse fails, split by commas
          job.qualifications = job.qualifications.split(',').map(q => q.trim());
        }
      } else if (!Array.isArray(job.qualifications)) {
        job.qualifications = [];
      }

      // Validate with Joi
      const { error } = postJobSchema.validate(job);
      if (error) {
        errors.push(`Row ${index + 2}: ${error.message}`);
      } else {
        validJobs.push(job);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors });
    }

    // Insert valid jobs
    const insertedJobs = await Job.insertMany(validJobs);

    res.status(201).json({
      message: `${insertedJobs.length} jobs uploaded successfully.`,
      jobs: insertedJobs,
    });

  } catch (error) {
    console.error('Bulk Upload Error:', error);
    res.status(500).json({ message: 'Server error during bulk upload' });
  }
}
