import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/civic_report_project');
        console.log('✅ MongoDB підключено');
    } catch (err) {
        console.error('❌ MongoDB помилка', err);
    }
};