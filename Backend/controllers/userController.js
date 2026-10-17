const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all the fields')
  }

  const normalizedEmail = email.trim().toLowerCase()

  const userExists = await User.findOne({ email: normalizedEmail })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isStaff: user.isStaff,
    token: generateToken(user._id),
  })
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() })

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
    throw new Error('Invalid credentials')
  }
})

// @desc    Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isStaff: req.user.isStaff,
  })
})

// @desc    Update profile (name and/or password)
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const { name, currentPassword, newPassword } = req.body

  if (name === undefined && newPassword === undefined) {
    res.status(400)
    throw new Error(
      currentPassword !== undefined
        ? 'New password is required with the current password'
        : 'Please provide a name or new password to update'
    )
  }

  const user = await User.findById(req.user._id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      res.status(400)
      throw new Error('Name must be a non-empty string')
    }
    user.name = name.trim()
  }

  if (newPassword !== undefined) {
    if (typeof newPassword !== 'string' || !newPassword) {
      res.status(400)
      throw new Error('New password cannot be empty')
    }
    if (typeof currentPassword !== 'string' || !currentPassword) {
      res.status(400)
      throw new Error('Current password is required to set a new one')
    }
    if (newPassword.length < 6) {
      res.status(400)
      throw new Error('New password must be at least 6 characters')
    }

    const matches = await bcrypt.compare(currentPassword, user.password)
    if (!matches) {
      res.status(401)
      throw new Error('Current password is incorrect')
    }

    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10))
  }

  if (currentPassword !== undefined && newPassword === undefined) {
    res.status(400)
    throw new Error('New password is required with the current password')
  }

  const updated = await user.save()

  res.status(200).json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    isStaff: updated.isStaff,
    token: generateToken(updated._id),
  })
})

module.exports = { registerUser, loginUser, getMe, updateMe }