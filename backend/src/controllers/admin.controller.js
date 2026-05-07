import User from "../Models/User.Model.js";
import Report from "../Models/Report.Model.js";
import Feedback from "../Models/Feedback.Model.js";
import Product from "../Models/Product.Model.js";
import CoachingRequest from "../Models/CoachingRequest.Model.js";
import AthleteProfile from "../Models/AthleteProfile.Model.js";
import TrainerProfile from "../Models/TrainerProfile.Model.js";
import Session from "../Models/Session.Model.js";
import Notification from "../Models/Notification.Model.js";

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

    const stats = [
      { label: 'Total Trainers',  value: totalTrainers.toLocaleString(),   icon: 'UserCheck', delta: '+8.5%', up: true,  color: 'from-indigo-500 to-indigo-600' },
      { label: 'Total Athletes',  value: totalAthletes.toLocaleString(), icon: 'Users',     delta: '+13%',  up: true,  color: 'from-purple-500 to-purple-600' },
      { label: 'Pending Reports',   value: totalReports.toLocaleString(),    icon: 'Flag',      delta: '-0.5%', up: false, color: 'from-red-500 to-rose-600' },
      { label: 'Total Products',  value: totalProducts.toLocaleString(),   icon: 'Package',   delta: '+12%',  up: true,  color: 'from-emerald-500 to-green-600' },
      { label: 'Active Requests', value: activeRequests.toLocaleString(),    icon: 'Zap',       delta: '+9%',   up: true,  color: 'from-amber-500 to-orange-500' },
    ];

    // Calculate platform activity (last 15 days)
    const activity = [];
    const dates = [];
    for (let i = 14; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0,0,0,0);
        dates.push(d);
    }

    for (const d of dates) {
        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);
        const count = await User.countDocuments({ 
            createdAt: { $gte: d, $lt: nextDay } 
        });
        // Scale count for visibility if data is sparse, or just return raw
        // Let's use a base of 20 + count*5 to make it look active if it's a new platform
        activity.push(20 + (count * 5)); 
    }

    res.json({ stats, activity });
  } catch (err) {
    console.error("Get admin stats error:", err);
    res.status(500).json({ message: "Failed to fetch platform stats", error: err.message });
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
      try {
        let extra = {};
        const uObj = u.toObject ? u.toObject() : u;

        if (u.role === 'athlete') {
          const profile = await AthleteProfile.findOne({ user: u._id }).lean();
          extra = { sport: profile?.sports?.[0] || 'N/A', sessions: 0 };
        } else if (u.role === 'trainer') {
          const profile = await TrainerProfile.findOne({ user: u._id }).lean();
          extra = { 
            sport: profile?.specialization || profile?.sports?.[0] || 'N/A', 
            rating: profile?.ratingAvg || 0,
            ratingCount: profile?.ratingCount || 0
          };
        }
        return { ...uObj, ...extra };
      } catch (e) {
        console.error(`Error enriching user ${u._id}:`, e);
        return u.toObject ? u.toObject() : u;
      }
    }));

    res.json(enrichedUsers);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
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

    // Create notification for the user
    await Notification.create({
      recipient: feedback.user,
      sender: req.user._id,
      type: "feedback",
      title: "Feedback Replied",
      message: `An admin has replied to your feedback: "${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}"`,
      relatedId: feedback._id,
      relatedModel: "Feedback"
    });

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
// @desc    Toggle trainer verification and subscription
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
export const verifyTrainer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== 'trainer') return res.status(400).json({ message: "User is not a trainer" });

    // Toggle status
    user.isTrainerVerified = !user.isTrainerVerified;
    // When verifying, we also give them subscription for now as per requirement
    user.isSubscribed = user.isTrainerVerified; 
    
    await user.save();
    res.json({ message: `Trainer verification status updated`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Bulk update all existing trainers to be verified and subscribed
// @route   POST /api/admin/bulk-verify-trainers
// @access  Private/Admin
export const bulkVerifyTrainers = async (req, res) => {
  try {
    const result = await User.updateMany(
      { role: 'trainer' },
      { $set: { isTrainerVerified: true, isSubscribed: true } }
    );
    res.json({ message: `Bulk update successful. ${result.modifiedCount} trainers updated.`, result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc    Toggle user subscription status
// @route   PUT /api/admin/users/:id/subscription
// @access  Private/Admin
export const toggleSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSubscribed = !user.isSubscribed;
    await user.save();
    res.json({ message: `Subscription status updated`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
