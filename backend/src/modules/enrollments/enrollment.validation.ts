import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for student enrollment request.
 */
export const enrollStudentSchema = Joi.object({
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid course ID format',
    'any.required': 'Course ID is required',
  }),
  paymentStatus: Joi.string().valid('Paid', 'Unpaid', 'Free').optional(),
});

/**
 * Joi validation schema for updating an existing Enrollment.
 */
export const updateEnrollmentSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Active', 'Completed', 'Cancelled').optional(),
  paymentStatus: Joi.string().valid('Paid', 'Unpaid', 'Free').optional(),
  purchasePrice: Joi.number().min(0).optional(),
  certificateIssued: Joi.boolean().optional(),
  completedAt: Joi.date().iso().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });
