const prisma = require("../config/database");

class PaymentRepository {
    static async create(data) {
        return await prisma.data_payment.create({
            data: {
                booking_id: data.booking_id,
                payment_method: data.payment_method,
                amount: Number(data.amount),
                transaction_id: data.transaction_id,
                payment_date: data.payment_date ? new Date(data.payment_date) : new Date(),
            },
            include: {
                booking: {
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
                            },
                        },
                    },
                },
            },
        });
    }

    static async findById(id) {
        return await prisma.data_payment.findUnique({
            where: { id },
            include: {
                booking: {
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
                            },
                        },
                    },
                },
            },
        });
    }

    static async findByBookingId(booking_id) {
        return await prisma.data_payment.findMany({
            where: { booking_id },
            include: {
                booking: true,
            },
            orderBy: { payment_date: "desc" },
        });
    }

    static async findAll(page, limit) {
        const options = {
            include: {
                booking: {
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
                            },
                        },
                    },
                },
            },
            orderBy: { payment_date: "desc" },
        };

        if (page && limit) {
            options.skip = (page - 1) * limit;
            options.take = limit;
        }

        return await prisma.data_payment.findMany(options);
    }

    static async delete(id) {
        return await prisma.data_payment.delete({
            where: { id },
        });
    }
}

module.exports = PaymentRepository;
