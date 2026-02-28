import { Violation } from '../models/Violation';

export class ViolationRepository {
    async getDistinctDates(status?: string) {
        const query = status ? { status } : {};
        return await Violation.distinct('dateTime', query);
    }

    async findByDateRange(startDate: Date, endDate: Date, status?: string) {
        const query: any = {
            dateTime: { $gte: startDate, $lte: endDate }
        };
        if (status) {
            query.status = status;
        }
        return await Violation.find(query)
            .populate('userId', 'firstName lastName email')
            .select('-password');
    }

    // async findAllLocations() {
    //     return await Violation.find({}, 'location').lean();
    // }
    //
    // async findByLocation(latitude: number, longitude: number) {
    //     return await Violation.find({
    //         'location.latitude': latitude,
    //         'location.longitude': longitude
    //     }).populate('userId', 'firstName lastName email').select('-password');
    // }

    async create(data: any) {

        const violation = new Violation(data);
        return await violation.save();
    }

    async findAll(status?: string) {
        const query = status ? { status } : {};
        return await Violation.find(query)
            .populate('userId', 'firstName lastName email')
            .select('-password')
            .sort({ dateTime: -1 });
    }

    async findById(id: string, status?: string) {
        const query: any = { _id: id };

        if (status) {
            query.status = status;
        }

        return await Violation.findOne(query)
            .populate('userId', 'firstName lastName email')
            .select('-password');
    }

    async setStatus(id: string, status: 'approved' | 'rejected') {
        return Violation.findByIdAndUpdate(id, { status }, { new: true })
            .populate('userId', 'firstName lastName email')
            .exec();
    }

}

export const violationRepository = new ViolationRepository();