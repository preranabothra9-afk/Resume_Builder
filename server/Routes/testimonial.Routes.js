import express from 'express';
import { protect, adminAuth } from '../middlewares/auth.middlewares.js';
import { submitTestimonial, getApprovedTestimonials, getAllTestimonials, approveTestimonial, deleteTestimonial } from '../controllers/testimonial.controllers.js';

const testimonialRouter = express.Router();

testimonialRouter.post('/', submitTestimonial);
testimonialRouter.get('/', getApprovedTestimonials);
testimonialRouter.get('/all', protect, adminAuth, getAllTestimonials);
testimonialRouter.patch('/:id/approve', protect, adminAuth, approveTestimonial);
testimonialRouter.delete('/:id', protect, adminAuth, deleteTestimonial);

export default testimonialRouter;
