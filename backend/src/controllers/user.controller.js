import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../Models/User.Model.js';
import TrainerProfile from '../Models/TrainerProfile.Model.js';
import AthleteProfile from '../Models/AthleteProfile.Model.js';
import CoachingRequest from '../Models/CoachingRequest.Model.js';
import { sendVerificationEmail } from '../utils/email.util.js';

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'change_this_secret',
    { expiresIn: '7d' }
  );

const safeUser = (user, extra = {}) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || null,
  avatar: user.avatar || null,
  gender: user.gender || null,
  isSubscribed: user.isSubscribed || false,
  isTrainerVerified: user.isTrainerVerified || false,
  ...extra,
});

const getProfileData = async (user) => {
  let profileData = {};
  if (user.role === 'athlete') {
    const profile = await AthleteProfile.findOne({ user: user._id });
    if (profile) {
      profileData = {
        location: profile.location,
        level: profile.level,
        fitnessGoals: profile.fitness_goals,
        sports: profile.sports,
        age: profile.age,
        gender: user.gender || profile.gender,
        goal: profile.goal,
        style: profile.style,
        availability: profile.availability,
        reason: profile.reason,
      };
    }
  } else if (user.role === 'trainer') {
    const profile = await TrainerProfile.findOne({ user: user._id });
    if (profile) {
      profileData = {
        specialization: profile.specialization,
        certifications: profile.certificates,
        experience: profile.experience,
        sports: profile.sports,
        location: profile.location,
        availability: profile.availability,
        price: profile.price,
        philosophy: profile.philosophy,
        achievements: profile.achievements,
        levels: profile.levels,
      };
    }
  }
  return profileData;
};

