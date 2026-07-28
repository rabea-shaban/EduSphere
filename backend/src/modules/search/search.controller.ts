import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { SearchService } from './search.service';

const getReqInfo = (req: Request) => {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return {
    ipAddress: rawIp || req.socket.remoteAddress || '127.0.0.1',
    userAgent: (req.headers['user-agent'] as string) || 'Unknown Agent',
    userName: req.user ? `${req.user.firstName} ${req.user.lastName}` : undefined,
    userRole: req.user?.role,
  };
};

/**
 * GET /teacher/search/global
 */
export const globalSearch = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const q = String(req.query.q || req.query.search || '');
  const reqInfo = getReqInfo(req);

  const results = await SearchService.globalSearch(req.user._id, q, reqInfo);
  res.status(200).json(new ApiResponse(200, results, 'تم جلب نتائج البحث العالمي بنجاح'));
});

/**
 * GET /teacher/search/suggestions
 */
export const getSearchSuggestions = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, 'غير مصرح بالوصول');
  const q = String(req.query.q || req.query.search || '');

  const suggestions = await SearchService.getSuggestions(req.user._id, q);
  res.status(200).json(new ApiResponse(200, suggestions, 'تم جلب اقتراحات البحث بنجاح'));
});
