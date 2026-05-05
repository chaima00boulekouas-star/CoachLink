// middleware/auth.middleware.js

import jwt from "jsonwebtoken";
import User from "../Models/User.Model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');

    // get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Check account status
    if (user.status !== 'active') {
      const msg = user.status === 'banned' 
        ? 'Your account has been banned. Please contact support.' 
        : 'Your account has been suspended. Please contact support.';
      return res.status(403).json({ message: msg });
    }

    // attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};