import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const lessonTypeValues = [
  'Video',
  'Article',
  'Live',
  'PDF',
  'Resource',
  'Interactive',
  'Quiz',
  'Assignment',
  'Text',
];

const statusValues = ['Draft', 'Published', 'Scheduled', 'Hidden', 'Archived'];
const visibilityValues = ['Public', 'Private', 'Enrolled'];
const completionRequirementValues = ['Watch75', 'Watch100', 'PassQuiz', 'SubmitAssignment', 'Manual'];

/**
 * Joi schema for creating a new Lesson.
 */
export const createLessonSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Lesson title is required',
    'string.min': 'Lesson title must be at least 2 characters',
    'any.required': 'Lesson title is required',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  shortDescription: Joi.string().trim().max(500).optional().allow('', null),
  content: Joi.string().trim().optional().allow('', null),
  sectionId: Joi.string().pattern(mongoIdPattern).optional().messages({
    'string.pattern.base': 'Invalid section ID format',
  }),
  unitId: Joi.string().pattern(mongoIdPattern).optional().messages({
    'string.pattern.base': 'Invalid unit ID format',
  }),
  courseId: Joi.string().pattern(mongoIdPattern).optional().messages({
    'string.pattern.base': 'Invalid course ID format',
  }),
  lessonType: Joi.string()
    .valid(...lessonTypeValues)
    .optional()
    .default('Video'),
  status: Joi.string()
    .valid(...statusValues)
    .optional()
    .default('Published'),
  visibility: Joi.string()
    .valid(...visibilityValues)
    .optional()
    .default('Enrolled'),
  duration: Joi.number().min(0).optional().default(0),
  estimatedStudyTime: Joi.number().min(0).optional().default(0),
  order: Joi.number().integer().min(1).optional(),
  isPreview: Joi.boolean().optional().default(false),
  isPublished: Joi.boolean().optional().default(true),
  videoUrl: Joi.string().trim().optional().allow('', null),
  attachmentUrl: Joi.string().trim().optional().allow('', null),
  completionRequirement: Joi.string()
    .valid(...completionRequirementValues)
    .optional()
    .default('Watch75'),
  releaseDate: Joi.date().iso().optional().allow(null),
  prerequisites: Joi.array().items(Joi.string().pattern(mongoIdPattern)).optional(),
});

/**
 * Joi schema for updating an existing Lesson.
 */
export const updateLessonSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).optional(),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  shortDescription: Joi.string().trim().max(500).optional().allow('', null),
  content: Joi.string().trim().optional().allow('', null),
  sectionId: Joi.string().pattern(mongoIdPattern).optional(),
  unitId: Joi.string().pattern(mongoIdPattern).optional(),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  lessonType: Joi.string().valid(...lessonTypeValues).optional(),
  status: Joi.string().valid(...statusValues).optional(),
  visibility: Joi.string().valid(...visibilityValues).optional(),
  duration: Joi.number().min(0).optional(),
  estimatedStudyTime: Joi.number().min(0).optional(),
  order: Joi.number().integer().min(1).optional(),
  isPreview: Joi.boolean().optional(),
  isPublished: Joi.boolean().optional(),
  videoUrl: Joi.string().trim().optional().allow('', null),
  attachmentUrl: Joi.string().trim().optional().allow('', null),
  completionRequirement: Joi.string().valid(...completionRequirementValues).optional(),
  releaseDate: Joi.date().iso().optional().allow(null),
  prerequisites: Joi.array().items(Joi.string().pattern(mongoIdPattern)).optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be updated',
  });

/**
 * Joi schema for reordering lessons.
 */
export const reorderLessonsSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().pattern(mongoIdPattern).required(),
        order: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

/**
 * Joi schema for moving a lesson to another section.
 */
export const moveLessonSchema = Joi.object({
  targetSectionId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid target section ID format',
    'any.required': 'Target section ID is required',
  }),
  order: Joi.number().integer().min(1).optional(),
});

export default {
  createLessonSchema,
  updateLessonSchema,
  reorderLessonsSchema,
  moveLessonSchema,
};
