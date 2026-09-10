const UserRepository = require("../repositories/user.repositories.js");
const bcrypt = require("bcrypt");

class UserService {

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

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const updateData = {
            ...data,
            password: hashedPassword,
        }

        return await UserRepository.update(id, updateData);
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
