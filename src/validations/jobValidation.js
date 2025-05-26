import Joi from 'joi';

export const postJobSchema = Joi.object({
  company: Joi.string().required(),
  title: Joi.string().min(3).required(),
  description: Joi.string().required(),
  qualifications: Joi.array().items(Joi.string()).required(),
  experienceRequired: Joi.number().min(0).required(),
  location: Joi.string().required(),
  salary: Joi.number().required(),
  postedDate: Joi.date().optional(),
  applicants: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('open', 'closed').default('open'),
});

export const updateJobSchema = Joi.object({
  company: Joi.string(),
  title: Joi.string().min(3),
  description: Joi.string(),
  qualifications: Joi.string(),
  experience: Joi.number().min(0),
  location: Joi.string(),
  salary: Joi.number(),
  postedDate: Joi.date(),
  applicants: Joi.array().items(Joi.string()),
  status: Joi.string().valid('open', 'closed'),
});
