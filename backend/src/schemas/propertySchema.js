import Joi from 'joi';

export const createPropertySchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().allow('').optional(),
  address: Joi.string().max(300).required(),
  location: Joi.string().max(100).required(),
  rentAmount: Joi.number().precision(2).required(),
  beds: Joi.number().integer().min(0).required(),
  baths: Joi.number().integer().min(0).required(),
  areaSqft: Joi.number().integer().min(0).required(),
  securityRating: Joi.number().integer().min(1).max(5).required(),
  status: Joi.string().valid('vacant','occupied','maintenance').required(),
  available: Joi.boolean().required()
});

export const updatePropertySchema = Joi.object({
  title: Joi.string().max(200).optional(),
  description: Joi.string().allow('').optional(),
  address: Joi.string().max(300).optional(),
  location: Joi.string().max(100).optional(),
  rentAmount: Joi.number().precision(2).optional(),
  beds: Joi.number().integer().min(0).optional(),
  baths: Joi.number().integer().min(0).optional(),
  areaSqft: Joi.number().integer().min(0).optional(),
  securityRating: Joi.number().integer().min(1).max(5).optional(),
  status: Joi.string().valid('vacant','occupied','maintenance').optional(),
  available: Joi.boolean().optional()
}).min(1);
