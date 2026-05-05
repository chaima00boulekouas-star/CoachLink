import Report from "../Models/Report.Model.js";
import User from "../Models/User.Model.js";

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const reporterId = req.user.id;

    if (!reportedUserId || !reason) {
      return res.status(400).json({ message: "Reported user and reason are required" });
    }

    // Check if reported user exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      return res.status(404).json({ message: "Reported user not found" });
    }

    const report = await Report.create({
      reporter: reporterId,
      reportedUser: reportedUserId,
      reason,
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Create Report Error:", error);
    res.status(500).json({ message: "Server error while submitting report", error: error.message });
  }
};
