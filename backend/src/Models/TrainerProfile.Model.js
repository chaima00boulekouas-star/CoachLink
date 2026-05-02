import mongoose from "mongoose";

const trainerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: String, // String to allow "5 years", etc.
    },
    sports: [
      {
        type: String,
      },
    ],
    location: {
      type: String,
    },
    philosophy: {
      type: String,
    },
    achievements: {
      type: String,
    },
    levels: [
      {
        type: String,
      },
    ],
    availability: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
    },
    certificates: [
      {
        type: String,
      },
    ],
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
    favorites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  },
  { timestamps: true }
);

trainerProfileSchema.virtual("trainer_id").get(function () {
  return this._id.toHexString();
});
trainerProfileSchema.set("toJSON", { virtuals: true });
trainerProfileSchema.set("toObject", { virtuals: true });

export default mongoose.model("TrainerProfile", trainerProfileSchema);
