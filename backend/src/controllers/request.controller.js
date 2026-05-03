import CoachingRequest from '../Models/CoachingRequest.Model.js';
import User from '../Models/User.Model.js';
import { createNotification } from './notification.controller.js';

// @desc    Send a coaching request (athlete → trainer)
// @route   POST /api/requests
// @access  Private (Athlete)
export const sendRequest = async (req, res) => {
  try {
    const { trainerId, message } = req.body;
    const athleteId = req.user._id;

    if (!trainerId || !message) {
      return res.status(400).json({ message: 'Trainer ID and message are required' });
    }

    // Check trainer exists and is actually a trainer
    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Check if a pending request already exists
    const existing = await CoachingRequest.findOne({
      athlete: athleteId,
      trainer: trainerId,
      status: 'pending',
    });
    if (existing) {
      return res.status(409).json({ message: 'You already have a pending request with this trainer' });
    }

    const request = await CoachingRequest.create({
      athlete: athleteId,
      trainer: trainerId,
      message,
    });

    // Populate for the response
    await request.populate('trainer', 'name email avatar');

    // Notify the trainer about the new request
    await createNotification({
      recipient: trainerId,
      type: 'request',
      title: 'New Training Request',
      message: `${req.user.name} sent you a training request.`,
      relatedId: request._id,
      relatedModel: 'CoachingRequest',
    });

    res.status(201).json({ request });
  } catch (err) {
    console.error('Send request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get incoming requests (for trainer)
// @route   GET /api/requests/incoming
// @access  Private (Trainer)
export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await CoachingRequest.find({ trainer: req.user._id })
      .populate('athlete', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error('Get incoming requests error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get outgoing requests (for athlete)
// @route   GET /api/requests/outgoing
// @access  Private (Athlete)
export const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await CoachingRequest.find({ athlete: req.user._id })
      .populate('trainer', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error('Get outgoing requests error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Accept a request (trainer action)
// @route   PUT /api/requests/:id/accept
// @access  Private (Trainer)
export const acceptRequest = async (req, res) => {
  try {
    const request = await CoachingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Verify trainer owns this request
    if (request.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    request.status = 'accepted';
    await request.save();

    await request.populate('athlete', 'name email avatar phone');

    // Notify the athlete that their request was accepted
    await createNotification({
      recipient: request.athlete._id,
      type: 'request_accepted',
      title: 'Request Accepted! 🎉',
      message: `${req.user.name} accepted your training request. You can now schedule sessions!`,
      relatedId: request._id,
      relatedModel: 'CoachingRequest',
    });

    res.json({ request });
  } catch (err) {
    console.error('Accept request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Decline a request (trainer action)
// @route   PUT /api/requests/:id/decline
// @access  Private (Trainer)
export const declineRequest = async (req, res) => {
  try {
    const request = await CoachingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    request.status = 'rejected';
    await request.save();

    await request.populate('athlete', 'name email avatar phone');

    // Notify the athlete that their request was declined
    await createNotification({
      recipient: request.athlete._id,
      type: 'request_declined',
      title: 'Request Declined',
      message: `${req.user.name} declined your training request.`,
      relatedId: request._id,
      relatedModel: 'CoachingRequest',
    });

    res.json({ request });
  } catch (err) {
    console.error('Decline request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Cancel a request (athlete action)
// @route   DELETE /api/requests/:id
// @access  Private (Athlete)
export const cancelRequest = async (req, res) => {
  try {
    const request = await CoachingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.athlete.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }

    await CoachingRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Request cancelled' });
  } catch (err) {
    console.error('Cancel request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
