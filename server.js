const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db.js');
const functionRoutes = require("./routes/functionRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const commentRoutes = require("./routes/commentRoutes")
const userRoutes = require("./routes/userRoutes")
const matchRoutes = require("./routes/matchRoutes")
const dotenv = require("dotenv").config();

const PORT = process.env.PORT || 5000;

connectDB();

const app = express();
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://duplicidades-sedesa.netlify.app',
    'http://localhost:5173'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors())
app.use(express.json());

app.use("/functions", functionRoutes);
app.use("/services", serviceRoutes);
app.use("/comments",commentRoutes);
app.use("/users",userRoutes);
app.use("/matches", matchRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});