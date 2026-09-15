const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/dashboard')
  .get(protect, authorize('admin'), getDashboardStats);

module.exports = router;
