import mongoose from "mongoose";

const athleteProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    location: {
      type: String,
    },
    sports: [
      {
        type: String,
      },
    ],
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    fitness_goals: [
      {
        type: String,
      },
    ],
    level: {
      type: String,
      index: true,
    },
    style: {
      type: String,
    },
    availability: [
      {
        type: String,
      },
    ],
    reason: {
      type: String,
    },
    goal: {
      type: String,
    },
  },
  { timestamps: true }
);

athleteProfileSchema.virtual("athlete_id").get(function () {
  return this._id.toHexString();
});
athleteProfileSchema.set("toJSON", { virtuals: true });
athleteProfileSchema.set("toObject", { virtuals: true });

export default mongoose.model("AthleteProfile", athleteProfileSchema);
