import express from 'express';
import {
  createUser,
  login,
  adminLogin,
  getMe,
  getUsers,
  getUserById,
  updateUser,
  updateMe,
  deleteUser,
  verifyEmail,
  sendOtp,
  verifyOtp,
  getAthletes,
  updateAvatar,
  changePassword,
} from '../controllers/user.controller.js';

import { protect } from '../middlewares/Auth.Middleware.js';
import { isAdmin } from '../middlewares/Role.Middleware.js';
import { upload } from '../middlewares/upload.middleware.js';


const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────
router.post('/register', createUser);          // athlete or trainer signup
router.post('/login', login);                  // athlete or trainer login
router.post('/admin/login', adminLogin);       // admin login
router.get('/verify-email', verifyEmail);      // verify email link
router.post('/send-otp', sendOtp);             // send OTP code
router.post('/verify-otp', verifyOtp);         // verify OTP code

// ── Protected ─────────────────────────────────────────────────────────────
router.get('/me', protect, getMe);             // get current user
router.put('/me', protect, updateMe);             // update current user
router.put('/avatar', protect, upload.single('avatar'), updateAvatar); // update avatar
router.put('/change-password', protect, changePassword); // change password
router.get('/athletes', protect, getAthletes); // get all athletes (for trainers)

// ── Admin only ────────────────────────────────────────────────────────────
router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;
