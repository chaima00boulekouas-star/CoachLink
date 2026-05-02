// models/order.model.js

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    title: String,

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
      enum: ["physical", "digital", "program"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "done",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ["edahabia", "cib"],
      index: true,
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      city: String,
      address: String,
    },

    chargilyId: String,
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, status: 1 });

orderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", orderSchema);