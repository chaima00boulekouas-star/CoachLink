
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
     
    },

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
      enum: ["coach", "trainee", "admin"],
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
  },
  { timestamps: true }
);

userSchema.index({ role: 1, isBanned: 1 });

export default mongoose.model("User", userSchema);