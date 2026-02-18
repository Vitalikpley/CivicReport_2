import mongoose from 'mongoose';

// Схема користувача
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
