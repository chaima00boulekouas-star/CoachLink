import TrainerProfile from "../Models/TrainerProfile.Model.js";


//add get All coaches and delete coach profile


// @desc    Create or update the coach profile
// @route   POST /api/coach-profiles
// @access  Private (Coach only)
export const manageCoachProfile = async (req, res) => {
  try {
    const { sports, experience, specialization, certificates, philosophy, price, achievements, levels, availability, location } = req.body;
    const userId = req.user.id;

    if (!sports || sports.length === 0 || experience === undefined || price === undefined) {
      return res.status(400).json({ message: "Sports, experience, and price are required." });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    // Check if the profile already exists
    let profile = await TrainerProfile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile = await TrainerProfile.findOneAndUpdate(
        { user: userId },
        { $set: { sports, experience, specialization, certificates, philosophy, price, achievements, levels, availability, location } },
        { new: true } // Return the updated document
      );
      return res.status(200).json({ message: "Profile updated successfully", profile });
    }

    // If it doesn't exist, create a new profile
    profile = new TrainerProfile({
      user: userId,
      sports,
      experience,
      specialization,
      certificates,
      philosophy,
      price,
      achievements,
      levels,
      availability,
      location
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
    const profile = await TrainerProfile.findOne({ user: req.params.id }).populate('user', 'name email avatar');
    
    if (!profile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }
    
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// @desc    Toggle favorite athlete
// @route   POST /api/coach-profiles/favorites/:athleteId
// @access  Private (Trainer)
export const toggleFavorite = async (req, res) => {
  try {
    const { athleteId } = req.params;
    const profile = await TrainerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    const index = profile.favorites.indexOf(athleteId);
    if (index === -1) {
      profile.favorites.push(athleteId);
    } else {
      profile.favorites.splice(index, 1);
    }

    await profile.save();
    res.status(200).json({ message: "Favorites updated", favorites: profile.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to update favorites", error: error.message });
  }
};

// @desc    Get trainer favorites
// @route   GET /api/coach-profiles/favorites
// @access  Private (Trainer)
export const getFavorites = async (req, res) => {
  try {
    const profile = await TrainerProfile.findOne({ user: req.user.id })
      .populate({
        path: 'favorites',
        select: 'name email avatar location',
      });

    if (!profile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }

    res.status(200).json({ favorites: profile.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites", error: error.message });
  }
};