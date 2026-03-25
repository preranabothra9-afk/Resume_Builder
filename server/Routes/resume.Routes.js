import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume,getAllResumes, trackResumeView, trackDownload, exportResume } from '../controllers/resume.controllers.js';
import upload from '../configs/multer.js';


const resumeRouter = express.Router();

resumeRouter.get('/', protect, getAllResumes);
resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image') ,protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.get("/view/:resumeId", trackResumeView);
resumeRouter.post("/download/:resumeId", protect, trackDownload);
resumeRouter.get("/export/:resumeId", protect, exportResume);
//resumeRouter.post("/ats-score", protect, atsScore)

export default resumeRouter;