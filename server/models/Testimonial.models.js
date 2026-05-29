import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);
export default Testimonial;
