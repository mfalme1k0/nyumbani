import Joi from 'joi';

export const favoriteSchema = Joi.object({
  propertyId: Joi.string().guid({ version: ['uuidv4'] }).required()
});
