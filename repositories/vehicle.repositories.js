const prisma = require("../config/database");

class VehicleRepository {
    static async create(data) {
        return await prisma.data_vehicles.create({
            data,
        });
    }

    static async findByPlateNumber(plate_number) {
        return await prisma.data_vehicles.findFirst({
            where: { plate_number },
            select: {
                id: true,
                plate_number: true,
                type: true,
                capacity: true,
            }
        });
    }

    static async findAll(page, limit) {
        const skip = (page - 1) * limit;

        return await prisma.data_vehicles.findMany({
            skip,
            take: limit,
            orderBy: {
                plate_number: "asc",
            },
            select: {
                id: true,
                plate_number: true,
                type: true,
                capacity: true,
            }
        });
    }
    
    static async update(id, data) {
        return await prisma.data_vehicles.update({
            where: { id },
            data,
        });
    }

    static async delete(id) {
        return await prisma.data_vehicles.delete({
            where: { id },
        });
    }
}

module.exports = VehicleRepository;