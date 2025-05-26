
import Joi from 'joi';

export const signupSchema = Joi.object({
email: Joi.string().email().required(),
name: Joi.string().min(3),
designation: Joi.string().trim().optional(),
isPremium: Joi.boolean().optional(),

});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'company').required(),
  name: Joi.string().min(1).required(),
  isPremium: Joi.boolean().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
 
});
