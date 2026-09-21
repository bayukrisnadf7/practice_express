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

    static async register(data){
        const existingUser = await UserRepository.findByEmail(data.email);

        if (existingUser) {
            throw new Error("Email sudah digunakan");
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const totalStart = process.hrtime.bigint();
        const hashStart = process.hrtime.bigint();

        const hashEnd = process.hrtime.bigint();

        const dbStart = process.hrtime.bigint();

        const dbEnd = process.hrtime.bigint();

        const totalEnd = process.hrtime.bigint();

        const hashTime = Number(hashEnd - hashStart) / 1_000_000;
        const dbTime = Number(dbEnd - dbStart) / 1_000_000;
        const totalTime = Number(totalEnd - totalStart) / 1_000_000;

       console.log(`Hash time: ${hashTime.toFixed(2)} ms`);
        console.log(`DB time: ${dbTime.toFixed(2)} ms`);
        console.log(`Total time: ${totalTime.toFixed(2)} ms`);

        const userData = {
            ...data,
            password: hashedPassword,
        };

        const user = await UserRepository.create(userData);

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