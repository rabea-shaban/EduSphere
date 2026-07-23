import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Joi validation schema for creating a Transaction log.
 */
export const createTransactionSchema = Joi.object({
  paymentId: Joi.string().pattern(mongoIdPattern).required(),
  gateway: Joi.string().trim().required(),
  transactionId: Joi.string().trim().required(),
  requestPayload: Joi.any().optional(),
  responsePayload: Joi.any().optional(),
  status: Joi.string().valid('Pending', 'Success', 'Failed').required(),
});
export default createTransactionSchema;
