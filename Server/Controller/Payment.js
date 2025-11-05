const { instance } = require("../Configuration/Razorpay");
const Course = require("../Model/Course");
const crypto = require("crypto");
const User = require("../Model/User");
const mailSender = require("../Util/MailSender");
const mongoose = require("mongoose");
const {
  courseEnrollmentEmail,
} = require("../Mail/Template/CourseEnrollmentEmail");
const { paymentSuccessEmail } = require("../Mail/Template/PaymentSuccessEmail");
const CourseProgress = require("../Model/CourseProgress");

exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (!courses.length) {
    return res.json({ success: false, message: "Please Provide Course ID" });
  }
  let total_amount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }
      total_amount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    res.json({
      success: true,
      data: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("Body:", body);
  // console.log("Expected Signature:", expectedSignature);
  // console.log("Received Signature:", razorpay_signature);
  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  try {
    // Fetch user once and check for already enrolled courses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    for (const courseId of courses) {
      // Avoid duplicate enrollment
      if (user.courses.map(id => id.toString()).includes(courseId.toString())) {
        console.log(`User already enrolled in course: ${courseId}`);
        continue;
      }

      console.log("Enrolling user:", userId, "in course:", courseId);
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        console.log(`Course not found: ${courseId}`);
        continue;
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });


      // Add courseId and courseProgress._id to arrays if not present
      if (!user.courses.map(id => id.toString()).includes(courseId.toString())) {
        user.courses.push(courseId);
        user.markModified('courses');
      }
      if (!user.courseProgress.map(id => id.toString()).includes(courseProgress._id.toString())) {
        user.courseProgress.push(courseProgress._id);
        user.markModified('courseProgress');
      }
      // Save user after all updates
      await user.save();
      console.log("User's courses after update:", user.courses);

      const emailResponse = await mailSender(
        user.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${user.firstName} ${user.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    }
    return res.status(200).json({
      success: true,
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
};
