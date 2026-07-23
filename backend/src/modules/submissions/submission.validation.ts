import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for submitting an assignment.
 */
export const submitAssignmentSchema = Joi.object({
  assignmentId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid assignment ID format',
    'any.required': 'Assignment ID is required',
  }),
  attachments: Joi.array().items(Joi.string().trim()).optional(),
  textAnswer: Joi.string().trim().optional(),
});

/**
 * Joi validation schema for student updating their submission before the due date.
 */
export const updateSubmissionSchema = Joi.object({
  attachments: Joi.array().items(Joi.string().trim()).optional(),
  textAnswer: Joi.string().trim().optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field (attachments or textAnswer) must be updated',
  });

/**
 * Joi validation schema for teachers grading an assignment submission.
 */
export const gradeSubmissionSchema = Joi.object({
  grade: Joi.number().min(0).required().messages({
    'number.base': 'Grade must be a number',
    'any.required': 'Grade is required',
  }),
  feedback: Joi.string().trim().optional(),
});
