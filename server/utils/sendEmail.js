
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,

  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendResetEmail = async (email, link) => {

  try {

    const info = await transporter.sendMail({
      from: '"Resume Builder" <preranabothra9@gmail.com>',
      to: email,
      subject: "Password Reset",

      html: `
        <h2>Password Reset</h2>

        <p>Click below to reset your password:</p>

        <a href="${link}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

  } catch (error) {

    throw error;

  }

};

export const sendVerificationEmail = async (email, token) => {

  try {

    const verifyLink =
      `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const info = await transporter.sendMail({
      from: '"Resume Builder" <preranabothra9@gmail.com>',
      to: email,
      subject: "Verify Your Email",

      html: `
        <h2>Email Verification</h2>

        <a href="${verifyLink}">
          Verify Email
        </a>
      `,
    });

  } catch (error) {

    throw error;

  }

};