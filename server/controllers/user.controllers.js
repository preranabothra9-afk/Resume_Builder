import User from "../models/User.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.models.js";
import { ApiError } from "../utils/api_errors.js";
import { ApiResponse } from "../utils/api_response.js";
import crypto from "crypto";
import { sendResetEmail, sendVerificationEmail } from "../utils/sendEmail.js";
import { generateAccessToken, generateRefreshToken, clearTokens } from "../middlewares/auth.middlewares.js";

const sanitize = (str) => str?.trim().replace(/[<>]/g, '');

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email)?.toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required credentials missing" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

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
    const email = sanitize(req.body.email)?.toLowerCase();
    const password = req.body.password;
    const rememberMe = req.body.rememberMe;

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
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);

    if (rememberMe) {
      const refreshToken = generateRefreshToken(user._id);
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000
    });

    const userData = await User.findById(user._id).select('-password');

    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      user: userData
    });

  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message });
  }
};

// EMAIL VERIFICATION
export const verifyEmail = async (req, res) => {
  try {
    const token = sanitize(req.params.token);

    const user = await User.findOne({
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({
        message: "Verification link expired. Please login to resend email."
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    return res.json({ message: "Email verified successfully! Please login again." });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const refreshTokenCookie = req.cookies?.refresh_token;

    if (!refreshTokenCookie) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      clearTokens(res);
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user._id);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000
    });

    return res.status(200).json({
      accessToken,
      user
    });

  } catch (error) {
    clearTokens(res);
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  clearTokens(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

// GET USER DATA
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(
      new ApiResponse(200, user)
    );

  } catch (error) {
    return res.status(500).json({ message: error.message });
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

export const forgotPassword = async (req, res) => {
  try {
    const email = sanitize(req.body.email)?.toLowerCase();

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "If the email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendResetEmail(email, resetLink);

    res.json({ message: "If the email exists, a reset link has been sent." });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const token = sanitize(req.params.token);
    const password = req.body.password;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};