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
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: Number(process.env.MAIL_PORT) === 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = mailSender;
