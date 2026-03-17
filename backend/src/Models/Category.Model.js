// category.model.js
// Fitness

// Nutrition

// Equipment

// Program

// PDF

// Subscription

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true,
  },

  slug: {
    type: String,
    unique: true,
    index: true,
  },
});

export default mongoose.model("Category", categorySchema);