const UserRepository = require("../repositories/user.repositories.js");

class UserService {

    static async create(data) {

        // Business logic bisa ditaruh di sini
        const existingUser = await UserRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error("Email sudah digunakan");
        }

        return await UserRepository.create(data);
    }

    static async findAll() {
        return await UserRepository.findAll();
    }

    static async findById(id) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        return user;
    }

    static async update(id, data) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        return await UserRepository.update(id, data);
    }

    static async delete(id) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        await UserRepository.delete(id);

        return user;
    }
}

module.exports = UserService;
