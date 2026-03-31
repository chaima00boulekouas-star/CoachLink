import CoachProfile from "../Models/Coach.Model.js";

// @desc    Create or update the coach profile
// @route   POST /api/coach-profiles
// @access  Private (Coach only)
export const manageCoachProfile = async (req, res) => {
  try {
    const { sports, experienceYears, certifications, bio, pricePerSession } = req.body;
    const userId = req.user.id;

    if (!sports || sports.length === 0 || experienceYears === undefined || pricePerSession === undefined) {
      return res.status(400).json({ message: "Sports, experience years, and price per session are required." });
    }

    if (pricePerSession < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    // Check if the profile already exists
    let profile = await CoachProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile = await CoachProfile.findOneAndUpdate(
        { user: userId },
        { $set: { sports, experienceYears, certifications, bio, pricePerSession } },
        { new: true } // Return the updated document
      );
      return res.status(200).json({ message: "Profile updated successfully", profile });
    }

    // If it doesn't exist, create a new profile
    profile = new CoachProfile({
      user: userId,
      sports,
      experienceYears,
      certifications,
      bio,
      pricePerSession
    });

    await profile.save();

    res.status(201).json({ message: "Profile created successfully", profile });

  } catch (error) {
    res.status(500).json({ message: "Failed to manage profile", error: error.message });
  }
};

// @desc    Get coach profile
// @route   GET /api/coach-profiles/:id
// @access  Public
export const getCoachProfile = async (req, res) => {
  try {
    const profile = await CoachProfile.findOne({ user: req.params.id }).populate('user', 'name email');
    
    if (!profile) {
      return res.status(404).json({ message: "Coach profile not found" });
    }
    
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};