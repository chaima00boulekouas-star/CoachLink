// store.model.js

import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      index: true,
    },

    description: String,

    logo: String,

    banner: String,

    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    subscriptionPaid: {
      type: Boolean,
      default: false,
      index: true,
    },

    ratingAvg: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

storeSchema.index({ trainer: 1, isActive: 1 });

export default mongoose.model("Store", storeSchema);