import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a new Assignment.
 */
export const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Assignment title is required',
  }),
  description: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).required(),
  unitId: Joi.string().pattern(mongoIdPattern).required(),
  lessonId: Joi.string().pattern(mongoIdPattern).required(),
  teacherId: Joi.string().pattern(mongoIdPattern).optional(), // Defaults to req.user._id
  attachments: Joi.array().items(Joi.string().trim()).optional(),
  instructions: Joi.string().trim().optional(),
  totalMarks: Joi.number().min(0).required(),
  passingMarks: Joi.number().min(0).max(Joi.ref('totalMarks')).required().messages({
    'number.max': 'Passing marks must be less than or equal to total marks',
  }),
  allowLateSubmission: Joi.boolean().optional(),
  startDate: Joi.date().iso().optional(),
  dueDate: Joi.date().iso().required().messages({
    'any.required': 'Due date is required',
  }),
  status: Joi.string().valid('Draft', 'Published', 'Closed').optional(),
});

/**
 * Joi validation schema for updating an existing Assignment.
 */
export const updateAssignmentSchema = Joi.object({
  title: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  unitId: Joi.string().pattern(mongoIdPattern).optional(),
  lessonId: Joi.string().pattern(mongoIdPattern).optional(),
  attachments: Joi.array().items(Joi.string().trim()).optional(),
  instructions: Joi.string().trim().optional(),
  totalMarks: Joi.number().min(0).optional(),
  passingMarks: Joi.number().min(0).max(Joi.ref('totalMarks')).optional().messages({
    'number.max': 'Passing marks must be less than or equal to total marks',
  }),
  allowLateSubmission: Joi.boolean().optional(),
  startDate: Joi.date().iso().optional(),
  dueDate: Joi.date().iso().optional(),
  status: Joi.string().valid('Draft', 'Published', 'Closed').optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
export default createAssignmentSchema;
