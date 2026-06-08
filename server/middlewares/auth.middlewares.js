import jwt from 'jsonwebtoken';
import User from '../models/User.models.js';

const isSecure = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const accessTokenOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'lax',
  path: '/',
  maxAge: 15 * 60 * 1000
};

const refreshTokenOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const clearTokens = (res) => {
  res.clearCookie("access_token", { path: '/' });
  res.clearCookie("refresh_token", { path: '/' });
};

const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token && req.cookies?.access_token) {
    token = `Bearer ${req.cookies.access_token}`;
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    clearTokens(res);
    return res.status(401).json({ message: "Unauthorized access" });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('email');
    const adminEmail = process.env.ADMIN_EMAIL || "preranabothra9@gmail.com";
    if (!user || user.email !== adminEmail) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { protect, adminAuth, generateAccessToken, generateRefreshToken, clearTokens, accessTokenOptions, refreshTokenOptions };