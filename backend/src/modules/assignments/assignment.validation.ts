import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const submissionTypeValues = [
  'TextSubmission',
  'FileUpload',
  'PDFUpload',
  'ImageUpload',
  'ZIPUpload',
  'ExternalUrl',
  'MultipleAttachments',
];

export const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'Assignment title is required',
    'any.required': 'Assignment title is required',
  }),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  instructions: Joi.string().trim().max(3000).optional().allow('', null),
  courseId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.empty': 'Course reference is required',
    'any.required': 'Course reference is required',
  }),
  unitId: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  sectionId: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  lessonId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.empty': 'Lesson reference is required',
    'any.required': 'Lesson reference is required',
  }),
  teacherId: Joi.string().pattern(mongoIdPattern).optional(),
  attachments: Joi.array().items(Joi.any()).optional(),
  totalMarks: Joi.number().min(0).optional().default(100),
  passingMarks: Joi.number().min(0).optional().default(60),
  submissionType: Joi.string()
    .valid(...submissionTypeValues)
    .optional()
    .default('FileUpload'),
  allowedFileTypes: Joi.array().items(Joi.string().trim()).optional(),
  maxFileSizeMB: Joi.number().min(1).optional().default(10),
  maxFiles: Joi.number().min(1).optional().default(5),
  maxAttempts: Joi.number().min(0).optional().default(1),
  allowLateSubmission: Joi.boolean().optional().default(false),
  latePenaltyPercentage: Joi.number().min(0).max(100).optional().default(0),
  startDate: Joi.date().iso().optional().allow(null),
  dueDate: Joi.date().iso().required().messages({
    'any.required': 'Due date is required',
  }),
  expiryDate: Joi.date().iso().optional().allow(null),
  visibility: Joi.string().valid('Public', 'Private', 'Enrolled').optional().default('Enrolled'),
  status: Joi.string().valid('Draft', 'Published', 'Closed', 'Archived').optional().default('Published'),
  estimatedDuration: Joi.number().min(0).optional().default(60),
});

export const updateAssignmentSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).optional(),
  description: Joi.string().trim().max(2000).optional().allow('', null),
  instructions: Joi.string().trim().max(3000).optional().allow('', null),
  courseId: Joi.string().pattern(mongoIdPattern).optional(),
  unitId: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  sectionId: Joi.string().pattern(mongoIdPattern).optional().allow('', null),
  lessonId: Joi.string().pattern(mongoIdPattern).optional(),
  teacherId: Joi.string().pattern(mongoIdPattern).optional(),
  attachments: Joi.array().items(Joi.any()).optional(),
  totalMarks: Joi.number().min(0).optional(),
  passingMarks: Joi.number().min(0).optional(),
  submissionType: Joi.string().valid(...submissionTypeValues).optional(),
  allowedFileTypes: Joi.array().items(Joi.string().trim()).optional(),
  maxFileSizeMB: Joi.number().min(1).optional(),
  maxFiles: Joi.number().min(1).optional(),
  maxAttempts: Joi.number().min(0).optional(),
  allowLateSubmission: Joi.boolean().optional(),
  latePenaltyPercentage: Joi.number().min(0).max(100).optional(),
  startDate: Joi.date().iso().optional().allow(null),
  dueDate: Joi.date().iso().optional(),
  expiryDate: Joi.date().iso().optional().allow(null),
  visibility: Joi.string().valid('Public', 'Private', 'Enrolled').optional(),
  status: Joi.string().valid('Draft', 'Published', 'Closed', 'Archived').optional(),
  estimatedDuration: Joi.number().min(0).optional(),
}).min(1);

export default {
  createAssignmentSchema,
  updateAssignmentSchema,
};
