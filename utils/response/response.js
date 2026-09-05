class ResponseUtil {
    static successResponse(res, data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            status: "success",
            message,
            data,
        });
    }

    static errorResponse(res, message, statusCode = 500) {
        return res.status(statusCode).json({
            status: "error",
            message,
        });
    }
}
module.exports = ResponseUtil;