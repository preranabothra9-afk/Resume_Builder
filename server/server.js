import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import router from './Routes/user.Routes.js';
import resumeRouter from './Routes/resume.Routes.js';
import aiRouter from './Routes/ai.Routes.js';
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "*"
}));

// Database connection
await connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send("Server is Live...")
});
app.use('/api/users', router);
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)

app.listen(port, () =>{
    console.log(`Server is running on port http://${port}`);
});