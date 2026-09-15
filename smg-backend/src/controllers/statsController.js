const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');

// @desc    Get dashboard statistics
// @route   GET /api/stats/dashboard
// @access  Private (Admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  const total = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: 'pending' });
  const assigned = await Complaint.countDocuments({ status: 'assigned' });
  const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
  const resolved = await Complaint.countDocuments({ status: 'resolved' });

  // Group by issue type
  const issueTypesAgg = await Complaint.aggregate([
    { $group: { _id: '$issueType', count: { $sum: 1 } } }
  ]);
  
  const issueTypes = {};
  issueTypesAgg.forEach(item => {
    issueTypes[item._id] = item.count;
  });

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  res.status(200).json({
    counts: { total, pending, assigned, in_progress: inProgress, resolved },
    issueTypes,
    resolutionRate
  });
});

module.exports = {
  getDashboardStats,
};
