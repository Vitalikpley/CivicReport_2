import Router from 'koa-router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';
import { validateDto } from '../utils/validateDto';

const router = new Router();
const SECRET = 'secret123';

router.post('/register', validateDto(RegisterDto), async ctx => {
    const { firstName, lastName, email, password } = ctx.request.body as RegisterDto;
    const existing = await User.findOne({ email });
    if (existing) {
        ctx.status = 400;
        ctx.body = { error: 'Користувач з таким email вже існує' };
        return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hash });
    await user.save();
    ctx.body = { message: 'Зареєстровано успішно' };
});

router.post('/login', validateDto(LoginDto), async ctx => {
    const { email, password } = ctx.request.body as LoginDto;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        ctx.status = 401;
        ctx.body = { error: 'Невірний email або пароль' };
        return;
    }

    const token = jwt.sign({ id: user._id }, SECRET);
    ctx.body = { 
        token,
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    };
});

export default router;
