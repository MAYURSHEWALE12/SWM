const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Private (Admin)
const getWorkers = asyncHandler(async (req, res) => {
  const workers = await User.find({ role: 'worker' }).select('-password');
  
  // Calculate assigned complaints per worker
  const workersWithStats = await Promise.all(workers.map(async (worker) => {
    const assignedCount = await Complaint.countDocuments({ assignedWorker: worker._id, status: { $in: ['assigned', 'in_progress'] } });
    return {
      ...worker.toObject(),
      assignedCount
    };
  }));

  res.status(200).json(workersWithStats);
});

module.exports = {
  getWorkers,
};
