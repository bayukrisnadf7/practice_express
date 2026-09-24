const crypto = require("crypto");

const requestLogger = (req, res, next) => {
    const requestId = crypto.randomUUID();

    const startTime = new Date();
    const start = process.hrtime.bigint();

    req.requestId = requestId;

    res.on("finish", () => {
        const endTime = new Date();
        const end = process.hrtime.bigint();

        const duration = Number(end - start) / 1_000_000;

        console.log({
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
            durationMs: Number(duration.toFixed(2)),
            contentLength: res.get("content-length") || 0,
        });
    });

    next();
};

module.exports = requestLogger;