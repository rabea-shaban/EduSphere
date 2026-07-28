import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { globalSearch, getSearchSuggestions } from './search.controller';

const router = Router();

// Protect all search routes with authentication and role check
router.use(protect);
router.use(restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'));

router.get('/global', globalSearch);
router.get('/suggestions', getSearchSuggestions);

export default router;
