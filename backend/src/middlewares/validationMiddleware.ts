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
        // Re-assign sanitized/stripped data to the request object safely
        if (key === 'body') {
          req.body = value;
        } else if (req[key] && typeof req[key] === 'object') {
          Object.keys(req[key]).forEach((k) => delete (req[key] as any)[k]);
          Object.assign(req[key], value);
        } else {
          try {
            req[key] = value;
          } catch {
            Object.defineProperty(req, key, { value, writable: true, configurable: true });
          }
        }
      }
    });

    if (errors.length > 0) {
      return next(new ApiError(422, 'فشل التحقق من صحة البيانات', 'VALIDATION_ERROR', errors));
    }

    next();
  };
};
