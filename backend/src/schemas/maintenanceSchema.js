import Joi from 'joi';

export const maintenanceSchema = Joi.object({
  propertyId: Joi.string().guid({ version: ['uuidv4'] }).required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).required(),
  category: Joi.string().max(80).optional().allow(''),
  priority: Joi.string().valid('low','medium','high').default('medium')
});

export const maintenanceUpdateSchema = Joi.object({
  status: Joi.string().valid('open','in-progress','resolved','closed').required(),
  agentId: Joi.string().guid({ version: ['uuidv4'] }).optional()
});
