const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create a complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
const createComplaint = asyncHandler(async (req, res) => {
  const { issueType, location, description, beforePhoto, coordinates } = req.body;

  if (!issueType || !location || !beforePhoto) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const complaintId = 'SS-' + Math.floor(10000 + Math.random() * 90000);

  const complaint = await Complaint.create({
    complaintId,
    citizen: req.user.id,
    citizenName: req.user.name,
    issueType,
    location,
    description,
    beforePhoto,
    coordinates,
    status: 'pending',
  });

  res.status(201).json(complaint);
});

// @desc    Get complaints
// @route   GET /api/complaints
// @access  Private
const getComplaints = asyncHandler(async (req, res) => {
  let complaints;
  
  if (req.user.role === 'admin') {
    // Admin gets all complaints, optionally filter by status
    const filter = req.query.status && req.query.status !== 'all' ? { status: req.query.status } : {};
    complaints = await Complaint.find(filter).populate('assignedWorker', 'name phone workerId').sort('-createdAt');
  } else if (req.user.role === 'worker') {
    // Worker gets only their assigned complaints
    complaints = await Complaint.find({ assignedWorker: req.user.id }).populate('assignedWorker', 'name phone workerId').sort('-createdAt');
  } else {
    // Citizen gets only their created complaints
    complaints = await Complaint.find({ citizen: req.user.id }).populate('assignedWorker', 'name phone workerId').sort('-createdAt');
  }

  res.status(200).json(complaints);
});

// @desc    Get specific complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id).populate('assignedWorker', 'name phone workerId');

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  res.status(200).json(complaint);
});

// @desc    Assign worker to complaint
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Admin)
const assignWorker = asyncHandler(async (req, res) => {
  const { workerId } = req.body;
  
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  const worker = await User.findById(workerId);
  if (!worker || worker.role !== 'worker') {
    res.status(400);
    throw new Error('Invalid worker ID');
  }

  complaint.assignedWorker = worker._id;
  complaint.status = 'assigned';
  await complaint.save();

  res.status(200).json(complaint);
});

// @desc    Update complaint status (Worker marks in_progress / adds afterPhoto)
// @route   PATCH /api/complaints/:id/status
// @access  Private (Worker)
const updateStatus = asyncHandler(async (req, res) => {
  const { status, afterPhoto } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  // Ensure worker can only update their assigned complaints
  if (complaint.assignedWorker.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this complaint');
  }

  if (status) complaint.status = status;
  if (afterPhoto) complaint.afterPhoto = afterPhoto;

  await complaint.save();

  res.status(200).json(complaint);
});

// @desc    Resolve complaint
// @route   PATCH /api/complaints/:id/resolve
// @access  Private (Admin)
const resolveComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  complaint.status = 'resolved';
  complaint.resolvedAt = Date.now();
  await complaint.save();

  res.status(200).json(complaint);
});

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignWorker,
  updateStatus,
  resolveComplaint
};
