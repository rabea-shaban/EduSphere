import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/ApiError';

/**
 * Validation schema wrapper type mapping request properties to Joi schemas.
 */
interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}

/**
 * Generic Express middleware to validate incoming request data using Joi schemas.
 * 
 * @param schemas - Object mapping keys ('body', 'query', 'params') to their respective schemas.
 */
export const validationMiddleware = (schemas: ValidationSchema): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const keys = Object.keys(schemas) as Array<keyof ValidationSchema>;
    const errors: Array<{ field: string; message: string }> = [];

    keys.forEach((key) => {
      const schema = schemas[key];
      if (!schema) return;

      const dataToValidate = req[key];
      const { value, error } = schema.validate(dataToValidate, {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `${key}.${detail.path.join('.')}`,
            message: detail.message.replace(/['"]/g, ''),
          });
        });
      } else {
        // Re-assign sanitized/stripped data to the request object
        req[key] = value;
      }
    });

    if (errors.length > 0) {
      return next(new ApiError(400, 'Validation failed', errors));
    }

    next();
  };
};
