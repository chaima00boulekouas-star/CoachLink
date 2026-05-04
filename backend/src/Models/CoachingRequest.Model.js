import mongoose from "mongoose";

const coachingRequestSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
    sentBy: {
      type: String,
      enum: ["athlete", "trainer"],
      required: true,
      default: "athlete",
    },
  },
  { timestamps: true }
);

coachingRequestSchema.virtual('request_id').get(function() {
  return this._id.toHexString();
});
coachingRequestSchema.set('toJSON', { virtuals: true });
coachingRequestSchema.set('toObject', { virtuals: true });

export default mongoose.model("CoachingRequest", coachingRequestSchema);
