import Review from "../Models/Review.Model.js";
import CoachProfile from "../Models/Coach.Model.js";
import User from "../Models/User.Model.js";

// @desc    Create a new review for a coach
// @route   POST /api/reviews/coach/:coachId
// @access  Private (Logged in Trainee/User)
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const coachId = req.params.coachId;
    const traineeId = req.user.id;

    // 1. Validate the rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a valid rating between 1 and 5" });
    }

    // 2. Check if the coach exists in User model and has a CoachProfile
    const coachUser = await User.findById(coachId);
    if (!coachUser || coachUser.role !== "coach") {
      return res.status(404).json({ message: "Coach not found in users" });
    }

    const coachProfile = await CoachProfile.findOne({ user: coachId });
    if (!coachProfile) {
      return res.status(404).json({ message: "Coach profile not found" });
    }

    // 3. Prevent duplicate reviews: Check if this user already reviewed this coach
    const alreadyReviewed = await Review.findOne({ trainee: traineeId, coach: coachId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this coach" });
    }

    // 4. Create the new review
    const review = new Review({
      trainee: traineeId,
      coach: coachId,
      rating: Number(rating),
      comment: comment || "",
    });

    await review.save();

    // 5. Update the CoachProfile's overall rating and number of reviews
    // Fetch all reviews for this coach to calculate the new average
    const allCoachReviews = await Review.find({ coach: coachId });
    
    // Calculate the average rating
    const totalRating = allCoachReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / allCoachReviews.length;

    // Update the coach profile 
    coachProfile.ratingCount = allCoachReviews.length;
    coachProfile.ratingAvg = averageRating;
    await coachProfile.save();

    res.status(201).json({ 
      message: "Review added successfully", 
      review 
    });

  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: "Server error while creating review", error: error.message });
  }
};

// @desc    Get all reviews for a specific coach
// @route   GET /api/reviews/coach/:coachId
// @access  Public
export const getCoachReviews = async (req, res) => {
  try {
    const coachId = req.params.coachId;

    // Fetch reviews for the coach and populate the trainee's name to display on the frontend
    const reviews = await Review.find({ coach: coachId })
      .populate("trainee", "name avatar") // Fetches name and avatar of the trainee
      .sort({ createdAt: -1 }); // Newest reviews first

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Coach Reviews Error:", error);
    res.status(500).json({ message: "Server error while fetching reviews", error: error.message });
  }
};