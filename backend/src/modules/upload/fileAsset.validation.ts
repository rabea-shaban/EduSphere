import Joi from 'joi';

export const fileQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('').optional(),
  category: Joi.string().valid('all', 'image', 'video', 'document', 'archive', 'audio', 'code', 'other').optional(),
  folder: Joi.string().allow('').optional(),
  sort: Joi.string().valid('newest', 'oldest', 'largest', 'smallest', 'name').default('newest'),
  deleted: Joi.any().optional(),
});

export const updateFileMetadataSchema = Joi.object({
  originalName: Joi.string().trim().min(1).max(255).optional(),
  folder: Joi.string().trim().min(1).max(100).optional(),
  entityType: Joi.string().valid('course', 'lesson', 'assignment', 'profile', 'general').optional(),
  entityId: Joi.string().optional(),
});
