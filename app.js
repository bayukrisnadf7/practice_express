const express = require("express");
const compression = require("compression");

const { swaggerUi, swaggerDocument } = require("./swagger/swagger");
const { globalLimiter } = require("./middleware/ratelimits/ratelimit.middleware");

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

const app = express();

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use(compression());
app.use(express.json());

app.use("/api/users", globalLimiter, userRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
