import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import connectDB from './configs/db.js';
import router from './Routes/user.Routes.js';
import resumeRouter from './Routes/resume.Routes.js';
import aiRouter from './Routes/ai.Routes.js';
import testimonialRouter from './Routes/testimonial.Routes.js';

const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3000;

// Database connection
await connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^https:\/\/.*resume-builder.*\.vercel\.app$/.test(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: "Too many password reset attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
app.use('/api/users/forgot-password', forgotPasswordLimiter);

app.get('/', (req, res) =>{
    res.send("Server is Live...")
});
app.use('/api/users', router);
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/testimonials', testimonialRouter)

app.listen(port, () =>{
    console.log(`Server is running on port http://${port}`);
});