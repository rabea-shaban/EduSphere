import Joi from 'joi';

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const invoiceItemSchema = Joi.object({
  name: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
});

/**
 * Joi validation schema for creating a new Invoice.
 */
export const createInvoiceSchema = Joi.object({
  invoiceNumber: Joi.string().trim().required().messages({
    'string.empty': 'Invoice number is required',
  }),
  studentId: Joi.string().pattern(mongoIdPattern).optional(),
  organizationId: Joi.string().pattern(mongoIdPattern).optional(),
  paymentId: Joi.string().pattern(mongoIdPattern).required(),
  items: Joi.array().items(invoiceItemSchema).min(1).required(),
  subtotal: Joi.number().min(0).required(),
  discount: Joi.number().min(0).optional().default(0),
  tax: Joi.number().min(0).optional().default(0),
  total: Joi.number().min(0).required(),
  currency: Joi.string().trim().optional().default('USD'),
  status: Joi.string().valid('Issued', 'Paid', 'Cancelled').optional(),
  issuedAt: Joi.date().iso().optional(),
});

/**
 * Joi validation schema for updating an Invoice.
 */
export const updateInvoiceSchema = Joi.object({
  status: Joi.string().valid('Issued', 'Paid', 'Cancelled').optional(),
});
export default createInvoiceSchema;
