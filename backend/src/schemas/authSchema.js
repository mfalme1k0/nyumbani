import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  role: Joi.string().valid('tenant','agent','admin').required(),
  phone: Joi.string().max(30).optional().allow('').default('')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
