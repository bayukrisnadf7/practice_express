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

    static async findAll(page, limit) {
        const skip = (page - 1) * limit;
        
        return await prisma.data_user.findMany({
            skip,
            take: limit,
            orderBy: {
                created_at: "desc",
            },
            select: {
                user_id: true,
                nama: true,
                email: true,
                no_hp: true,
                jenis_kelamin: true,
                role: true,
                created_at: true,
            }
        });
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
