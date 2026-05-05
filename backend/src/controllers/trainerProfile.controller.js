import TrainerProfile from "../Models/TrainerProfile.Model.js";
import User from "../Models/User.Model.js";
import AthleteProfile from "../Models/AthleteProfile.Model.js";

// @desc    Get all trainers with filters
// @route   GET /api/trainer-profiles
// @access  Public
export const getAllTrainers = async (req, res) => {
  try {
    const { sport, wilaya, experience, search, maxPrice } = req.query;
    
    let query = {};
    
    // Filter by sport
    if (sport && sport !== 'All') {
      query.sports = { $in: [sport] };
    }
    
    // Filter by location (wilaya)
    if (wilaya && wilaya !== 'All') {
      query.location = { $regex: wilaya, $options: 'i' };
    }
    
    // Filter by experience
    if (experience && experience !== 'All') {
      query.experience = experience;
    }

    // Filter by maxPrice
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    let trainerProfiles = await TrainerProfile.find(query).populate('user', 'name email avatar isTrainerVerified isSubscribed');

    // Search by name, specialization, or sport
    if (search) {
      const searchLower = search.toLowerCase();
      trainerProfiles = trainerProfiles.filter(profile => 
        (profile.user?.name && profile.user.name.toLowerCase().includes(searchLower)) ||
        (profile.specialization && profile.specialization.toLowerCase().includes(searchLower)) ||
        (profile.sports && profile.sports.some(s => s.toLowerCase().includes(searchLower)))
      );
    }

    // Map to the structure the frontend expects
    const formattedTrainers = trainerProfiles.map(profile => ({
      _id: profile.user?._id,
      id: profile.user?._id,
      name: profile.user?.name || 'Anonymous Coach',
      image: profile.user?.avatar ? `http://localhost:5000${profile.user.avatar}` : 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=200',
      rating: profile.ratingAvg || 0,
      ratingCount: profile.ratingCount || 0,
      sport: profile.sports?.[0] || profile.specialization || 'Fitness',
      sports: profile.sports || [],
      location: profile.location || 'Online',
      price: profile.price,
      experience: profile.experience,
      specialization: profile.specialization,
      isTrainerVerified: profile.user?.isTrainerVerified || false,
      isSubscribed: profile.user?.isSubscribed || false
    }));

    res.status(200).json({ trainers: formattedTrainers });
  } catch (error) {
    console.error('Get all trainers error:', error);
    res.status(500).json({ message: "Failed to fetch trainers", error: error.message });
  }
};


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
    let targetId = req.params.id;
    
    // Handle 'me' for authenticated trainer (either via param or explicit /me route)
    if (targetId === 'me' || !targetId) {
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized to view profile" });
      }
      targetId = req.user.id;
    }

    const profile = await TrainerProfile.findOne({ user: targetId }).populate('user', 'name email avatar isTrainerVerified isSubscribed');
    
    if (!profile) {
      return res.status(404).json({ message: "Trainer profile not found" });
    }
    
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// @desc    Toggle favorite athlete
// @route   POST /api/trainer-profiles/favorites/:athleteId
// @access  Private (Trainer)
export const toggleFavorite = async (req, res) => {
  try {
    const { athleteId } = req.params;
    let profile = await TrainerProfile.findOne({ user: req.user.id });

    if (!profile) {
      // Auto-create a minimal trainer profile so favorites still work
      profile = await TrainerProfile.create({
        user: req.user.id,
        specialization: 'General',
        favorites: [],
      });
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
// @route   GET /api/trainer-profiles/favorites
// @access  Private (Trainer)
export const getFavorites = async (req, res) => {
  try {
    let profile = await TrainerProfile.findOne({ user: req.user.id })
      .populate({
        path: 'favorites',
        select: 'name email avatar role createdAt',
      });

    if (!profile) {
      // No profile yet — return empty favorites instead of 404
      return res.status(200).json({ favorites: [] });
    }

    // Enrich each favorite athlete with their AthleteProfile data
    const favoriteUsers = profile.favorites || [];
    const athleteIds = favoriteUsers.map(u => u._id);
    const athleteProfiles = await AthleteProfile.find({ user: { $in: athleteIds } }).lean();
    const profileMap = {};
    athleteProfiles.forEach(p => {
      profileMap[p.user.toString()] = p;
    });

    const enriched = favoriteUsers.map(u => {
      const uObj = u.toObject ? u.toObject() : u;
      const ap = profileMap[uObj._id.toString()] || {};
      return {
        ...uObj,
        sports: ap.sports || [],
        level: ap.level || null,
        goal: ap.goal || null,
        profileLocation: ap.location || null,
      };
    });

    res.status(200).json({ favorites: enriched });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites", error: error.message });
  }
};