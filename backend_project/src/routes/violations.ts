import Router from 'koa-router';
import { violationController } from '../controllers/violationController';
import { authMiddleware, requireModerator } from '../middleware/auth';
import { validateDto } from '../utils/validateDto';
import { ViolationDto, SyncViolationDto } from '../dto/ViolationDto';

const router = new Router();

router.get('/', async (ctx) => violationController.getAll(ctx));
router.get('/dates', async (ctx) => violationController.getDates(ctx));
//router.get('/locations', async (ctx) => violationController.getLocations(ctx));
router.get('/by-date/:date', async (ctx) => violationController.getByDate(ctx));
//router.get('/by-location', async (ctx) => violationController.getByLocation(ctx));
router.get('/:id', async (ctx) => violationController.getById(ctx));

router.post('/', authMiddleware, validateDto(ViolationDto), async (ctx) => violationController.create(ctx));
router.post('/sync', authMiddleware, validateDto(SyncViolationDto), async (ctx) => violationController.sync(ctx));

router.get('/moderator/pending', authMiddleware, requireModerator(), (ctx) => violationController.listPending(ctx));
router.get('/moderator/:id', authMiddleware, requireModerator(), (ctx) => violationController.getByIdForModerator(ctx));
router.patch('/moderator/:id/approve', authMiddleware, requireModerator(), (ctx) => violationController.approve(ctx));
router.patch('/moderator/:id/reject', authMiddleware, requireModerator(), (ctx) => violationController.reject(ctx));


export default router;