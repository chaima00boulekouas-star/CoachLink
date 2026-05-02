import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "dismissed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

reportSchema.virtual('report_id').get(function() {
  return this._id.toHexString();
});
reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });

export default mongoose.model("Report", reportSchema);
