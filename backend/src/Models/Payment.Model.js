// payment.model.js

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    amount: Number,

    type: {
      type: String,
      enum: ["subscription", "product"],
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      index: true,
    },

    chargilyId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);