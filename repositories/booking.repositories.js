const prisma = require("../config/database");

class BookingRepository {
    static async create(data) {
        return await prisma.data_booking.create({
            data: {
                user_id: data.user_id,
                schedule_id: data.schedule_id,
                seat_number: Number(data.seat_number),
                booking_status: data.booking_status || "booked",
            },
            include: {
                schedule: {
                    include: {
                        route: true,
                        vehicle: true,
                    },
                },
                user: {
                    select: {
                        user_id: true,
                        nama: true,
                        email: true,
                        no_hp: true,
                    },
                },
            },
        });
    }

    static async findById(id) {
        return await prisma.data_booking.findUnique({
            where: { id },
            include: {
                schedule: {
                    include: {
                        route: true,
                        vehicle: true,
                    },
                },
                user: {
                    select: {
                        user_id: true,
                        nama: true,
                        email: true,
                        no_hp: true,
                    },
                },
                dataPayments: true,
            },
        });
    }

    static async findByScheduleAndSeat(schedule_id, seat_number) {
        return await prisma.data_booking.findFirst({
            where: {
                schedule_id,
                seat_number: Number(seat_number),
                booking_status: {
                    not: "cancelled",
                },
            },
        });
    }

    static async findAll(page, limit, filter = {}) {
        const where = {};
        if (filter.user_id) where.user_id = filter.user_id;
        if (filter.schedule_id) where.schedule_id = filter.schedule_id;
        if (filter.booking_status) where.booking_status = filter.booking_status;

        const options = {
            where,
            include: {
                schedule: {
                    include: {
                        route: true,
                        vehicle: true,
                    },
                },
                user: {
                    select: {
                        user_id: true,
                        nama: true,
                        email: true,
                        no_hp: true,
                    },
                },
                dataPayments: true,
            },
            orderBy: { created_at: "desc" },
        };

        if (page && limit) {
            options.skip = (page - 1) * limit;
            options.take = limit;
        }

        return await prisma.data_booking.findMany(options);
    }

    static async update(id, data) {
        const updateData = {};
        if (data.seat_number !== undefined) updateData.seat_number = Number(data.seat_number);
        if (data.booking_status !== undefined) updateData.booking_status = data.booking_status;

        return await prisma.data_booking.update({
            where: { id },
            data: updateData,
            include: {
                schedule: {
                    include: {
                        route: true,
                        vehicle: true,
                    },
                },
                user: {
                    select: {
                        user_id: true,
                        nama: true,
                        email: true,
                        no_hp: true,
                    },
                },
                dataPayments: true,
            },
        });
    }

    static async delete(id) {
        return await prisma.data_booking.delete({
            where: { id },
        });
    }
}

module.exports = BookingRepository;
