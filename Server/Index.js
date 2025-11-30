// server.js
const express = require("express");
const app = express();
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

// Connect to DB
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Proper CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:4000",               // React dev server
      "https://client-server-20043.onrender.com"     // Deployed frontend (Netlify/Vercel)
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
    message: "Welcome To StudyNotion",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});

