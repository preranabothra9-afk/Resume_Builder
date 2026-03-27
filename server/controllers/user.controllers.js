import User from "../models/User.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.models.js";
import { ApiError } from "../utils/api_errors.js";
import { ApiResponse } from "../utils/api_response.js";
import crypto from "crypto";
import { sendResetEmail, sendVerificationEmail } from "../utils/sendEmail.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER
export const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Required credentials missing");
    }

    const existingUser = await User.findOne({
      $or: [{ email }]
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    // send email
    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      message: "Verification email sent. Please check your inbox."
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(400, "Invalid email or password");
    }

    if (!user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");

      user.verificationToken = verificationToken;
      user.verificationTokenExpiry = Date.now() + 10 * 60 * 1000;

      await user.save();

      await sendVerificationEmail(user.email, verificationToken);

      throw new ApiError(
        401,
        "Email not verified. A new verification email has been sent."
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid email or password");
    }

    const token = generateToken(user._id);
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful!",
      token,
      user
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message });
  }
};

// Email Verification
export const verifyEmail = async (req, res) => {

  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }

  // check expiry
  if (user.verificationTokenExpiry < Date.now()) {
    return res.status(400).json({
      message: "Verification link expired. Please login to resend email."
    });
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpiry = null;

  await user.save();

  return res.json({ message: "Email verified successfully! Pls login again with the same email!" });
};

// GET USER DATA
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.password = undefined;

    return res.status(200).json(
      new ApiResponse(200, user)
    );

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message });
  }
};

// GET RESUMES
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    return res.status(200).json({ resumes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//FORGOT PASSWORD
// export const forgotPassword = async (req, res) => {
//   try {

//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found"
//       });
//     }

//     const token = crypto.randomBytes(32).toString("hex");

//     user.resetToken = token;
//     user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

//     await user.save();

//     const resetLink = `http://resume-builder-lyart-one.vercel.app/reset-password/${token}`;
//     //const resetLink = `https://resume-builder-lyart-one.vercel.app/reset-password/${token}`;

//     await sendResetEmail(email, resetLink);

//     res.json({
//       message: "Password reset email sent"
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const forgotPassword = async (req, res) => {
  try {

    console.log("Forgot password request received");

    const { email } = req.body;
    console.log("Email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({
        message: "User not found"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    console.log("Sending email...");

    await sendResetEmail(email, resetLink);

    console.log("Email sent successfully");

    res.json({
      message: "Password reset email sent"
    });

  } catch (error) {

    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

//RESET PASSWORD
export const resetPassword = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters"
    });
  }
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired token"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({
    message: "Password updated successfully"
  });
};
