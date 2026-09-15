const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, password, role } = req.body;

  if (!name || !phone || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ phone });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let workerId = undefined;
  if (role === 'worker') {
    // Generate a simple worker ID e.g., W-1042
    workerId = 'W-' + Math.floor(1000 + Math.random() * 9000);
  }

  // Create user
  const user = await User.create({
    name,
    phone,
    password,
    role: role || 'citizen',
    workerId
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      workerId: user.workerId,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  // Check for user phone
  const user = await User.findOne({ phone });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      workerId: user.workerId,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    name: req.user.name,
    phone: req.user.phone,
    role: req.user.role,
    workerId: req.user.workerId,
  };
  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
