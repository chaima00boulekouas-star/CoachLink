import express from 'express';
import {
  sendRequest,
  getIncomingRequests,
  getOutgoingRequests,
  getAllRequests,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from '../controllers/request.controller.js';
import { protect } from '../middlewares/Auth.Middleware.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, sendRequest);
router.get('/', protect, getAllRequests);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.put('/:id/accept', protect, acceptRequest);     // trainer accepts
router.put('/:id/decline', protect, declineRequest);   // trainer declines
router.delete('/:id', protect, cancelRequest);         // athlete cancels

export default router;
