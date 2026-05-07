import Review from "../Models/Review.Model.js";
import TrainerProfile from "../Models/TrainerProfile.Model.js";
import User from "../Models/User.Model.js";

// @desc    Create a new review for a coach
// @route   POST /api/reviews/coach/:coachId
// @access  Private (Logged in Trainee/User)
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const trainerId = req.params.trainerId || req.params.coachId;
    const athleteId = req.user.id;

    // 1. Validate the rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating between 1 and 5" });
    }

    // 2. Check if the trainer exists in User model and has a TrainerProfile
    const trainerUser = await User.findById(trainerId);
    if (!trainerUser || trainerUser.role !== "trainer") {
      return res.status(404).json({ message: "Trainer not found in users" });
    }

    const trainerProfile = await TrainerProfile.findOne({ user: trainerId });
    if (!trainerProfile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    // 3. Prevent duplicate reviews: Check if this user already reviewed this trainer
    const alreadyReviewed = await Review.findOne({ athlete: athleteId, trainer: trainerId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this trainer" });
    }

    // 4. Create the new review
    const review = new Review({
      athlete: athleteId,
      trainer: trainerId,
      rating: Number(rating),
      comment: comment || "",
    });

    await review.save();

    // 5. Update the TrainerProfile's overall rating and number of reviews
    // Fetch all reviews for this trainer to calculate the new average
    const allTrainerReviews = await Review.find({ trainer: trainerId });
    
    // Calculate the average rating
    const totalRating = allTrainerReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / allTrainerReviews.length;

    // Update the trainer profile 
    trainerProfile.ratingCount = allTrainerReviews.length;
    trainerProfile.ratingAvg = averageRating;
    await trainerProfile.save();

    res.status(201).json({ 
      message: "Review added successfully", 
      review 
    });

  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: "Server error while creating review", error: error.message });
  }
};

// @desc    Get all reviews for a specific trainer
// @route   GET /api/reviews/trainer/:trainerId
// @access  Public
export const getCoachReviews = async (req, res) => {
  try {
    const trainerId = req.params.trainerId || req.params.coachId;

    // Fetch reviews for the trainer and populate the athlete's name to display on the frontend
    const reviews = await Review.find({ trainer: trainerId })
      .populate("athlete", "name avatar gender") // Fetches name, avatar and gender of the athlete
      .sort({ createdAt: -1 }); // Newest reviews first

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Trainer Reviews Error:", error);
    res.status(500).json({ message: "Server error while fetching reviews", error: error.message });
  }
};