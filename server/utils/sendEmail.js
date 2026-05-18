// // import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS
// //   }
// // });

// // export const sendResetEmail = async (email, link) => {

// //   await transporter.sendMail({
// //     from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
// //     to: email,
// //     subject: "Password Reset",
// //     html: `
// //       <h2>Password Reset</h2>
// //       <p>Click below to reset your password:</p>
// //       <a href="${link}">${link}</a>
// //       <p>This link expires in 15 minutes.</p>
// //     `
// //   });

// // };

// import nodemailer from "nodemailer";

// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS  // 16-char App Password from Google Account settings
// //   }
// // });
// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// //debug
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("SMTP ERROR:", error);
//   } else {
//     console.log("SMTP SERVER READY");
//   }
// });

// export const sendResetEmail = async (email, link) => {

//   try {

//     const info = await transporter.sendMail({
//       from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Password Reset",
//       html: `
//         <h2>Password Reset</h2>
//         <p>Click below to reset your password:</p>
//         <a href="${link}">${link}</a>
//         <p>This link expires in 15 minutes.</p>
//       `
//     });

//     console.log("Email sent:", info.response);

//   } catch (error) {

//     console.error("Email sending failed:", error);
//     throw error;

//   }

// };

// export const sendVerificationEmail = async (email, token) => {

//   // const verifyLink = `${process.env.BACKEND_URL}/api/users/verify-email/${token}`;
//   const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

//   await transporter.sendMail({
//     from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Verify Your Email",
//     html: `
//       <h2>Email Verification</h2>
//       <p>Click below to verify your email:</p>
//       <a href="${verifyLink}">${verifyLink}</a>
//       <p>This link expires in 10 minutes.</p>
//     `
//   });

// };

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetEmail = async (email, link) => {

  try {

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    console.log("Email sent:", data);

  } catch (error) {

    console.error("Email sending failed:", error);
    throw error;

  }

};

export const sendVerificationEmail = async (email, token) => {

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your email:</p>
      <a href="${verifyLink}">${verifyLink}</a>
      <p>This link expires in 10 minutes.</p>
    `,
  });

};