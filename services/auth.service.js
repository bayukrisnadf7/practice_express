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

        const totalStart = performance.now();
        const hashStart = performance.now();
        const hashTime = performance.now() - hashStart;

        const dbStart = performance.now();
        const dbTime = performance.now() - dbStart;

        const totalTime = performance.now() - totalStart;

        console.log("Hash time: ", hashTime);
        console.log("DB time: ", dbTime);
        console.log("Total time: ", totalTime);

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