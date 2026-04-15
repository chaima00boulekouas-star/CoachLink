// middleware/role.middleware.js

// ===============================
// COACH ONLY
// ===============================
export const isCoach = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "coach") {
    return res.status(403).json({
      message: "Access denied: Coach only",
    });
  }

  next();
};



// ===============================
// TRAINEE ONLY
// ===============================
export const isTrainee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "trainee") {
    return res.status(403).json({
      message: "Access denied: Trainee only",
    });
  }

  next();
};



// ===============================
// ADMIN ONLY
// ===============================
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied: Admin only",
    });
  }

  next();
};