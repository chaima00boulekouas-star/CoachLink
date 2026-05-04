import express from 'express';
import {
  sendRequest,
  getIncomingRequests,
  getOutgoingRequests,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from '../controllers/request.controller.js';
import { protect } from '../middlewares/Auth.Middleware.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, sendRequest);              // athlete sends request
router.get('/incoming', protect, getIncomingRequests); // trainer gets incoming
router.get('/outgoing', protect, getOutgoingRequests); // athlete gets outgoing
router.put('/:id/accept', protect, acceptRequest);     // trainer accepts
router.put('/:id/decline', protect, declineRequest);   // trainer declines
router.delete('/:id', protect, cancelRequest);         // athlete cancels

export default router;
