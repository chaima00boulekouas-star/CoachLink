import Order from "../Models/Order.Model.js";
import Product from "../Models/Product.Model.js";
import Session from "../Models/Session.Model.js";
import TrainerProfile from "../Models/TrainerProfile.Model.js";

// @desc    Get coach dashboard statistics and overview
// @route   GET /api/dashboard/coach
// @access  Private (Logged in Coach)
export const getCoachDashboardStats = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // 1. Get total active products created by this trainer
    const totalProducts = await Product.countDocuments({ trainer: trainerId });

    // 2. Get upcoming sessions count (only 'scheduled' ones)
    const upcomingSessions = await Session.countDocuments({ 
      trainer: trainerId, 
      status: "scheduled" 
    });

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

    // 7. Send the compiled dashboard data to the frontend
    res.status(200).json({
      stats: {
        totalEarnings,
        totalProducts,
        upcomingSessions,
        totalAthletes: uniqueAthletes.size, // Size of the Set gives the exact number of unique buyers
        ratingAvg,
        ratingCount
      },
      recentOrders
    });

  } catch (error) {
    console.error("Get Coach Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics", error: error.message });
  }
};