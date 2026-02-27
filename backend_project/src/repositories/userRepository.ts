import { User } from '../models/User';

export class UserRepository {
    async findByEmail(email: string) {
        return await User.findOne({email});
    }

    async create(userData: any) {
        const user = new User(userData);
        return await user.save();
    }
}

export const userRepository = new UserRepository();