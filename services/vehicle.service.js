const VehicleRepository = require("../repositories/vehicle.repositories.js");

class VehicleService {
    static async create(data) {
        return await VehicleRepository.create(data);
    }

    static async findByPlateNumber(plate_number) {
        const vehicle = await VehicleRepository.findByPlateNumber(plate_number);

        if(!vehicle) {
            throw new Error("Vehicle not found");
        }

        return vehicle;
    }

    static async findAll(page, limit) {
        return await VehicleRepository.findAll(page, limit);
    }

    static async update(id, data) {
        return await VehicleRepository.update(id, data);
    }

    static async delete(id) {
        return await VehicleRepository.delete(id);
    }
}

module.exports = VehicleService;