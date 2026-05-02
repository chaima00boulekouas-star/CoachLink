// product.model.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      index: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    title: {
      type: String,
      required: true,
      index: true,
    },

    description: String,

    category: {
      type: String,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      index: true,
    },

    images: [String],

    type: {
      type: String,
      enum: ["physical", "digital", "program"],
      index: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    ratingAvg: {
      type: Number,
      default: 0,
      index: true,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

productSchema.index({
  title: "text",
  category: 1,
  price: 1,
});

export default mongoose.model("Product", productSchema);