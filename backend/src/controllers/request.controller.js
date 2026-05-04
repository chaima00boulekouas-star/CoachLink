import CoachingRequest from '../Models/CoachingRequest.Model.js';
import User from '../Models/User.Model.js';
import { createNotification } from './notification.controller.js';

// @desc    Send a coaching request (athlete → trainer)
// @route   POST /api/requests
// @access  Private (Athlete)
export const sendRequest = async (req, res) => {
  try {
    const { trainerId: recipientId, message } = req.body;
    const senderId = req.user._id;

    if (!recipientId || !message) {
      return res.status(400).json({ message: 'Recipient ID and message are required' });
    }

    // Check recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Validate roles
    if (req.user.role === 'athlete' && recipient.role !== 'trainer') {
      return res.status(400).json({ message: 'Athletes can only send requests to trainers' });
    }
    if (req.user.role === 'trainer' && recipient.role !== 'athlete') {
      return res.status(400).json({ message: 'Trainers can only send invitations to athletes' });
    }

    const athleteId = req.user.role === 'athlete' ? senderId : recipientId;
    const trainerId = req.user.role === 'trainer' ? senderId : recipientId;

    // Check if a pending request already exists
    const existing = await CoachingRequest.findOne({
      athlete: athleteId,
      trainer: trainerId,
      status: 'pending',
    });
    if (existing) {
      return res.status(409).json({ message: 'A pending request already exists between you' });
    }

    const request = await CoachingRequest.create({
      athlete: athleteId,
      trainer: trainerId,
      message,
      sentBy: req.user.role
    });

    // Populate the other person's info for the response
    const populateField = req.user.role === 'athlete' ? 'trainer' : 'athlete';
    await request.populate(populateField, 'name email avatar');

    // Notify the recipient
    await createNotification({
      recipient: recipientId,
      type: 'request',
      title: req.user.role === 'athlete' ? 'New Training Request' : 'New Coaching Invitation',
      message: `${req.user.name} sent you a ${req.user.role === 'athlete' ? 'request' : 'invitation'}.`,
      relatedId: request._id,
      relatedModel: 'CoachingRequest',
    });

    res.status(201).json({ request });
  } catch (err) {
    console.error('Send request error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get incoming requests (where user is the recipient)
// @route   GET /api/requests/incoming
// @access  Private
export const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const query = {
      $or: [
        { trainer: userId, sentBy: 'athlete' },
        { athlete: userId, sentBy: 'trainer' }
      ]
    };

    const requests = await CoachingRequest.find(query)
      .populate('athlete', 'name email avatar phone')
      .populate('trainer', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error('Get incoming requests error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get outgoing requests (where user is the sender)
// @route   GET /api/requests/outgoing
// @access  Private
export const getOutgoingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const query = {
      $or: [
        { athlete: userId, sentBy: 'athlete' },
        { trainer: userId, sentBy: 'trainer' }
      ]
    };

    const requests = await CoachingRequest.find(query)
      .populate('athlete', 'name email avatar phone')
      .populate('trainer', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error('Get outgoing requests error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// @desc    Get all requests for the current user
// @route   GET /api/requests
// @access  Private
export const getAllRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await CoachingRequest.find({
      $or: [{ athlete: userId }, { trainer: userId }]
    })
      .populate('athlete', 'name email avatar phone')
      .populate('trainer', 'name email avatar phone')
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (err) {
    console.error('Get all requests error:', err);
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

    // Verify the correct person is responding
    const isTrainerResponding = request.sentBy === 'athlete' && request.trainer.toString() === req.user._id.toString();
    const isAthleteResponding = request.sentBy === 'trainer' && request.athlete.toString() === req.user._id.toString();

    if (!isTrainerResponding && !isAthleteResponding) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
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

    const isTrainerResponding = request.sentBy === 'athlete' && request.trainer.toString() === req.user._id.toString();
    const isAthleteResponding = request.sentBy === 'trainer' && request.athlete.toString() === req.user._id.toString();

    if (!isTrainerResponding && !isAthleteResponding) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
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
