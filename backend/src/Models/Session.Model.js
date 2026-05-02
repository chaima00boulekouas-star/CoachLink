// session.model.js

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    date: {
      type: Date,
      index: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "done", "cancelled"],
      index: true,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ trainer: 1, date: -1 });

export default mongoose.model("Session", sessionSchema);