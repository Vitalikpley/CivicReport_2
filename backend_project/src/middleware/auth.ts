import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';

const SECRET = 'secret123';

export async function authMiddleware(ctx: Context, next: Next) {
    const auth = ctx.headers.authorization;
    if (!auth) {
        ctx.status = 401;
        ctx.body = { error: 'Немає токена' };
        return;
    }

    try {
        const token = auth.split(' ')[1];
        ctx.state.user = jwt.verify(token, SECRET);
        await next();
    } catch {
        ctx.status = 403;
        ctx.body = { error: 'Недійсний токен' };
    }
}
