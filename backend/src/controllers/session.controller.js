import Session from "../Models/Session.Model.js";
import User from "../Models/User.Model.js";
import { createNotification } from "./notification.controller.js";

// @desc    Create a session (trainer schedules for their athlete)
// @route   POST /api/sessions
// @access  Private (Trainer)
export const createSession = async (req, res) => {
  try {
    const { athleteId, date, title, duration, location, notes } = req.body;
    const trainerId = req.user._id;

    if (!athleteId || !date) {
      return res.status(400).json({ message: "Athlete ID and date are required." });
    }

    // Verify athlete exists
    const athlete = await User.findById(athleteId);
    if (!athlete || athlete.role !== "athlete") {
      return res.status(404).json({ message: "Athlete not found." });
    }

    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: "Cannot schedule a session in the past." });
    }

    const session = await Session.create({
      trainer: trainerId,
      athlete: athleteId,
      date,
      title: title || "Training Session",
      duration: duration || "1 hour",
      location: location || "TBD",
      notes: notes || "",
      status: "scheduled",
    });

    await session.populate("athlete", "name email avatar");

    // Notify the athlete
    const sessionDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
    await createNotification({
      recipient: athleteId,
      type: "session",
      title: "New Session Scheduled",
      message: `${req.user.name} scheduled a training session for ${sessionDate}. ${title || ""}`,
      relatedId: session._id,
      relatedModel: "Session",
    });

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    console.error("Create Session Error:", error);
    res.status(500).json({ message: "Failed to create session", error: error.message });
  }
};

// @desc    Get all sessions for the logged-in Trainer
// @route   GET /api/sessions/trainer
// @access  Private (Trainer)
export const getCoachSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ trainer: req.user._id })
      .populate("athlete", "name email avatar")
      .sort({ date: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Get Trainer Sessions Error:", error);
    res.status(500).json({ message: "Failed to fetch trainer sessions", error: error.message });
  }
};

// @desc    Get all sessions for the logged-in Athlete
// @route   GET /api/sessions/athlete
// @access  Private (Athlete)
export const getTraineeSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ athlete: req.user._id })
      .populate("trainer", "name email avatar")
      .sort({ date: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Get Athlete Sessions Error:", error);
    res.status(500).json({ message: "Failed to fetch athlete sessions", error: error.message });
  }
};

// @desc    Update session status
// @route   PUT /api/sessions/:id/status
// @access  Private (Trainer or Athlete)
export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const sessionId = req.params.id;
    const userId = req.user._id.toString();

    const validStatuses = ["scheduled", "done", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const session = await Session.findById(sessionId)
      .populate("trainer", "name")
      .populate("athlete", "name");
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const isTrainer = session.trainer._id.toString() === userId;
    const isAthlete = session.athlete._id.toString() === userId;

    if (!isTrainer && !isAthlete) {
      return res.status(403).json({ message: "Not authorized to update this session." });
    }

    session.status = status;
    await session.save();

    // Notify the other party
    const recipientId = isTrainer ? session.athlete._id : session.trainer._id;
    const actorName = isTrainer ? session.trainer.name : session.athlete.name;
    
    if (status === "cancelled") {
      await createNotification({
        recipient: recipientId,
        type: "session",
        title: "Session Cancelled",
        message: `${actorName} cancelled the training session.`,
        relatedId: session._id,
        relatedModel: "Session",
      });
    } else if (status === "done") {
      await createNotification({
        recipient: recipientId,
        type: "session",
        title: "Session Completed",
        message: `Training session with ${actorName} has been marked as completed.`,
        relatedId: session._id,
        relatedModel: "Session",
      });
    }

    res.status(200).json({ message: `Session status updated to ${status}`, session });
  } catch (error) {
    console.error("Update Session Status Error:", error);
    res.status(500).json({ message: "Failed to update session status", error: error.message });
  }
};

// @desc    Get accepted athletes (for trainer's session scheduling dropdown)
// @route   GET /api/sessions/accepted-athletes
// @access  Private (Trainer)
export const getAcceptedAthletes = async (req, res) => {
  try {
    const CoachingRequest = (await import("../Models/CoachingRequest.Model.js")).default;
    const acceptedRequests = await CoachingRequest.find({
      trainer: req.user._id,
      status: "accepted",
    }).populate("athlete", "name email avatar");

    // Get unique athletes
    const athleteMap = {};
    acceptedRequests.forEach(r => {
      if (r.athlete) {
        athleteMap[r.athlete._id.toString()] = {
          _id: r.athlete._id,
          name: r.athlete.name,
          email: r.athlete.email,
          avatar: r.athlete.avatar,
        };
      }
    });

    res.json({ athletes: Object.values(athleteMap) });
  } catch (err) {
    console.error("Get accepted athletes error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};