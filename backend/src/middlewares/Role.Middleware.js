// middleware/role.middleware.js

// ===============================
// TRAINER ONLY
// ===============================
export const isTrainer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "trainer") {
    return res.status(403).json({
      message: "Access denied: Trainer only",
    });
  }

  next();
};

// Aliasing for compatibility
export const isCoach = isTrainer;

// ===============================
// ATHLETE ONLY
// ===============================
export const isAthlete = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  if (req.user.role !== "athlete") {
    return res.status(403).json({
      message: "Access denied: Athlete only",
    });
  }

  next();
};

// Aliasing for compatibility
export const isTrainee = isAthlete;



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