import User from "../Models/User.Model.js";
import Report from "../Models/Report.Model.js";
import Feedback from "../Models/Feedback.Model.js";
import Product from "../Models/Product.Model.js";
import CoachingRequest from "../Models/CoachingRequest.Model.js";
import AthleteProfile from "../Models/AthleteProfile.Model.js";
import TrainerProfile from "../Models/TrainerProfile.Model.js";
import Session from "../Models/Session.Model.js";

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalTrainers = await User.countDocuments({ role: "trainer" });
    const totalAthletes = await User.countDocuments({ role: "athlete" });
    const totalReports = await Report.countDocuments({ status: "pending" });
    const totalProducts = await Product.countDocuments();
    const activeRequests = await CoachingRequest.countDocuments({ status: "pending" });

    // Mock trend data for UI consistency
    const stats = [
      { label: 'Total Trainers',  value: totalTrainers.toLocaleString(),   icon: 'UserCheck', delta: '+8.5%', up: true,  color: 'from-indigo-500 to-indigo-600' },
      { label: 'Total Athletes',  value: totalAthletes.toLocaleString(), icon: 'Users',     delta: '+13%',  up: true,  color: 'from-purple-500 to-purple-600' },
      { label: 'Pending Reports',   value: totalReports.toLocaleString(),    icon: 'Flag',      delta: '-0.5%', up: false, color: 'from-red-500 to-rose-600' },
      { label: 'Total Products',  value: totalProducts.toLocaleString(),   icon: 'Package',   delta: '+12%',  up: true,  color: 'from-emerald-500 to-green-600' },
      { label: 'Active Requests', value: activeRequests.toLocaleString(),    icon: 'Zap',       delta: '+9%',   up: true,  color: 'from-amber-500 to-orange-500' },
    ];

    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all users (athletes or trainers)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};
    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    // Map role-specific data if needed
    const enrichedUsers = await Promise.all(users.map(async (u) => {
      let extra = {};
      if (u.role === 'athlete') {
        const profile = await AthleteProfile.findOne({ user: u._id });
        extra = { sport: profile?.sports?.[0] || 'N/A', sessions: 0 }; // sessions can be added later
      } else if (u.role === 'trainer') {
        const profile = await TrainerProfile.findOne({ user: u._id });
        extra = { sport: profile?.specialization || profile?.sports?.[0] || 'N/A', rating: profile?.rating || 5.0 };
      }
      return { ...u.toObject(), ...extra };
    }));

    res.json(enrichedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user status (ban/suspend/active)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();
    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email')
      .populate('reportedUser', 'name email role')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    await report.save();
    res.json({ message: "Report updated", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private/Admin
export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate('user', 'name email role avatar')
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Reply to feedback
// @route   POST /api/admin/feedback/:id/reply
// @access  Private/Admin
export const replyFeedback = async (req, res) => {
  try {
    const { reply } = req.body;
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    feedback.reply = reply;
    feedback.status = "resolved";
    await feedback.save();
    res.json({ message: "Reply sent and feedback resolved", feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
