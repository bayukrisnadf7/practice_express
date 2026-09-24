require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma = require("../../config/database");

async function seed() {
    console.log("Starting database seeding...\n");

    const defaultPassword = await bcrypt.hash("Password123!", 8);

    // 1. Seed Users (Ensure Admin & Standard Test Users exist)
    console.log("1. Seeding Users...");
    const adminUser = await prisma.data_user.upsert({
        where: { email: "admin@gmail.com" },
        update: { role: "admin" },
        create: {
            nama: "Admin",
            email: "admin@gmail.com",
            password: defaultPassword,
            no_hp: "0895399757207",
            jenis_kelamin: "laki-laki",
            role: "admin",
        },
    });
    console.log(`Admin user ready: ${adminUser.email} (Password: Password123!)`);

    const standardUser = await prisma.data_user.upsert({
        where: { email: "bayu@gmail.com" },
        update: { role: "users" },
        create: {
            nama: "Bayu Krisna",
            email: "bayu@gmail.com",
            password: defaultPassword,
            no_hp: "081234567890",
            jenis_kelamin: "laki-laki",
            role: "users",
        },
    });
    console.log(`   ✔ Regular test user ready: ${standardUser.email} (Password: Password123!)`);

    // Fetch sample users for bookings
    const sampleUsers = await prisma.data_user.findMany({
        take: 10,
        select: { user_id: true, email: true },
    });

    // 2. Seed Vehicles
    console.log("\n2. Seeding Vehicles...");
    const vehiclesData = [
        { plate_number: "B 7123 TAA", type: "Bus Executive", capacity: 30 },
        { plate_number: "B 7456 SBB", type: "Bus Sleeper Suite", capacity: 20 },
        { plate_number: "D 1902 KCC", type: "HiAce Shuttle Luxury", capacity: 12 },
        { plate_number: "L 8021 XDD", type: "Bus Double Decker", capacity: 45 },
        { plate_number: "AB 5512 YEE", type: "Elf Long Chasis", capacity: 16 },
        { plate_number: "DK 3319 ZFF", type: "Bus Royal VIP", capacity: 28 },
    ];

    const createdVehicles = [];
    for (const v of vehiclesData) {
        let vehicle = await prisma.data_vehicles.findFirst({
            where: { plate_number: v.plate_number },
        });

        if (!vehicle) {
            vehicle = await prisma.data_vehicles.create({
                data: v,
            });
        }
        createdVehicles.push(vehicle);
    }
    console.log(`${createdVehicles.length} vehicles seeded`);

    // 3. Seed Routes
    console.log("\n3. Seeding Routes...");
    const routesData = [
        { origin: "Jakarta", destination: "Bandung", distance: 152.5 },
        { origin: "Bandung", destination: "Jakarta", distance: 152.5 },
        { origin: "Jakarta", destination: "Yogyakarta", distance: 540.0 },
        { origin: "Jakarta", destination: "Surabaya", distance: 785.0 },
        { origin: "Yogyakarta", destination: "Surabaya", distance: 325.0 },
        { origin: "Surabaya", destination: "Denpasar", distance: 410.0 },
        { origin: "Semarang", destination: "Jakarta", distance: 440.0 },
        { origin: "Jakarta", destination: "Semarang", distance: 440.0 },
    ];

    const createdRoutes = [];
    for (const r of routesData) {
        let route = await prisma.data_routes.findFirst({
            where: {
                origin: { equals: r.origin, mode: "insensitive" },
                destination: { equals: r.destination, mode: "insensitive" },
            },
        });

        if (!route) {
            route = await prisma.data_routes.create({
                data: r,
            });
        }
        createdRoutes.push(route);
    }
    console.log(`${createdRoutes.length} routes seeded`);

    // 4. Seed Schedules
    console.log("\n4. Seeding Schedules...");
    const now = new Date();
    const schedulesToCreate = [
        // Schedule 1: Jakarta -> Bandung (Tomorrow Morning)
        {
            route_id: createdRoutes[0].id,
            vehicle_id: createdVehicles[0].id,
            departure_at: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // +1 day 08:00
            arrival_at: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),  // +1 day 11:00
            status: "active",
        },
        // Schedule 2: Bandung -> Jakarta (Tomorrow Afternoon)
        {
            route_id: createdRoutes[1].id,
            vehicle_id: createdVehicles[0].id,
            departure_at: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // +1 day 14:00
            arrival_at: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),  // +1 day 17:00
            status: "active",
        },
        // Schedule 3: Jakarta -> Yogyakarta (Tomorrow Night - Sleeper)
        {
            route_id: createdRoutes[2].id,
            vehicle_id: createdVehicles[1].id,
            departure_at: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000), // +1 day 19:00
            arrival_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),   // +2 day 04:00
            status: "active",
        },
        // Schedule 4: Jakarta -> Surabaya (Day after tomorrow - Double Decker)
        {
            route_id: createdRoutes[3].id,
            vehicle_id: createdVehicles[3].id,
            departure_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),  // +2 day 07:00
            arrival_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),  // +2 day 18:00
            status: "active",
        },
        // Schedule 5: Yogyakarta -> Surabaya (HiAce Shuttle)
        {
            route_id: createdRoutes[4].id,
            vehicle_id: createdVehicles[2].id,
            departure_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),  // +2 day 09:00
            arrival_at: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),  // +2 day 14:00
            status: "active",
        },
        // Schedule 6: Surabaya -> Denpasar (Royal VIP)
        {
            route_id: createdRoutes[5].id,
            vehicle_id: createdVehicles[5].id,
            departure_at: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // +3 day 16:00
            arrival_at: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),   // +4 day 06:00
            status: "active",
        },
    ];

    const createdSchedules = [];
    for (const s of schedulesToCreate) {
        const schedule = await prisma.data_schedule.create({
            data: s,
        });
        createdSchedules.push(schedule);
    }
    console.log(`${createdSchedules.length} schedules seeded`);

    // 5. Seed Bookings
    console.log("\n5. Seeding Bookings...");
    const bookingsData = [
        // Booking 1: Bayu booked Jakarta -> Bandung seat 1 (paid)
        {
            user_id: standardUser.user_id,
            schedule_id: createdSchedules[0].id,
            seat_number: 1,
            booking_status: "paid",
        },
        // Booking 2: Bayu booked Jakarta -> Bandung seat 2 (paid)
        {
            user_id: standardUser.user_id,
            schedule_id: createdSchedules[0].id,
            seat_number: 2,
            booking_status: "paid",
        },
        // Booking 3: Another user booked Jakarta -> Bandung seat 5 (booked / pending payment)
        {
            user_id: sampleUsers[0]?.user_id || standardUser.user_id,
            schedule_id: createdSchedules[0].id,
            seat_number: 5,
            booking_status: "booked",
        },
        // Booking 4: Bayu booked Jakarta -> Yogyakarta seat 7 (paid)
        {
            user_id: standardUser.user_id,
            schedule_id: createdSchedules[2].id,
            seat_number: 7,
            booking_status: "paid",
        },
        // Booking 5: Another user booked Jakarta -> Surabaya seat 10 (cancelled)
        {
            user_id: sampleUsers[1]?.user_id || standardUser.user_id,
            schedule_id: createdSchedules[3].id,
            seat_number: 10,
            booking_status: "cancelled",
        },
        // Booking 6: Another user booked Yogyakarta -> Surabaya seat 3 (paid)
        {
            user_id: sampleUsers[2]?.user_id || standardUser.user_id,
            schedule_id: createdSchedules[4].id,
            seat_number: 3,
            booking_status: "paid",
        },
    ];

    const createdBookings = [];
    for (const b of bookingsData) {
        const booking = await prisma.data_booking.create({
            data: b,
        });
        createdBookings.push(booking);
    }
    console.log(`${createdBookings.length} bookings seeded`);

    // 6. Seed Payments
    console.log("\n6. Seeding Payments...");
    const paymentsData = [
        // Payment for Booking 1
        {
            booking_id: createdBookings[0].id,
            payment_method: "transfer_bank",
            amount: 150000.0,
            transaction_id: `TRX-${Date.now()}-001`,
            payment_date: new Date(),
        },
        // Payment for Booking 2
        {
            booking_id: createdBookings[1].id,
            payment_method: "e_wallet",
            amount: 150000.0,
            transaction_id: `TRX-${Date.now()}-002`,
            payment_date: new Date(),
        },
        // Payment for Booking 4
        {
            booking_id: createdBookings[3].id,
            payment_method: "credit_card",
            amount: 350000.0,
            transaction_id: `TRX-${Date.now()}-003`,
            payment_date: new Date(),
        },
        // Payment for Booking 6
        {
            booking_id: createdBookings[5].id,
            payment_method: "qris",
            amount: 220000.0,
            transaction_id: `TRX-${Date.now()}-004`,
            payment_date: new Date(),
        },
    ];

    for (const p of paymentsData) {
        await prisma.data_payment.create({
            data: p,
        });
    }
    console.log(`   ✔ ${paymentsData.length} payments seeded`);

    console.log("\n All dummy data successfully seeded across all tables!");
}

seed()
    .catch((error) => {
        console.error(" Error while seeding database:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
