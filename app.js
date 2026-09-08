require("dotenv").config();
const express = require('express');
const app = express();
const compression = require("compression");
const PORT = 3000;

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

app.use(compression());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
