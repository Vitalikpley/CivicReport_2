import jwt from 'jsonwebtoken';
import { Context, Next } from 'koa';
import {User} from "../models/User";

const SECRET = 'secret123';

export async function authMiddleware(ctx: Context, next: Next) {


    const header = ctx.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        ctx.status = 401;
        ctx.body = { error: 'Немає токена' };
        return;
    }
    try {
        const payload = jwt.verify(token, SECRET) as { id: string };
        const user = await User.findById(payload.id).select('-password').lean();
        if (!user) throw new Error('User not found');
        ctx.state.user = {
            _id: user._id.toString(),
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
        };
        await next();
    } catch (err) {
        if (err instanceof Error) throw err;
        throw new Error('Invalid token');
    }






}

export function requireModerator() {
    return async (ctx: Context, next: Next) => {
        if (ctx.state.user?.role !== 'admin') {
            ctx.status = 403;
            ctx.body = { error: 'Forbidden' };
            return;
        }
        await next();
    };
}