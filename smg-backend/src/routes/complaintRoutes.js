const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignWorker,
  updateStatus,
  resolveComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .post(protect, authorize('citizen'), createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaintById);

router.route('/:id/assign')
  .patch(protect, authorize('admin'), assignWorker);

router.route('/:id/status')
  .patch(protect, authorize('worker', 'admin'), updateStatus);

router.route('/:id/resolve')
  .patch(protect, authorize('admin'), resolveComplaint);

module.exports = router;
