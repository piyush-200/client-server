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


const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    const port = Number(process.env.MAIL_PORT) || 587;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: port,
      secure: port === 465, // true for 465, false for 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verify SMTP connection and credentials
    await transporter.verify();
    console.log("SMTP connection verified successfully");

    // Send email
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    // Delivery diagnostics
    console.log("Email send request completed");
    console.log("Message ID:", info.messageId);
    console.log("Accepted recipients:", info.accepted);
    console.log("Rejected recipients:", info.rejected);
    console.log("SMTP response:", info.response);

    if (!info.accepted || info.accepted.length === 0) {
      throw new Error("SMTP server did not accept the recipient");
    }

    return info;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = mailSender;
