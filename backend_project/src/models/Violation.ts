import mongoose from 'mongoose';

// Схема правопорушення
const violationSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

// Індекси для швидкого пошуку
violationSchema.index({ dateTime: 1 });
violationSchema.index({ userId: 1 });

export const Violation = mongoose.model('Violation', violationSchema);
