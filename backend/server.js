const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);