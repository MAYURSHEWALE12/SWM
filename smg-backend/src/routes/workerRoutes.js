const express = require('express');
const router = express.Router();
const { getWorkers } = require('../controllers/workerController');
const { protect, authorize } = require('../middlewares/auth');

router.route('/')
  .get(protect, authorize('admin'), getWorkers);

module.exports = router;
