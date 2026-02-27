import { Context } from 'koa';
import { authService } from '../services/authService';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';

export class AuthController {
    async register(ctx: Context) {
        try {
            const data = ctx.request.body as RegisterDto;
            await authService.register(data);

            ctx.status = 201; // Created
            ctx.body = { message: 'Зареєстровано успішно' };
        } catch (error: any) {
            if (error.message === 'USER_EXISTS') {
                ctx.status = 400;
                ctx.body = { error: 'Користувач з таким email вже існує' };
            } else {
                ctx.status = 500;
                ctx.body = { error: 'Внутрішня помилка сервера' };
            }
        }
    }

    async login(ctx: Context) {
        try {
            const data = ctx.request.body as LoginDto;
            const result = await authService.login(data);

            ctx.status = 200;
            ctx.body = {
                token: result.token,
                user: {
                    id: result.user._id,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    email: result.user.email
                }
            };
        } catch (error: any) {
            if (error.message === 'INVALID_CREDENTIALS') {
                ctx.status = 401;
                ctx.body = { error: 'Невірний email або пароль' };
            } else {
                ctx.status = 500;
                ctx.body = { error: 'Внутрішня помилка сервера' };
            }
        }
    }
}

export const authController = new AuthController();