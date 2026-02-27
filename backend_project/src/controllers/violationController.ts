import { Context } from 'koa';
import { violationService } from '../services/violationService';
import { ViolationDto, SyncViolationDto } from '../dto/ViolationDto';

export class ViolationController {
    async getDates(ctx: Context) {
        try {
            const dates = await violationService.getUniqueDates();
            ctx.body = { dates };
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при отриманні дат', details: error.message };
        }
    }

    async getByDate(ctx: Context) {
        try {
            const violations = await violationService.getViolationsByDate(ctx.params.date);
            ctx.body = violations;
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при отриманні правопорушень', details: error.message };
        }
    }

    async getLocations(ctx: Context) {
        try {
            const locations = await violationService.getUniqueLocations();
            ctx.body = { locations };
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при отриманні геолокацій', details: error.message };
        }
    }

    async getByLocation(ctx: Context) {
        try {
            const { latitude, longitude } = ctx.query;

            if (!latitude || !longitude) {
                ctx.status = 400;
                ctx.body = { error: 'Потрібні параметри latitude та longitude' };
                return;
            }

            const violations = await violationService.getViolationsByLocation(
                parseFloat(latitude as string),
                parseFloat(longitude as string)
            );
            ctx.body = violations;
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при отриманні правопорушень за геолокацією', details: error.message };
        }
    }

    async create(ctx: Context) {
        try {
            const data = ctx.request.body as ViolationDto;
            const userId = ctx.state.user.id;

            const violation = await violationService.createViolation(data, userId);

            ctx.status = 201;
            ctx.body = { message: 'Правопорушення створено', violation };
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при створенні правопорушення', details: error.message };
        }
    }

    async sync(ctx: Context) {
        try {
            const { violations } = ctx.request.body as SyncViolationDto;
            const userId = ctx.state.user.id;

            const syncedViolations = await violationService.syncViolations(violations, userId);

            ctx.status = 201;
            ctx.body = {
                message: `Синхронізовано ${syncedViolations.length} правопорушень`,
                violations: syncedViolations
            };
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при синхронізації даних', details: error.message };
        }
    }

    async getAll(ctx: Context) {
        try {
            const violations = await violationService.getAllViolations();
            ctx.body = violations;
        } catch (error: any) {
            ctx.status = 500;
            ctx.body = { error: 'Помилка при отриманні правопорушень', details: error.message };
        }
    }

    async getById(ctx: Context) {
        try {
            const violation = await violationService.getViolationById(ctx.params.id);
            ctx.body = violation;
        } catch (error: any) {
            if (error.message === 'NOT_FOUND') {
                ctx.status = 404;
                ctx.body = { error: 'Правопорушення не знайдено' };
            } else {
                ctx.status = 500;
                ctx.body = { error: 'Помилка при отриманні правопорушення', details: error.message };
            }
        }
    }
}

export const violationController = new ViolationController();