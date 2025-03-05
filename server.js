const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db.js');
const functionRoutes = require("./routes/functionRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/functions", functionRoutes);
app.use("/services", serviceRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});