import Router from 'koa-router';
import { Violation } from '../models/Violation';
import { authMiddleware } from '../middleware/auth';
import { validateDto } from '../utils/validateDto';
import { ViolationDto, SyncViolationDto } from '../dto/ViolationDto';

const router = new Router();

router.get('/dates', async ctx => {
    try {
        const dates = await Violation.distinct('dateTime');
        // Конвертуємо дати в формат YYYY-MM-DD
        const uniqueDates = [...new Set(
            dates.map(date => {
                const d = new Date(date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            })
        )].sort();
        
        ctx.body = { dates: uniqueDates };
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при отриманні дат', details: error.message };
    }
});

router.get('/by-date/:date', async ctx => {
    try {
        const { date } = ctx.params;
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const violations = await Violation.find({
            dateTime: {
                $gte: startDate,
                $lte: endDate
            }
        }).populate('userId', 'firstName lastName email').select('-password');

        ctx.body = violations.map(v => ({
            id: v._id,
            description: v.description,
            category: v.category,
            photoUrl: v.photoUrl,
            dateTime: v.dateTime,
            location: v.location,
            user: v.userId
        }));
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при отриманні правопорушень', details: error.message };
    }
});

router.get('/locations', async ctx => {
    try {
        const violations = await Violation.find({}, 'location').lean();
        const locations = violations.map(v => ({
            latitude: v.location?.latitude,
            longitude: v.location?.longitude
        }));
        
        // Видаляємо дублікати
        const uniqueLocations = [...new Set( locations.map(loc => `${loc.latitude},${loc.longitude}`))];

        ctx.body = { locations: uniqueLocations };
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при отриманні геолокацій', details: error.message };
    }
});

router.get('/by-location', async ctx => {
    try {
        const { latitude, longitude} = ctx.query;
        
        if (!latitude || !longitude) {
            ctx.status = 400;
            ctx.body = { error: 'Потрібні параметри latitude та longitude' };
            return;
        }

        const lat = parseFloat(latitude as string);
        const lng = parseFloat(longitude as string);


        const violations = await Violation.find({
            'location.latitude': lat,
            'location.longitude': lng
        }).populate('userId', 'firstName lastName email').select('-password');

        ctx.body = violations.map(v => ({
            id: v._id,
            description: v.description,
            category: v.category,
            photoUrl: v.photoUrl,
            dateTime: v.dateTime,
            location: v.location,
            user: v.userId
        }));
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при отриманні правопорушень за геолокацією', details: error.message };
    }
});

router.post('/', authMiddleware, validateDto(ViolationDto), async ctx => {
    try {
        const { description, category, photoUrl, dateTime, latitude, longitude } = ctx.request.body as ViolationDto;
        const userId = ctx.state.user.id;

        const violation = new Violation({
            description,
            category,
            photoUrl,
            dateTime: new Date(dateTime),
            location: {
                latitude,
                longitude
            },
            userId,
        });

        await violation.save();
        ctx.body = { 
            message: 'Правопорушення створено',
            violation: {
                id: violation._id,
                description: violation.description,
                category: violation.category,
                photoUrl: violation.photoUrl,
                dateTime: violation.dateTime,
                location: violation.location
            }
        };
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при створенні правопорушення', details: error.message };
    }
});

router.post('/sync', authMiddleware, validateDto(SyncViolationDto), async ctx => {
    try {
        console.log("sdadsadas")
        const { violations } = ctx.request.body as SyncViolationDto;
        const userId = ctx.state.user.id;
        const syncedViolations = [];

        for (const violationData of violations) {
            const { description, category, photoUrl, dateTime, latitude, longitude } = violationData;
            
            const violation = new Violation({
                description,
                category,
                photoUrl,
                dateTime: new Date(dateTime),
                location: {
                    latitude,
                    longitude
                },
                userId,
            });

            await violation.save();
            syncedViolations.push({
                id: violation._id,
                description: violation.description,
                category: violation.category,
                photoUrl: violation.photoUrl,
                dateTime: violation.dateTime,
                location: violation.location
            });
        }

        ctx.body = {
            message: `Синхронізовано ${syncedViolations.length} правопорушень`,
            violations: syncedViolations
        };
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при синхронізації даних', details: error.message };
    }
});

router.get('/', async ctx => {
    try {
        const violations = await Violation.find()
            .populate('userId', 'firstName lastName email')
            .select('-password')
            .sort({ dateTime: -1 });
        
        ctx.body = violations.map(v => ({
            id: v._id,
            description: v.description,
            category: v.category,
            photoUrl: v.photoUrl,
            dateTime: v.dateTime,
            location: v.location,
            user: v.userId
        }));
    } catch (error: any) {
        ctx.status = 500;
        ctx.body = { error: 'Помилка при отриманні правопорушень', details: error.message };
    }
});

// Отримання правопорушення по ID
router.get('/:id', async ctx => {
    try {
        const { id } = ctx.params;

        const violation = await Violation.findById(id)
            .populate('userId', 'firstName lastName email')
            .select('-password');

        if (!violation) {
            ctx.status = 404;
            ctx.body = { error: 'Правопорушення не знайдено' };
            return;
        }

        ctx.body = {
            id: violation._id,
            description: violation.description,
            category: violation.category,
            photoUrl: violation.photoUrl,
            dateTime: violation.dateTime,
            location: violation.location,
            user: violation.userId
        };

    } catch (error: any) {
        ctx.status = 500;
        ctx.body = {
            error: 'Помилка при отриманні правопорушення',
            details: error.message
        };
    }
});



export default router;
