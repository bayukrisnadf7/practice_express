require("dotenv").config();

const app = require("./app");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
