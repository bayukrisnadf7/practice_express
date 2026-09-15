require("dotenv").config();

const bcrypt = require("bcrypt");
const prisma = require("../../config/database");

async function seedUsers() {
    const password = await bcrypt.hash("Password123!", 10);

    const users = Array.from({ length: 100 }, (_, index) => ({
        nama: `User ${index + 1}`,
        email: `user${index + 1}@example.com`,
        password,
        no_hp: `081234567${String(index + 1).padStart(3, "0")}`,
        jenis_kelamin: index % 2 === 0 ? "L" : "P",
        role: "user",
    }));

    await prisma.data_user.createMany({
        data: users,
        skipDuplicates: true,
    });

    console.log("100 dummy users berhasil dibuat");
}

seedUsers()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });