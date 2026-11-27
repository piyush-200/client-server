// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const mailSender = async (email, title, body) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//       secure: false,
//     });
//     let info = await transporter.sendMail({
//       from: `"StudyNotion" <${process.env.MAIL_USER}>`,
//       to: `${email}`,
//       subject: `${title}`,
//       html: `${body}`,
//     });
//     return info;
//   } catch (error) {
//     console.log(error.message);
//     return error.message;
//   }
// };

// module.exports = mailSender;
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const mailSender = async (email, title, body) => {
//   try {
//     let transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//       secure: false,
//     });
//     let info = await transporter.sendMail({
//       from: `"StudyNotion" <${process.env.MAIL_USER}>`,
//       to: `${email}`,
//       subject: `${title}`,
//       html: `${body}`,
//     });
//     return info;
//   } catch (error) {
//     console.log(error.message);
//     return error.message;
//   }
// };

// module.exports = mailSender;

const { Resend } = require("resend");
require("dotenv").config();

// Check whether the API key is available
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is missing from environment variables");
}

const resend = new Resend(apiKey);

const mailSender = async (email, title, body) => {
  try {
    if (!apiKey) {
      throw new Error("Resend API key is not configured");
    }

    const { data, error } = await resend.emails.send({
      from: "StudyNotion <onboarding@resend.dev>",
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      console.error("Resend Error:", {
        message: error.message,
        name: error.name,
        statusCode: error.statusCode,
      });

      throw new Error(error.message);
    }

    console.log("OTP Email sent successfully!");
    console.log("Email ID:", data?.id);

    return data;
  } catch (error) {
    console.error("MailSender Error:", error.message);
    throw error;
  }
};

module.exports = mailSender;










