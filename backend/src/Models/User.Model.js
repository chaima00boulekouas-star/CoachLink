
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
     password: {
      type: String,
      required: true

    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["trainer", "athlete", "admin"],
      required: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    avatar: String,

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
      index: true,
    },

    location: {
      city: String,
      country: String,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
      index: true,
    },
    isTrainerVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationToken: String,
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });

export default mongoose.model("User", userSchema);