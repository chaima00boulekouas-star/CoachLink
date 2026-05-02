
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

    avatar: String,

    isBanned: {
      type: Boolean,
      default: false,
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
    verificationToken: String,
  },
  { timestamps: true }
);

userSchema.index({ role: 1, isBanned: 1 });

export default mongoose.model("User", userSchema);