// ── Register ──────────────────────────────────────────────────────────────
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    const validRoles = ['trainer', 'athlete'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role must be "trainer" or "athlete"' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await User.create({ 
      name, 
      email: email.toLowerCase(), 
      password: hashed, 
      role,
      gender: req.body.gender || 'other',
      verificationToken,
      isVerified: req.body.isVerified || false,
      isSubscribed: false, // New trainers must pay
      isTrainerVerified: false // New trainers must be verified by admin
    });

    // Send verification email only if not already verified
    if (!user.isVerified) {
      sendVerificationEmail(user.email, verificationToken, user.name).catch(console.error);
    }

    // Create the role-specific profile
    let profileData = {};
    if (role === 'trainer') {
      const { specialization, certifications, experience, sports, location, philosophy, achievements, levels, availability, price } = req.body;
      await TrainerProfile.create({
        user: user._id,
        specialization: specialization || (Array.isArray(sports) ? sports.join(', ') : sports) || 'General',
        certificates: certifications ? (Array.isArray(certifications) ? certifications : [certifications]) : [],
        experience: experience || '',
        sports: sports || [],
        location: location || '',
        philosophy: philosophy || '',
        achievements: achievements || '',
        levels: levels || [],
        availability: availability || [],
        price: price || 0,
      });
      profileData = { sports, location, experience, philosophy, achievements, levels, availability, price, certifications };
    } else if (role === 'athlete') {
      const { location, level, fitnessGoals, sports, age, gender, goal, style, availability, reason } = req.body;
      await AthleteProfile.create({
        user: user._id,
        location: location || '',
        fitness_goals: fitnessGoals ? (Array.isArray(fitnessGoals) ? fitnessGoals : [fitnessGoals]) : [],
        level: level || 'beginner',
        sports: sports || [],
        age: age || '',
        gender: gender || '',
        goal: goal || '',
        style: style || '',
        availability: availability || [],
        reason: reason || '',
      });
      profileData = { location, level, sports, age, gender, goal, style, availability, reason, fitnessGoals };
    }

    const token = signToken(user);
    res.status(201).json({ user: safeUser(user, profileData), token });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // If a role is specified, verify it matches the stored role
    if (role && user.role !== role) {
      return res.status(401).json({ message: `No ${role} account found with this email` });
    }

    if (user.status !== 'active') {
      const msg = user.status === 'banned' 
        ? 'Your account has been banned. Please contact support.' 
        : 'Your account has been suspended. Please contact support.';
      return res.status(403).json({ message: msg });
    }

    // if (!user.isVerified) {
    //   return res.status(401).json({ message: 'Please verify your email address before logging in' });
    // }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    // Fetch role-specific profile data
    const profileData = await getProfileData(user);

    const token = signToken(user);
    res.json({ user: safeUser(user, profileData), token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

import OTP from '../Models/Otp.Model.js';
import { sendOTPEmail } from '../utils/email.util.js';

// ── Send OTP ──────────────────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove old OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Create new OTP
    await OTP.create({ email: email.toLowerCase(), otp });

    // Send email
    await sendOTPEmail(email.toLowerCase(), otp);

    res.json({ message: 'Verification code sent to email' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ── Verify OTP ────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired verification code' });

    // OTP is valid, remove it
    await OTP.deleteMany({ email: email.toLowerCase() });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ── Verify Email ──────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Verification token is required' });

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid or expired verification token' });

    user.isVerified = true;
    user.verificationToken = undefined; // clear token
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ── Get current user (me) ─────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const profileData = await getProfileData(user);
    res.json({ user: safeUser(user, profileData) });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ── Admin login ───────────────────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (!user) return res.status(401).json({ message: 'Invalid admin credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid admin credentials' });

    const token = signToken(user);
    res.json({ user: safeUser(user), token });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// ── Get all users (admin) ─────────────────────────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get all athletes (for trainers to browse)
// @route   GET /api/users/athletes
// @access  Private
export const getAthletes = async (req, res) => {
  try {
    const athletes = await User.find({ role: 'athlete', status: { $ne: 'banned' } }).select('-password').lean();

    // Fetch all athlete profiles in one query
    const athleteIds = athletes.map(a => a._id);
    const profiles = await AthleteProfile.find({ user: { $in: athleteIds } }).lean();

    // Build a map of userId -> profile
    const profileMap = {};
    profiles.forEach(p => {
      profileMap[p.user.toString()] = p;
    });

    // Fetch all requests involving this trainer
    const trainerRequests = await CoachingRequest.find({ trainer: req.user._id }).lean();
    const requestMap = {};
    trainerRequests.forEach(r => {
      requestMap[r.athlete.toString()] = { status: r.status, sentBy: r.sentBy, id: r._id };
    });

    // Merge profile data and request status into each athlete
    const enriched = athletes.map(a => {
      const profile = profileMap[a._id.toString()] || {};
      const request = requestMap[a._id.toString()] || null;
      return {
        ...a,
        sports: profile.sports || [],
        level: profile.level || null,
        goal: profile.goal || null,
        age: profile.age || null,
        gender: profile.gender || null,
        fitness_goals: profile.fitness_goals || [],
        style: profile.style || null,
        availability: profile.availability || [],
        profileLocation: profile.location || null,
        connectionStatus: request ? request.status : 'none',
        requestSentBy: request ? request.sentBy : null,
        requestId: request ? request.id : null,
      };
    });

    res.json({ athletes: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, avatar, phone, ...profileUpdates } = req.body;

    const userUpdates = {};
    if (name !== undefined) userUpdates.name = name;
    if (email !== undefined) userUpdates.email = email.toLowerCase();
    if (phone !== undefined) userUpdates.phone = phone;
    if (avatar !== undefined) userUpdates.avatar = avatar;
    if (req.body.gender !== undefined) userUpdates.gender = req.body.gender;
    if (password) {
      userUpdates.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, userUpdates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update role-specific profile
    if (user.role === 'athlete') {
      const athleteUpdates = {
        location: profileUpdates.location,
        level: profileUpdates.level,
        sports: profileUpdates.sports,
        age: profileUpdates.age,
        gender: profileUpdates.gender,
        goal: profileUpdates.goal,
        style: profileUpdates.style,
        availability: profileUpdates.availability,
        reason: profileUpdates.reason,
      };
      // Clean up undefined
      Object.keys(athleteUpdates).forEach(k => athleteUpdates[k] === undefined && delete athleteUpdates[k]);
      
      await AthleteProfile.findOneAndUpdate({ user: user._id }, athleteUpdates, { upsert: true });
    } else if (user.role === 'trainer') {
      const trainerUpdates = {
        specialization: profileUpdates.specialization,
        experience: profileUpdates.experience,
        sports: profileUpdates.sports,
        location: profileUpdates.location,
        philosophy: profileUpdates.philosophy,
        achievements: profileUpdates.achievements,
        levels: profileUpdates.levels,
        availability: profileUpdates.availability,
        price: profileUpdates.price,
      };
      Object.keys(trainerUpdates).forEach(k => trainerUpdates[k] === undefined && delete trainerUpdates[k]);
 
      await TrainerProfile.findOneAndUpdate({ user: user._id }, trainerUpdates, { upsert: true });
    }

    const profileData = await getProfileData(user);
    res.json({ user: safeUser(user, profileData) });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const updateMe = async (req, res) => {
  try {
    req.params.id = req.user.id;
    return updateUser(req, res);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted', user });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const updateAvatar = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const profileData = await getProfileData(user);
    res.json({ user: safeUser(user, profileData) });
  } catch (err) {
    console.error('Update avatar error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
