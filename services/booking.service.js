const BookingRepository = require("../repositories/booking.repositories");
const ScheduleRepository = require("../repositories/schedule.repositories");

class BookingService {
    static async create(data, user) {
        // Assign user_id from token if not provided or if non-admin
        const userId = (user.role === "admin" && data.user_id) ? data.user_id : user.user_id;

        // Verify schedule exists
        const schedule = await ScheduleRepository.findById(data.schedule_id);
        if (!schedule) {
            throw new Error("Schedule not found");
        }

        if (schedule.status !== "active") {
            throw new Error("Schedule is not active");
        }

        // Verify seat number does not exceed vehicle capacity
        if (schedule.vehicle && Number(data.seat_number) > schedule.vehicle.capacity) {
            throw new Error(`Seat number exceeds vehicle capacity of ${schedule.vehicle.capacity}`);
        }

        // Verify seat is not already booked
        const existingBooking = await BookingRepository.findByScheduleAndSeat(
            data.schedule_id,
            data.seat_number
        );

        if (existingBooking) {
            throw new Error(`Seat number ${data.seat_number} is already booked for this schedule`);
        }

        return await BookingRepository.create({
            ...data,
            user_id: userId,
        });
    }

    static async findAll(page, limit, filter, user) {
        // Non-admin can only see their own bookings
        const queryFilter = { ...filter };
        if (user.role !== "admin") {
            queryFilter.user_id = user.user_id;
        }

        return await BookingRepository.findAll(page, limit, queryFilter);
    }

    static async findById(id, user) {
        const booking = await BookingRepository.findById(id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        // Non-admin can only view their own booking
        if (user.role !== "admin" && booking.user_id !== user.user_id) {
            throw new Error("You do not have permission to view this booking");
        }

        return booking;
    }

    static async update(id, data, user) {
        const booking = await BookingRepository.findById(id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (user.role !== "admin" && booking.user_id !== user.user_id) {
            throw new Error("You do not have permission to update this booking");
        }

        if (data.seat_number && data.seat_number !== booking.seat_number) {
            const schedule = booking.schedule;
            if (schedule && schedule.vehicle && Number(data.seat_number) > schedule.vehicle.capacity) {
                throw new Error(`Seat number exceeds vehicle capacity of ${schedule.vehicle.capacity}`);
            }

            const seatTaken = await BookingRepository.findByScheduleAndSeat(
                booking.schedule_id,
                data.seat_number
            );

            if (seatTaken && seatTaken.id !== id) {
                throw new Error(`Seat number ${data.seat_number} is already booked for this schedule`);
            }
        }

        return await BookingRepository.update(id, data);
    }

    static async cancel(id, user) {
        const booking = await BookingRepository.findById(id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        if (user.role !== "admin" && booking.user_id !== user.user_id) {
            throw new Error("You do not have permission to cancel this booking");
        }

        if (booking.booking_status === "cancelled") {
            throw new Error("Booking is already cancelled");
        }

        return await BookingRepository.update(id, { booking_status: "cancelled" });
    }

    static async delete(id) {
        const booking = await BookingRepository.findById(id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        return await BookingRepository.delete(id);
    }
}

module.exports = BookingService;
