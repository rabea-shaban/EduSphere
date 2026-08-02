"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Generic Express middleware to validate incoming request data using Joi schemas.
 *
 * @param schemas - Object mapping keys ('body', 'query', 'params') to their respective schemas.
 */
const validationMiddleware = (schemas) => {
    return (req, _res, next) => {
        const keys = Object.keys(schemas);
        const errors = [];
        keys.forEach((key) => {
            const schema = schemas[key];
            if (!schema)
                return;
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
            }
            else {
                // Re-assign sanitized/stripped data to the request object safely
                if (key === 'body') {
                    req.body = value;
                }
                else if (req[key] && typeof req[key] === 'object') {
                    Object.keys(req[key]).forEach((k) => delete req[key][k]);
                    Object.assign(req[key], value);
                }
                else {
                    try {
                        req[key] = value;
                    }
                    catch {
                        Object.defineProperty(req, key, { value, writable: true, configurable: true });
                    }
                }
            }
        });
        if (errors.length > 0) {
            return next(new ApiError_1.ApiError(422, 'فشل التحقق من صحة البيانات', 'VALIDATION_ERROR', errors));
        }
        next();
    };
};
exports.validationMiddleware = validationMiddleware;
