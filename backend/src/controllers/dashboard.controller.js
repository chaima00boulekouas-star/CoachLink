import Order from "../Models/Order.Model.js";
import Product from "../Models/Product.Model.js";
import Session from "../Models/Session.Model.js";
import TrainerProfile from "../Models/TrainerProfile.Model.js";
import CoachingRequest from "../Models/CoachingRequest.Model.js";
import AthleteProfile from "../Models/AthleteProfile.Model.js";

// @desc    Get coach dashboard statistics and overview
// @route   GET /api/dashboard/coach
// @access  Private (Logged in Coach)
export const getCoachDashboardStats = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // 1. Get total active products created by this trainer
    const totalProducts = await Product.countDocuments({ trainer: trainerId });

    // 2. Get upcoming sessions count (only 'scheduled' ones)
    const upcomingSessionsCount = await Session.countDocuments({ 
      trainer: trainerId, 
      status: "scheduled" 
    });

    // 2b. Get the actual upcoming session documents (next 5)
    const upcomingSessionsList = await Session.find({
      trainer: trainerId,
      status: "scheduled",
    })
      .populate("athlete", "name avatar")
      .sort({ date: 1 })
      .limit(5);

    // 3. Fetch all orders containing this trainer's products
    const orders = await Order.find({ "items.trainer": trainerId })
      .populate("user", "name avatar") // Get buyer details for recent orders
      .sort({ createdAt: -1 });

    let totalEarnings = 0;
    const uniqueAthletes = new Set(); // Using Set to avoid counting the same athlete twice
    const recentOrders = [];

    // 4. Calculate Earnings & Extract unique athletes
    orders.forEach((order, index) => {
      // Only calculate earnings for paid orders
      if (order.paymentStatus === "paid" && order.status !== "cancelled") {
        
        // Filter items in the order that belong ONLY to this trainer
        const trainerItems = order.items.filter(
          item => item.trainer.toString() === trainerId.toString()
        );

        // Sum up the earnings for this specific trainer
        const orderEarnings = trainerItems.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
        totalEarnings += orderEarnings;

        // Add the athlete's ID to the Set (it will automatically ignore duplicates)
        if (order.user) {
          uniqueAthletes.add(order.user._id.toString());
        }
      }

      // 5. Keep only the first 5 orders for the "Recent Orders" table on the dashboard
      if (index < 5) {
        // Only return the trainer's specific items for the recent orders view
        const customizedOrder = order.toObject();
        customizedOrder.items = customizedOrder.items.filter(
          item => item.trainer.toString() === trainerId.toString()
        );
        recentOrders.push(customizedOrder);
      }
    });

    // 6. Get Trainer Rating & Profile Stats
    const profile = await TrainerProfile.findOne({ user: trainerId });
    const ratingAvg = profile ? profile.ratingAvg : 0;
    const ratingCount = profile ? profile.ratingCount : 0;

    // 7. Get Pending Athlete Requests
    const pendingRequests = await CoachingRequest.find({
      trainer: trainerId,
      status: "pending",
      sentBy: "athlete"
    })
      .populate("athlete", "name avatar")
      .sort({ createdAt: -1 });

    // For each request, get the athlete's profile details (sport, level, goal)
    const athleteRequests = await Promise.all(pendingRequests.map(async (req) => {
      const profile = await AthleteProfile.findOne({ user: req.athlete._id });
      
      // Calculate initials
      const initials = req.athlete.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      
      // Determine a color based on name
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
      const color = colors[req.athlete.name.charCodeAt(0) % colors.length];

      return {
        id: req._id,
        name: req.athlete.name,
        avatar: req.athlete.avatar,
        initials,
        color,
        sport: profile?.sports?.[0] || "General",
        level: profile?.level || "Beginner",
        goal: profile?.goal || profile?.fitness_goals?.[0] || "Fitness",
        message: req.message,
        createdAt: req.createdAt
      };
    }));

    // 8. Calculate Earnings History (Last 6 Months)
    const earningsByMonth = {};
    const monthNames = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      monthNames.push(monthLabel);
      earningsByMonth[monthLabel] = 0;
    }

    orders.forEach(order => {
      if (order.paymentStatus === "paid" && order.status !== "cancelled") {
        const monthLabel = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
        if (earningsByMonth[monthLabel] !== undefined) {
           const trainerItems = order.items.filter(
            item => item.trainer && item.trainer.toString() === trainerId.toString()
          );
          const orderEarnings = trainerItems.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
          );
          earningsByMonth[monthLabel] += orderEarnings;
        }
      }
    });

    const earnings = monthNames.map(month => ({
      month,
      value: earningsByMonth[month]
    }));

    // 9. Send the compiled dashboard data to the frontend
    res.status(200).json({
      stats: {
        totalEarnings,
        totalProducts,
        upcomingSessions: upcomingSessionsCount,
        totalAthletes: uniqueAthletes.size,
        ratingAvg,
        ratingCount
      },
      earnings,
      recentOrders,
      upcomingSessions: upcomingSessionsList,
      athleteRequests
    });

  } catch (error) {
    console.error("Get Coach Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics", error: error.message });
  }
};

// @desc    Get athlete dashboard statistics and overview
// @route   GET /api/dashboard/athlete
// @access  Private (Logged in Athlete)
export const getAthleteDashboardStats = async (req, res) => {
  try {
    const athleteId = req.user.id;

    // 1. Get training sessions stats
    const totalSessions = await Session.countDocuments({ athlete: athleteId });
    const upcomingSessions = await Session.countDocuments({ 
      athlete: athleteId, 
      status: "scheduled",
      date: { $gte: new Date() }
    });
    const completedSessions = await Session.countDocuments({ 
      athlete: athleteId, 
      status: "completed" 
    });

    // 2. Get recent sessions (last 5)
    const recentSessions = await Session.find({ athlete: athleteId })
      .populate("trainer", "name avatar")
      .sort({ date: -1 })
      .limit(5);

    // 3. Get active trainers count (accepted coaching requests)
    const activeTrainers = await CoachingRequest.countDocuments({
      athlete: athleteId,
      status: "accepted"
    });

    // 4. Get athlete profile for details
    const profile = await AthleteProfile.findOne({ user: athleteId });

    // 5. Calculate "Performance Score" (Mock logic based on sessions for now)
    const performanceScore = Math.min(100, (completedSessions * 5) + 50);

    // 6. Generate Performance History (11 points for the chart)
    // We'll create a curve that ends at the current score
    const points = [];
    for (let i = 0; i < 11; i++) {
      // Create some variance but generally trending towards the current score
      const variance = Math.sin(i) * 5;
      const progress = (i / 10);
      const baseValue = 40 + (performanceScore - 40) * progress;
      const scoreAtPoint = Math.max(0, Math.min(100, baseValue + variance));
      // Map to SVG Y-coordinates (0 is top, 100 is bottom)
      points.push(100 - scoreAtPoint);
    }

    res.status(200).json({
      stats: {
        totalSessions,
        upcomingSessions,
        completedSessions,
        activeTrainers,
        performanceScore,
      },
      performanceHistory: points,
      recentSessions,
      profile: {
        sport: profile?.sports?.[0] || "General",
        level: profile?.level || "Beginner",
        goal: profile?.goal || profile?.fitness_goals?.[0] || "Fitness",
        location: profile?.location || "Not set",
        age: profile?.age || "—"
      }
    });
  } catch (error) {
    console.error("Get Athlete Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics", error: error.message });
  }
};