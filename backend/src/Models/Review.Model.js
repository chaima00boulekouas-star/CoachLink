// review.model.js

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    trainee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      index: true,
    },

    comment: String,
  },
  { timestamps: true }
);

reviewSchema.index({ coach: 1, rating: -1 });

export default mongoose.model("Review", reviewSchema);