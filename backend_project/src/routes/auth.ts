import Router from 'koa-router';
import { authController } from '../controllers/authСontroller';
import { validateDto } from '../utils/validateDto';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';

const router = new Router();

router.post('/register', validateDto(RegisterDto), async (ctx) => authController.register(ctx));
router.post('/login', validateDto(LoginDto), async (ctx) => authController.login(ctx));

export default router;