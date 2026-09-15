const UserRepository = require("../repositories/user.repositories.js");
const bcrypt = require("bcrypt");
const { redisClient } = require("../config/redis.js");
class UserService {

    static async findAll(page = 1, limit = 10) {
        const cacheKey = `users:${page}:${limit}`;

        // Check redis
        const cachedUsers = await redisClient.get(cacheKey)

        if(cachedUsers) {
            console.log("Cache hit")

            return JSON.parse(cachedUsers)
        } 

        // Chache miss
        console.log("Cache miss")

        // Query Database
        const users = await UserRepository.findAll(page, limit);

        await redisClient.setEx(
            cacheKey,
            60,
            JSON.stringify(users)
        )

        return users;
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
