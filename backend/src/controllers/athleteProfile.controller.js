import AthleteProfile from "../Models/AthleteProfile.Model.js";
import TrainerProfile from "../Models/TrainerProfile.Model.js";
import User from "../Models/User.Model.js";

// @desc    Toggle favorite trainer
// @route   POST /api/athlete-profiles/favorites/:trainerId
// @access  Private (Athlete)
export const toggleFavorite = async (req, res) => {
  try {
    const { trainerId } = req.params;
    let profile = await AthleteProfile.findOne({ user: req.user.id });

    if (!profile) {
      profile = await AthleteProfile.create({
        user: req.user.id,
        favorites: [],
      });
    }

    const index = profile.favorites.indexOf(trainerId);
    if (index === -1) {
      profile.favorites.push(trainerId);
    } else {
      profile.favorites.splice(index, 1);
    }

    await profile.save();
    res.status(200).json({ message: "Favorites updated", favorites: profile.favorites });
  } catch (error) {
    res.status(500).json({ message: "Failed to update favorites", error: error.message });
  }
};

// @desc    Get athlete favorites
// @route   GET /api/athlete-profiles/favorites
// @access  Private (Athlete)
export const getFavorites = async (req, res) => {
  try {
    let profile = await AthleteProfile.findOne({ user: req.user.id })
      .populate({
        path: 'favorites',
        select: 'name email avatar role createdAt',
      });

    if (!profile) {
      return res.status(200).json({ favorites: [] });
    }

    // Enrich each favorite trainer with their TrainerProfile data
    const favoriteUsers = profile.favorites || [];
    const trainerIds = favoriteUsers.map(u => u._id);
    const trainerProfiles = await TrainerProfile.find({ user: { $in: trainerIds } }).lean();
    const profileMap = {};
    trainerProfiles.forEach(p => {
      profileMap[p.user.toString()] = p;
    });

    const enriched = favoriteUsers.map(u => {
      const uObj = u.toObject ? u.toObject() : u;
      const tp = profileMap[uObj._id.toString()] || {};
      return {
        ...uObj,
        sport: tp.sports?.[0] || tp.specialization || 'Fitness',
        sports: tp.sports || [],
        rating: tp.ratingAvg || 0,
        location: tp.location || 'Online',
        experience: tp.experience,
      };
    });

    res.status(200).json({ favorites: enriched });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites", error: error.message });
  }
};
