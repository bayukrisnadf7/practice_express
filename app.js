const express = require("express");
const compression = require("compression");

const { swaggerUi, swaggerDocument } = require("./swagger/swagger");
const { globalLimiter } = require("./middleware/ratelimit.middleware");

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const vehicleRoutes = require("./routes/vehicle.route");
const requestLogger = require("./middleware/requestLogger.middleware");

const app = express();

app.use(requestLogger);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "OK",
    });
});
app.use(compression());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

module.exports = app;
