
import mongoose from "mongoose";

const coachProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    sports: [
      {
        type: String,
        index: true,
      },
    ],

    experienceYears: {
      type: Number,
      index: true,
    },

    certifications: [String],

    bio: String,

    pricePerSession: {
      type: Number,
      index: true,
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

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

coachProfileSchema.index({
  sports: 1,
  experienceYears: 1,
  ratingAvg: -1,
});

export default mongoose.model("CoachProfile", coachProfileSchema);