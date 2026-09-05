const User = require("../models/user.model");

class UserRepository {

    static async create(data) {
        return await User.create(data);
    }

    static async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    static async findAll() {
        return await User.findAll();
    }

    static async findById(id) {
        return await User.findByPk(id);
    }

    static async update(id, data) {
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        await user.update(data);

        return user;
    }

    static async delete(id) {
        const user = await User.findByPk(id);

        if (!user) {
            return null;
        }

        await user.destroy();

        return user;
    }
}

module.exports = UserRepository;
