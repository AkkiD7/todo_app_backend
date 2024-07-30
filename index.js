const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./config/swagger.js");
const bodyParser = require("body-parser");
const todoRoutes = require("./routes/todos");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6000;

const corsOptions = {
  origin: "https://todo-app-frontend-five-woad.vercel.app",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Welcome To The Todo Application");
});
app.use("/todos", todoRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
