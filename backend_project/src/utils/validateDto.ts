import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Context, Next } from 'koa';

export function validateDto(dtoClass: any) {
    return async (ctx: Context, next: Next) => {
        const instance = plainToInstance(dtoClass, ctx.request.body as any);
        const errors = await validate(instance);
        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = {
                errors: errors.map(err => ({
                    field: err.property,
                    messages: err.constraints
                }))
            };
            return;
        }
        await next();
    };
}
