// Profile routes for user actions
const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../Middleware/Auth");
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../Controller/Profile");

// Delete user profile
router.delete("/deleteProfile", auth, deleteAccount);
// Update user profile
router.put("/updateProfile", auth, updateProfile);
// Get all user details
router.get("/getUserDetails", auth, getAllUserDetails);
// Get all enrolled courses for a user
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
// Update display picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
// Instructor dashboard
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;

