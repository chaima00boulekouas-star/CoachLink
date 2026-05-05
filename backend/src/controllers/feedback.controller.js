import Feedback from "../Models/Feedback.Model.js";

// @desc    Submit platform feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = async (req, res) => {
  try {
    const { type, rating, subject, body } = req.body;
    const userId = req.user.id;

    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and body are required" });
    }

    const feedback = await Feedback.create({
      user: userId,
      type: type || "suggestion",
      rating: rating || 5,
      subject,
      body,
    });

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Submit Feedback Error:", error);
    res.status(500).json({ message: "Server error while submitting feedback", error: error.message });
  }
};

// @desc    Get my feedback history
// @route   GET /api/feedback/me
// @access  Private
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
