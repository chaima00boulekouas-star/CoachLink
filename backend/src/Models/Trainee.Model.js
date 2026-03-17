
import mongoose from "mongoose";

const traineeProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },

    goals: [String],

    level: {
      type: String,
      enum: ["beginner", "intermediate", "pro"],
      index: true,
    },

    favoriteSports: [String],
  },
  { timestamps: true }
);

export default mongoose.model(
  "TraineeProfile",
  traineeProfileSchema
);