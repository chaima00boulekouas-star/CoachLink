import Order from "../Models/Order.Model.js";
import Product from "../Models/Product.Model.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Logged in Trainee/User)
export const createOrder = async (req, res) => {
  try {
    // 1. Extract data from the frontend request body
    const { orderItems, shippingAddress } = req.body;
    const userId = req.user.id; // Retrieved from the authentication middleware (isAuth)

    // 2. Verify that the cart is not empty
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // 3. Securely calculate the total price directly from the database
    let calculatedTotalPrice = 0;
    const itemsToSave = [];

    // Loop through each item in the cart to verify its real, untampered price
    for (let i = 0; i < orderItems.length; i++) {
      const item = orderItems[i];
      
      // Fetch the product from the database
      const dbProduct = await Product.findById(item.product);
      
      if (!dbProduct) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // Calculate the total for this specific item: (DB Price * Requested Quantity)
      const itemTotal = dbProduct.price * item.quantity;
      calculatedTotalPrice += itemTotal;

      // Format the item object to match the Order schema requirements
      itemsToSave.push({
        title: dbProduct.title,
        quantity: item.quantity,
        price: dbProduct.price,
        product: dbProduct._id,
        store: dbProduct.store,
        trainer: dbProduct.trainer, // Save the reference to the trainer who owns this product
        type: dbProduct.type
      });
    }

    // 4. Create the order instance in the database with a default "pending" status
    const order = new Order({
      user: userId,
      items: itemsToSave,
      shippingAddress: shippingAddress || {}, // Fallback to empty object if not provided (e.g., digital goods)
      totalPrice: calculatedTotalPrice,
      status: "pending", // Order placed, but not processed
      paymentStatus: "pending" // Awaiting Chargily payment
    });

    // Save the order to MongoDB
    const createdOrder = await order.save();

    // 5. Send the generated order ID back to the frontend to be passed into the Chargily checkout
    res.status(201).json({
      message: "Order created successfully",
      orderId: createdOrder._id,
      totalPrice: createdOrder.totalPrice
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error while creating order", error: error.message });
  }
};
// @desc    Get logged in user (Athlete) orders
// @route   GET /api/orders/myorders
// @access  Private (Logged in User)
export const getMyOrders = async (req, res) => {
  try {
    // Find all orders where the 'user' field matches the logged-in user's ID
    // .sort({ createdAt: -1 }) ensures the newest orders appear first
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ message: "Server error while fetching user orders", error: error.message });
  }
};

// @desc    Get all orders related to a specific Trainer
// @route   GET /api/orders/trainer
// @access  Private (Logged in Trainer)
export const getCoachOrders = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Magic of MongoDB: Search inside the 'items' array to find any product that belongs to this trainer
    // .populate('user', 'name email') fetches the buyer's name and email so the trainer can contact them
    const orders = await Order.find({ "items.trainer": trainerId })
      .populate("user", "name email") 
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for your products yet." });
    }

    // --- NEW: Filter out items belonging to other trainers ---
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject(); // Convert to plain object to manipulate
      
      // Keep only this trainer's items
      // Ensure we convert both values to strings to compare safely
      orderObj.items = orderObj.items.filter(item => item.trainer.toString() === trainerId.toString());
      
      // Calculate how much THIS specific trainer made from this order
      orderObj.trainerTotal = orderObj.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return orderObj;
    });

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Get Trainer Orders Error:", error);
    res.status(500).json({ message: "Server error while fetching trainer orders", error: error.message });
  }
};
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Logged in User or Trainer)
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find the order by the ID provided in the URL and populate buyer details
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // SECURITY CHECK: Ensure the logged-in user is either the buyer OR a trainer involved in this order
    const isBuyer = order.user._id.toString() === userId.toString();
    const isTrainerOwner = order.items.some(item => item.trainer && item.trainer.toString() === userId.toString());

    if (!isBuyer && !isTrainerOwner) {
      return res.status(403).json({ message: "Not authorized to view this order details" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: "Server error while fetching order details", error: error.message });
  }
};

// @desc    Update order status (e.g., to 'completed' or 'delivered')
// @route   PUT /api/orders/:id/status
// @access  Private (Coach only)
export const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    // The coach will send the new status from the frontend (e.g., "completed")
    const { status } = req.body; 
    
    // Find the order
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // SECURITY CHECK: Ensure this specific trainer actually sold an item in this order
    const isTrainerOwner = order.items.some(item => item.trainer && item.trainer.toString() === userId.toString());
    
    if (!isTrainerOwner) {
      return res.status(403).json({ message: "Not authorized to update this order's status" });
    }

    // Update the status and save it to the database
    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: `Order status successfully updated to ${status}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: "Server error while updating order status", error: error.message });
  }
};