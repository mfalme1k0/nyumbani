import Joi from 'joi';

export const forumThreadSchema = Joi.object({
  title: Joi.string().max(255).required(),
  content: Joi.string().max(2000).required(),
  category: Joi.string().max(50).optional().default('tenant')
});

export const forumCommentSchema = Joi.object({
  content: Joi.string().max(1000).required()
});
