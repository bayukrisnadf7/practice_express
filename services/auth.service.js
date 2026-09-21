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

    static async register(data) {
        const checkEmail = process.hrtime.bigint();
        const existingUser = await UserRepository.findByEmail(data.email);
        const checkEmailEnd = process.hrtime.bigint();
        const emailTime = Number(checkEmailEnd - checkEmail) / 1_000_000;
        console.log(`Check email time: ${emailTime.toFixed(2)} ms`);

        if (existingUser) {
            throw new Error("Email sudah digunakan");
        }

        const hashStart = process.hrtime.bigint();
        const hashedPassword = await bcrypt.hash(data.password, 8);
        const hashEnd = process.hrtime.bigint();

        const userData = {
            ...data,
            password: hashedPassword,
        };

        const dbStart = process.hrtime.bigint();
        const user = await UserRepository.create(userData);
        const dbEnd = process.hrtime.bigint();

        const hashTime = Number(hashEnd - hashStart) / 1_000_000;
        const dbTime = Number(dbEnd - dbStart) / 1_000_000;

        console.log(`Hash time: ${hashTime.toFixed(2)} ms`);
        console.log(`DB time: ${dbTime.toFixed(2)} ms`);

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