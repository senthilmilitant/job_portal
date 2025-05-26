import Joi from 'joi';

// Validation schema for updating user profile
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  designation: Joi.string().max(100).optional(),
  isPremium: Joi.boolean().optional(),
  profileImage: Joi.string().uri().optional(),
});

// Validation schema for applying to a job
export const applyJobSchema = Joi.object({
  jobId: Joi.string().length(24).required(), // MongoDB ObjectId length
});

// Validation schema for searching jobs with filters
export const searchJobsSchema = Joi.object({
  keyword: Joi.string().min(1).optional(),
  location: Joi.string().optional(),
  category: Joi.string().optional(),
  salaryRange: Joi.string().optional(),
  experienceLevel: Joi.string().optional(),
});

// Validation schema for filtering jobs
export const filterJobsSchema = Joi.object({
  category: Joi.string().optional(),
  salaryMin: Joi.number().optional(),
  salaryMax: Joi.number().optional(),
  experienceMin: Joi.number().optional(),
  experienceMax: Joi.number().optional(),
});

// Validation schema for listing applied jobs (pagination)
export const listAppliedJobsSchema = Joi.object({
  page: Joi.number().min(1).optional(),
  limit: Joi.number().min(1).max(100).optional(),
});

// Validation schema for searching profiles
export const searchProfilesSchema = Joi.object({
  keyword: Joi.string().min(1).optional(),
  location: Joi.string().optional(),
  skills: Joi.array().items(Joi.string()).optional(),
});

