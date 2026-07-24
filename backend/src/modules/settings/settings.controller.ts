import { Request, Response } from 'express';
import { Settings } from './settings.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

export const getGeneralSettings = catchAsync(async (req: Request, res: Response) => {
  const { organizationId } = req.query;
  const filter: any = {};
  if (organizationId) filter.organizationId = organizationId;

  let settings = await Settings.findOne(filter);
  if (!settings) {
    // Return empty default or create default
    settings = await Settings.create({ organizationName: 'EduSphere Academy' });
  }

  res.status(200).json(new ApiResponse(200, settings, 'Settings retrieved successfully'));
});

export const updateGeneralSettings = catchAsync(async (req: Request, res: Response) => {
  const { organizationId } = req.query;
  const filter: any = {};
  if (organizationId) filter.organizationId = organizationId;

  let settings = await Settings.findOne(filter);
  if (!settings) {
    settings = new Settings({ organizationName: req.body.organizationName || 'EduSphere Academy' });
  }

  Object.assign(settings, req.body);
  await settings.save();

  res.status(200).json(new ApiResponse(200, settings, 'Settings updated successfully'));
});
