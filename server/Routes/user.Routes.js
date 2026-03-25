import express from 'express';
import { forgotPassword, getResumes, getUserById, loginUser, registerUser, resetPassword, verifyEmail } from '../controllers/user.controllers.js';
import protect from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/data', protect, getUserById);
router.get('/resumes', protect, getResumes);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router; 