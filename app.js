const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./utils/connectDB");
const authRoutes = require("./routes/authRoutes");
const userRoutes=require('./routes/userRoutes.js')
const lessonRoutes = require("./routes/lessonRoutes.js");
// const audioRoutes = require("./routes/audioRoutes");
const authenticateJWT = require("./middleware/authMiddleware");



const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/lessons", authenticateJWT,lessonRoutes);
app.use("/api/user",authenticateJWT,userRoutes);
// app.use("/api/audio", audioRoutes);

const PORT = process.env.PORT || 4008;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
