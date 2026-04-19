import { ChargilyClient } from "@chargily/chargily-pay";
import crypto from "crypto";
import Order from "../Models/Order.Model.js"; 
import Payment from "../Models/Payment.Model.js";

// 1. Initialize Chargily Client using your Secret Key from .env
const client = new ChargilyClient({
  api_key: process.env.CHARGILY_SECRET_KEY,
  mode: "test", // ⚠️ Important: Keep this as 'test' during development
});

// @desc    Create a Checkout Link for an Order
// @route   POST /api/payments/create-checkout
// @access  Private (Trainee/User)
export const createCheckout = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    // 2. Find the order in the database to get the total price
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Optional: Check if the order is already paid
    if (order.status === "paid") {
      return res.status(400).json({ message: "This order is already paid." });
    }

    // 3. Request a Checkout URL from Chargily
    const checkout = await client.createCheckout({
      amount: order.totalPrice, // The price must be a positive number
      currency: "dzd",         // Algerian Dinar
      
      // Where should the user be redirected after they finish? (Frontend URLs)
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      failure_url: `${process.env.FRONTEND_URL}/payment-failure`,
      
      // Where should Chargily send the silent confirmation? 
      webhook_endpoint: `${process.env.DOMAIN_URL}/api/payments/webhook`, 
      //we can use ngrok to create a tunnel to our local server
      
      // Metadata: Hidden data to help us identify this payment later
      metadata: {
        order_id: order._id.toString(),
        user_id: userId.toString(),
      },
    });

    // 4. Save the Chargily Checkout ID in our database for reference
    order.chargilyId = checkout.id;
    await order.save();

    // Create a pending Payment record
    const newPayment = new Payment({
      user: userId,
      amount: order.totalPrice,
      type: "product", // or "subscription" based on your logic
      status: "pending",
      chargilyId: checkout.id,
    });
    await newPayment.save();

    // 5. Send the generated URL back to React so the user can click it
    res.status(200).json({
      message: "Checkout link generated successfully",
      checkoutUrl: checkout.checkout_url,
    });

  } catch (error) {
    console.error("Chargily Error:", error);
    res.status(500).json({ message: "Failed to create payment link", error: error.message });
  }
};

// @desc    Handle Chargily Webhook (Receive payment confirmation)
// @route   POST /api/payments/webhook
// @access  Public (But strictly verified by Signature)
export const webhookReceiver = async (req, res) => {
  try {
    // 1. Get the signature sent by Chargily from the headers
    const signature = req.headers["signature"];
    
    // We use the raw body captured in server.js to verify it exactly as it came over the network
    const payload = req.rawBody || JSON.stringify(req.body); 

    // 2. Verify Security: Make sure the request is REALLY from Chargily, not a hacker
    const secret = process.env.CHARGILY_SECRET_KEY;
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (signature !== computedSignature) {
      return res.status(403).json({ message: "Invalid signature! Hacker detected." });
    }

    // 3. If secure, extract the event data
    const event = req.body;

    // 4. Check what happened with the payment
    if (event.type === "checkout.paid") {
      const checkout = event.data;
      const orderId = checkout.metadata.order_id;

      // The user successfully paid! Update the Order and Payment in Database
      await Order.findByIdAndUpdate(orderId, {
        status: "paid",
        paymentStatus: "paid",
      });

      await Payment.findOneAndUpdate(
        { chargilyId: checkout.id },
        { status: "paid" }
      );

      console.log(`✅ SUCCESS: Order ${orderId} has been paid!`);
    } 
    else if (event.type === "checkout.failed" || event.type === "checkout.canceled") {
      const checkout = event.data;
      const orderId = checkout.metadata.order_id;

      // The payment failed or was canceled by the user
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
      });

      await Payment.findOneAndUpdate(
        { chargilyId: checkout.id },
        { status: "failed" }
      );

      console.log(`❌ FAILED: Order ${orderId} payment failed.`);
    }

    // 5. CRITICAL: We MUST tell Chargily "Message Received", otherwise they will keep sending it
    res.status(200).send("Webhook received successfully");

  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook Server Error");
  }
};