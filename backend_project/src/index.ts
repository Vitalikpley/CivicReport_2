import 'reflect-metadata';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { connectDB } from './config/database'
import authRoutes from './routes/auth';
import violationRoutes from './routes/violations';

const app = new Koa();
const router = new Router();

app.use(cors());
app.use(bodyParser());

router.use('/api/auth', authRoutes.routes());
router.use('/api/violations', violationRoutes.routes());

app.use(router.routes()).use(router.allowedMethods());



connectDB().then(() => {
    app.listen(3000, () => {
        console.log('🚀 Сервер запущено на http://localhost:3000');
    });
});

