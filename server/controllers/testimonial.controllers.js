import Testimonial from "../models/Testimonial.models.js";

export const submitTestimonial = async (req, res) => {
  try {
    const { name, email, text, rating } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: "Name and testimonial text are required" });
    }

    if (text.length > 500) {
      return res.status(400).json({ message: "Testimonial must be under 500 characters" });
    }

    await Testimonial.create({ name, email, text, rating });

    return res.status(201).json({ message: "Thank you! Your testimonial has been submitted and is pending approval." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .select("-email -__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({ testimonials });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    return res.status(200).json({ testimonials });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const approveTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    testimonial.isApproved = !testimonial.isApproved;
    await testimonial.save();

    return res.status(200).json({
      message: `Testimonial ${testimonial.isApproved ? "approved" : "unapproved"}`,
      testimonial
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    return res.status(200).json({ message: "Testimonial deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
