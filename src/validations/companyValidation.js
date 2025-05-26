
import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  description: Joi.string().max(1000),
  location: Joi.string(),
  website: Joi.string().uri(),
});
