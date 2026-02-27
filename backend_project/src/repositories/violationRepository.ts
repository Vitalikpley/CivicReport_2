import { Violation } from '../models/Violation';

export class ViolationRepository {
    async getDistinctDates() {
        return await Violation.distinct('dateTime');
    }

    async findByDateRange(startDate: Date, endDate: Date) {
        return await Violation.find({
            dateTime: { $gte: startDate, $lte: endDate }
        }).populate('userId', 'firstName lastName email').select('-password');
    }

    async findAllLocations() {
        return await Violation.find({}, 'location').lean();
    }

    async findByLocation(latitude: number, longitude: number) {
        return await Violation.find({
            'location.latitude': latitude,
            'location.longitude': longitude
        }).populate('userId', 'firstName lastName email').select('-password');
    }

    async create(data: any) {
        const violation = new Violation(data);
        return await violation.save();
    }

    async findAll() {
        return await Violation.find()
            .populate('userId', 'firstName lastName email')
            .select('-password')
            .sort({ dateTime: -1 });
    }

    async findById(id: string) {
        return await Violation.findById(id)
            .populate('userId', 'firstName lastName email')
            .select('-password');
    }
}

export const violationRepository = new ViolationRepository();