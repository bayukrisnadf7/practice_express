const crypto = require("crypto");

const requestLogger = (req, res, next) => {
    const requestId = req.headers["x-request-id"] || crypto.randomUUID();

    const startTime = new Date();
    const start = process.hrtime.bigint();

    req.requestId = requestId;
    res.setHeader("X-Request-Id", requestId);

    // Skip verbose logging for Prometheus scrape endpoint
    if (req.originalUrl === "/metrics") {
        return next();
    }

    res.on("finish", () => {
        const endTime = new Date();
        const end = process.hrtime.bigint();

        const duration = Number(end - start) / 1_000_000;
        const statusCode = res.statusCode;

        let level = "info";
        if (statusCode >= 500) {
            level = "error";
        } else if (statusCode >= 400) {
            level = "warn";
        }

        const logPayload = {
            level,
            timestamp: endTime.toISOString(),
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: statusCode,
            durationMs: Number(duration.toFixed(2)),
            ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.ip,
            userAgent: req.get("user-agent"),
            contentLength: res.get("content-length") || 0,
        };

        // Capture error detail if any
        if (res.locals.errorMessage) {
            logPayload.error = res.locals.errorMessage;
        }

        if (statusCode >= 500 && res.locals.error?.stack) {
            logPayload.stack = res.locals.error.stack;
        }

        if (level === "error") {
            console.error(JSON.stringify(logPayload));
        } else if (level === "warn") {
            console.warn(JSON.stringify(logPayload));
        } else {
            console.log(JSON.stringify(logPayload));
        }
    });

    next();
};

module.exports = requestLogger;