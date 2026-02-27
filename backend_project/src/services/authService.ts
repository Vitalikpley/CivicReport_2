import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { RegisterDto } from '../dto/RegisterDto';
import { LoginDto } from '../dto/LoginDto';

const SECRET = 'secret123';

export class AuthService {
    async register(data: RegisterDto) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('USER_EXISTS');
        }

        const hash = await bcrypt.hash(data.password, 10);
        await userRepository.create({ ...data, password: hash });
    }

    async login(data: LoginDto) {
        const user = await userRepository.findByEmail(data.email);

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const token = jwt.sign({ id: user._id }, SECRET);
        return { token, user };
    }
}

export const authService = new AuthService();