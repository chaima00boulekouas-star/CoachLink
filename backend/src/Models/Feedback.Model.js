import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["suggestion", "bug", "praise"],
      default: "suggestion",
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "in_review", "resolved"],
      default: "new",
      index: true,
    },
    reply: {
      type: String,
    },
  },
  { timestamps: true }
);

feedbackSchema.virtual('feedback_id').get(function() {
  return this._id.toHexString();
});
feedbackSchema.set('toJSON', { virtuals: true });
feedbackSchema.set('toObject', { virtuals: true });

export default mongoose.model("Feedback", feedbackSchema);
