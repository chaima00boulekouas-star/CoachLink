// session.model.js

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    trainee: {
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

sessionSchema.index({ coach: 1, date: -1 });

export default mongoose.model("Session", sessionSchema);