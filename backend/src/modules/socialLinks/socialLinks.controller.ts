import { Request, Response } from 'express';
import { SocialLinks } from './socialLinks.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

export const getSocialLinks = catchAsync(async (req: Request, res: Response) => {
  const { organizationId } = req.query;
  const filter: any = {};
  if (organizationId) filter.organizationId = organizationId;

  let links = await SocialLinks.findOne(filter);
  if (!links) {
    links = await SocialLinks.create({ facebook: '' });
  }

  res.status(200).json(new ApiResponse(200, links, 'Social links retrieved successfully'));
});

export const updateSocialLinks = catchAsync(async (req: Request, res: Response) => {
  const { organizationId } = req.query;
  const filter: any = {};
  if (organizationId) filter.organizationId = organizationId;

  let links = await SocialLinks.findOne(filter);
  if (!links) {
    links = new SocialLinks();
  }

  Object.assign(links, req.body);
  await links.save();

  res.status(200).json(new ApiResponse(200, links, 'Social links updated successfully'));
});
