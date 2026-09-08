const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/user.repositories");
const jwtUtil = require("../utils/jwt/jwt");

class AuthService {
    static async login(email, password) {
        const user = await UserRepository.findByEmail(email);

        if (!user) {
            throw new Error("Email atau password salah")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Email atau password salah");
        }

        const payload = {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
        };

        const token = jwtUtil.generateToken(payload);

        return {
            user: payload,
            token,
        };
    }
}

module.exports = AuthService;