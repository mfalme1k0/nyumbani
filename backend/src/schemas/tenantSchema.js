import Joi from 'joi';

export const tenantProfileSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  lastName: Joi.string().max(100).required(),
  phone: Joi.string().max(30).optional().allow('')
});
