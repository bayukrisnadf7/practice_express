const prisma = require("../config/database");

class RouteRepository {
    static async create(data) {
        return await prisma.data_routes.create({
            data: {
                origin: data.origin,
                destination: data.destination,
                distance: Number(data.distance),
            },
        });
    }

    static async findById(id) {
        return await prisma.data_routes.findUnique({
            where: { id },
            include: {
                dataSchedules: true,
            },
        });
    }

    static async findByOriginDestination(origin, destination) {
        return await prisma.data_routes.findFirst({
            where: {
                origin: { equals: origin, mode: "insensitive" },
                destination: { equals: destination, mode: "insensitive" },
            },
        });
    }

    static async findAll(page, limit) {
        if (page && limit) {
            const skip = (page - 1) * limit;
            return await prisma.data_routes.findMany({
                skip,
                take: limit,
                orderBy: { origin: "asc" },
            });
        }

        return await prisma.data_routes.findMany({
            orderBy: { origin: "asc" },
        });
    }

    static async update(id, data) {
        const updateData = {};
        if (data.origin !== undefined) updateData.origin = data.origin;
        if (data.destination !== undefined) updateData.destination = data.destination;
        if (data.distance !== undefined) updateData.distance = Number(data.distance);

        return await prisma.data_routes.update({
            where: { id },
            data: updateData,
        });
    }

    static async delete(id) {
        return await prisma.data_routes.delete({
            where: { id },
        });
    }
}

module.exports = RouteRepository;