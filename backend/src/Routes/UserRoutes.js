import express from 'express';
import {
  createUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

import { protect } from '../middlewares/Auth.Middleware.js';
import { isAdmin } from '../middlewares/Role.Middleware.js';

const router = express.Router();

// Public
router.post('/register', createUser);
router.post('/login', login);

// Protected
router.get('/', protect, isAdmin, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

export default router;
