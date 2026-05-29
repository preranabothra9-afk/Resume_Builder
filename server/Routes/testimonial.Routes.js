import express from 'express';
import protect from '../middlewares/auth.middlewares.js';
import { submitTestimonial, getApprovedTestimonials, getAllTestimonials, approveTestimonial, deleteTestimonial } from '../controllers/testimonial.controllers.js';

const testimonialRouter = express.Router();

testimonialRouter.post('/', submitTestimonial);
testimonialRouter.get('/', getApprovedTestimonials);
testimonialRouter.get('/all', protect, getAllTestimonials);
testimonialRouter.patch('/:id/approve', protect, approveTestimonial);
testimonialRouter.delete('/:id', protect, deleteTestimonial);

export default testimonialRouter;
