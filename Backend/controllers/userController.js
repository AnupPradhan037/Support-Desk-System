const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModels')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  )
}

// @desc    Register User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validate fields
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all the fields')
  }

  // Check if user already exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (!user) {
    res.status(400)
    throw new Error('Invalid User')
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isStaff: user.isStaff,
    token: generateToken(user._id),
  })
})

// @desc    Login User
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user
  const user = await User.findOne({ email })

  // Check credentials
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isStaff: user.isStaff,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid Credentials')
  }
})

// @desc    Get Current User
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isStaff: user.isStaff,
  })
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
}