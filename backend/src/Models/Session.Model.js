import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Training Session",
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: String,
      default: "1 hour",
    },
    location: {
      type: String,
      default: "TBD",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "done", "cancelled"],
      default: "scheduled",
      index: true,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ trainer: 1, date: -1 });

export default mongoose.model("Session", sessionSchema);