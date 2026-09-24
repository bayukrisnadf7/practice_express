const ScheduleRepository = require("../repositories/schedule.repositories");
const RouteRepository = require("../repositories/route.repositories");
const VehicleRepository = require("../repositories/vehicle.repositories");

class ScheduleService {
    static async create(data) {
        // Verify route exists
        const route = await RouteRepository.findById(data.route_id);
        if (!route) {
            throw new Error("Route not found");
        }

        // Verify vehicle exists
        const vehicle = await VehicleRepository.findByPlateNumber(data.vehicle_id) || 
            await (async () => {
                // If vehicle_id is an ID
                const prisma = require("../config/database");
                return await prisma.data_vehicles.findUnique({ where: { id: data.vehicle_id } });
            })();

        if (!vehicle) {
            throw new Error("Vehicle not found");
        }

        // Use valid vehicle ID if plate number was passed
        data.vehicle_id = vehicle.id;

        return await ScheduleRepository.create(data);
    }

    static async findAll(page, limit, filter) {
        return await ScheduleRepository.findAll(page, limit, filter);
    }

    static async findById(id) {
        const schedule = await ScheduleRepository.findById(id);
        if (!schedule) {
            throw new Error("Schedule not found");
        }
        return schedule;
    }

    static async update(id, data) {
        const existingSchedule = await ScheduleRepository.findById(id);
        if (!existingSchedule) {
            throw new Error("Schedule not found");
        }

        if (data.route_id) {
            const route = await RouteRepository.findById(data.route_id);
            if (!route) {
                throw new Error("Route not found");
            }
        }

        if (data.vehicle_id) {
            const prisma = require("../config/database");
            const vehicle = await prisma.data_vehicles.findUnique({ where: { id: data.vehicle_id } });
            if (!vehicle) {
                throw new Error("Vehicle not found");
            }
        }

        return await ScheduleRepository.update(id, data);
    }

    static async delete(id) {
        const existingSchedule = await ScheduleRepository.findById(id);
        if (!existingSchedule) {
            throw new Error("Schedule not found");
        }

        return await ScheduleRepository.delete(id);
    }
}

module.exports = ScheduleService;
