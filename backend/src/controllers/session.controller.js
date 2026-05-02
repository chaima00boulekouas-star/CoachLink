import Session from "../Models/Session.Model.js";
import User from "../Models/User.Model.js";

// @desc    Book a new session with a coach
// @route   POST /api/sessions
// @access  Private (Logged in Trainee)
export const bookSession = async (req, res) => {
  try {
    const { trainerId, date } = req.body;
    const athleteId = req.user.id;

    if (!trainerId || !date) {
      return res.status(400).json({ message: "Trainer ID and Session Date are required." });
    }

    // Security Check: Verify that the trainer actually exists in the database
    const trainerExists = await User.findById(trainerId);
    if (!trainerExists || trainerExists.role !== "trainer") {
      return res.status(404).json({ message: "Invalid Trainer ID - Trainer not found." });
    }

    // You can add logic here to check if the date is in the past
    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "Cannot book a session in the past." });
    }

    // Create the session based on your schema
    const newSession = new Session({
      trainer: trainerId,
      athlete: athleteId,
      date: date,
      status: "scheduled", // Default status as per your enum
    });

    await newSession.save();

    res.status(201).json({ 
      message: "Session booked successfully", 
      session: newSession 
    });
  } catch (error) {
    console.error("Book Session Error:", error);
    res.status(500).json({ message: "Failed to book session", error: error.message });
  }
};

// @desc    Get all scheduled sessions for the logged-in Trainer
// @route   GET /api/sessions/trainer
// @access  Private (Trainer only)
export const getCoachSessions = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Fetch sessions and populate athlete details. 
    // sort({ date: 1 }) brings the closest upcoming sessions first.
    const sessions = await Session.find({ trainer: trainerId })
      .populate("athlete", "name email")
      .sort({ date: 1 });

    res.status(200).json({ count: sessions.length, sessions });
  } catch (error) {
    console.error("Get Trainer Sessions Error:", error);
    res.status(500).json({ message: "Failed to fetch trainer sessions", error: error.message });
  }
};

// @desc    Get all booked sessions for the logged-in Athlete
// @route   GET /api/sessions/athlete
// @access  Private (Athlete only)
export const getTraineeSessions = async (req, res) => {
  try {
    const athleteId = req.user.id;

    // Fetch sessions and populate trainer details.
    const sessions = await Session.find({ athlete: athleteId })
      .populate("trainer", "name email")
      .sort({ date: 1 });

    res.status(200).json({ count: sessions.length, sessions });
  } catch (error) {
    console.error("Get Athlete Sessions Error:", error);
    res.status(500).json({ message: "Failed to fetch athlete sessions", error: error.message });
  }
};

// @desc    Update session status (e.g., mark as "done" or "cancelled")
// @route   PUT /api/sessions/:id/status
// @access  Private (Coach or Trainee)
export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const sessionId = req.params.id;
    const userId = req.user.id;

    // Validate the status against your enum
    const validStatuses = ["scheduled", "done", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    // Security Check: Only the specific trainer or athlete involved can update it
    const isTrainer = session.trainer.toString() === userId.toString();
    const isAthlete = session.athlete.toString() === userId.toString();

    if (!isTrainer && !isAthlete) {
      return res.status(403).json({ message: "Not authorized to update this session." });
    }

    // Update status and save
    session.status = status;
    await session.save();

    res.status(200).json({ 
      message: `Session status updated to ${status}`, 
      session 
    });
  } catch (error) {
    console.error("Update Session Status Error:", error);
    res.status(500).json({ message: "Failed to update session status", error: error.message });
  }
};