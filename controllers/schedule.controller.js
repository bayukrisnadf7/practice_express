const ScheduleService = require("../services/schedule.service");
const { successResponse, errorResponse } = require("../utils/response/response");

class ScheduleController {
    static async create(req, res) {
        try {
            const schedule = await ScheduleService.create(req.body);
            return successResponse(res, schedule, "Success add schedule", 201);
        } catch (error) {
            let statusCode = 500;
            if (error.message.includes("not found")) statusCode = 404;
            else if (error.message.includes("must be later")) statusCode = 400;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async findAll(req, res) {
        try {
            const page = req.query.page ? Number(req.query.page) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const filter = {
                status: req.query.status,
                route_id: req.query.route_id,
                vehicle_id: req.query.vehicle_id,
            };

            const schedules = await ScheduleService.findAll(page, limit, filter);
            return successResponse(res, schedules, "Success get all schedules");
        } catch (error) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async findById(req, res) {
        try {
            const schedule = await ScheduleService.findById(req.params.id);
            return successResponse(res, schedule, "Success get schedule by id");
        } catch (error) {
            const statusCode = error.message === "Schedule not found" ? 404 : 500;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async update(req, res) {
        try {
            const schedule = await ScheduleService.update(req.params.id, req.body);
            return successResponse(res, schedule, "Success update schedule");
        } catch (error) {
            let statusCode = 500;
            if (error.message.includes("not found")) statusCode = 404;
            return errorResponse(res, error.message, statusCode);
        }
    }

    static async delete(req, res) {
        try {
            const schedule = await ScheduleService.delete(req.params.id);
            return successResponse(res, schedule, "Success delete schedule");
        } catch (error) {
            const statusCode = error.message === "Schedule not found" ? 404 : 500;
            return errorResponse(res, error.message, statusCode);
        }
    }
}

module.exports = ScheduleController;
