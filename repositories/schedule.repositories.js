const prisma = require("../config/database");

class ScheduleRepository {
    static async create(data) {
        return await prisma.data_schedule.create({
            data: {
                route_id: data.route_id,
                vehicle_id: data.vehicle_id,
                departure_at: new Date(data.departure_at),
                arrival_at: new Date(data.arrival_at),
                status: data.status || "active",
            },
            include: {
                route: true,
                vehicle: true,
            },
        });
    }

    static async findById(id) {
        return await prisma.data_schedule.findUnique({
            where: { id },
            include: {
                route: true,
                vehicle: true,
                dataBookings: {
                    select: {
                        id: true,
                        seat_number: true,
                        booking_status: true,
                    },
                },
            },
        });
    }

    static async findAll(page, limit, filter = {}) {
        const where = {};
        if (filter.status) where.status = filter.status;
        if (filter.route_id) where.route_id = filter.route_id;
        if (filter.vehicle_id) where.vehicle_id = filter.vehicle_id;

        const options = {
            where,
            include: {
                route: true,
                vehicle: true,
            },
            orderBy: { departure_at: "asc" },
        };

        if (page && limit) {
            options.skip = (page - 1) * limit;
            options.take = limit;
        }

        return await prisma.data_schedule.findMany(options);
    }

    static async update(id, data) {
        const updateData = {};
        if (data.route_id !== undefined) updateData.route_id = data.route_id;
        if (data.vehicle_id !== undefined) updateData.vehicle_id = data.vehicle_id;
        if (data.departure_at !== undefined) updateData.departure_at = new Date(data.departure_at);
        if (data.arrival_at !== undefined) updateData.arrival_at = new Date(data.arrival_at);
        if (data.status !== undefined) updateData.status = data.status;

        return await prisma.data_schedule.update({
            where: { id },
            data: updateData,
            include: {
                route: true,
                vehicle: true,
            },
        });
    }

    static async delete(id) {
        return await prisma.data_schedule.delete({
            where: { id },
        });
    }
}

module.exports = ScheduleRepository;
