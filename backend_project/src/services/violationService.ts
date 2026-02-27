import { violationRepository } from '../repositories/violationRepository';
import { ViolationDto, SyncViolationDto } from '../dto/ViolationDto';

export class ViolationService {
    private formatViolation(v: any) {
        return {
            id: v._id,
            description: v.description,
            category: v.category,
            photoUrl: v.photoUrl,
            dateTime: v.dateTime,
            location: v.location,
            user: v.userId
        };
    }

    async getUniqueDates() {
        const dates = await violationRepository.getDistinctDates();
        const uniqueDates = [...new Set(
            dates.map((date: any) => {
                const d = new Date(date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            })
        )].sort();
        return uniqueDates;
    }

    async getViolationsByDate(dateString: string) {
        const startDate = new Date(dateString);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateString);
        endDate.setHours(23, 59, 59, 999);

        const violations = await violationRepository.findByDateRange(startDate, endDate);
        return violations.map(this.formatViolation);
    }

    async getUniqueLocations() {
        const violations = await violationRepository.findAllLocations();
        const locations = violations.map((v: any) => ({
            latitude: v.location?.latitude,
            longitude: v.location?.longitude
        }));

        return [...new Set(locations.map(loc => `${loc.latitude},${loc.longitude}`))];
    }

    async getViolationsByLocation(lat: number, lng: number) {
        const violations = await violationRepository.findByLocation(lat, lng);
        return violations.map(this.formatViolation);
    }

    async createViolation(data: ViolationDto, userId: string) {
        const violation = await violationRepository.create({
            ...data,
            dateTime: new Date(data.dateTime),
            location: { latitude: data.latitude, longitude: data.longitude },
            userId
        });

        return {
            id: violation._id,
            description: violation.description,
            category: violation.category,
            photoUrl: violation.photoUrl,
            dateTime: violation.dateTime,
            location: violation.location
        };
    }

    async syncViolations(violationsData: any[], userId: string) {
        const syncedViolations = [];
        for (const data of violationsData) {
            const violation = await this.createViolation(data, userId);
            syncedViolations.push(violation);
        }
        return syncedViolations;
    }

    async getAllViolations() {
        const violations = await violationRepository.findAll();
        return violations.map(this.formatViolation);
    }

    async getViolationById(id: string) {
        const violation = await violationRepository.findById(id);
        if (!violation) {
            throw new Error('NOT_FOUND');
        }
        return this.formatViolation(violation);
    }
}

export const violationService = new ViolationService();