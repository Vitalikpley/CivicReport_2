import 'reflect-metadata';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import cors from '@koa/cors';

import authRoutes from './routes/auth';
import violationRoutes from './routes/violations';

const app = new Koa();
const router = new Router();

mongoose.connect('mongodb://localhost:27017/civic_report_project')
    .then(() => {
        console.log('✅ MongoDB підключено');
    })
    .catch(err => console.error('❌ MongoDB помилка', err));

app.use(cors());
app.use(bodyParser());

router.use('/api/auth', authRoutes.routes());
router.use('/api/violations', violationRoutes.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log('🚀 Сервер запущено на http://localhost:3000');
});
