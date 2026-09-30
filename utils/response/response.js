class ResponseUtil {
    static successResponse(res, data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            status: "success",
            message,
            data,
        });
    }

    static errorResponse(res, message, statusCode = 500) {
        // Record error for observability/logging
        res.locals.errorMessage = message;
        return res.status(statusCode).json({
            status: "error",
            message,
        });
    }
}
module.exports = ResponseUtil;