// server.js
const express = require("express");
const axios = require("axios"); // ✅ use require for consistency
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Import configs
const database = require("./Configuration/Database");
const { cloudinaryConnect } = require("./Configuration/Cloudinary");

// Import routes
const userRoutes = require("./Route/User");
const profileRoutes = require("./Route/Profile");
const courseRoutes = require("./Route/Course");
const paymentRoutes = require("./Route/Payment");
const contactUsRoute = require("./Route/Contact");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();

// Connect to DB
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Proper CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev server
      "https://client-server-20043.onrender.com" // Deployed frontend
    ],
    credentials: true,
  })
);

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cloudinary connect
cloudinaryConnect();

// ✅ Mount routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Test route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Welcome To StudyNotion 🚀",
  });
});

// 🔥 Keep Render instance awake
const url = "https://client-server-20043.onrender.com"; // replace with your backend URL if needed
const interval = 300000; // 5 minutes (300,000 ms)

function reloadWebsite() {
  axios
    .get(url)
    .then(() => {
      console.log("Website pinged successfully");
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);

// Start server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

