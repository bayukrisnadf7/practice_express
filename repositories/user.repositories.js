const prisma = require("../config/database");

class UserRepository {

    static async create(data) {
        return await prisma.data_user.create({
            data,
        });
    }

    static async findByEmail(email) {
        return await prisma.data_user.findUnique({
            where: { email },
        });
    }

    static async findAll() {
        return await prisma.data_user.findMany();
    }

    static async findById(id) {
        return await prisma.data_user.findUnique({
            where: { user_id: id },
        });
    }

    static async update(id, data) {
        return await prisma.data_user.update({
            where: { user_id: id },
            data,
        });
    }

    static async delete(id) {
        return await prisma.data_user.delete({
            where: { user_id: id },
        });
    }
}

module.exports = UserRepository;
