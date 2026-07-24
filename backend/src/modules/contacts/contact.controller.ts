import { Request, Response } from 'express';
import { Contact } from './contact.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

export const submitContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.create(req.body);
  res.status(201).json(new ApiResponse(201, contact, 'Contact message submitted successfully'));
});

export const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter: any = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const contacts = await Contact.find(filter).skip(skip).limit(limitNum).sort({ createdAt: -1 });
  const total = await Contact.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, { contacts, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } }, 'Contact queries retrieved successfully'));
});

export const getContactById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) throw new ApiError(404, 'Contact message not found');
  res.status(200).json(new ApiResponse(200, contact, 'Contact message details retrieved'));
});

export const updateContactStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndUpdate(id, { status: req.body.status }, { new: true });
  if (!contact) throw new ApiError(404, 'Contact message not found');
  res.status(200).json(new ApiResponse(200, contact, 'Contact status updated successfully'));
});
