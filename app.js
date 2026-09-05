const express = require('express');
const app = express();
const PORT = 3000;

const userRoutes = require("./routes/user.route");

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
