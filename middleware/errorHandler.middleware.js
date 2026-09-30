const { errorResponse } = require("../utils/response/response");

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = statusCode === 500 ? "Internal server error" : err.message;

    // Attach to res.locals for requestLogger and observability
    res.locals.error = err;
    res.locals.errorMessage = err.message;

    return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
