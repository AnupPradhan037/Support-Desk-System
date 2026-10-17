const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }

  const token = authHeader.split(' ')[1]

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    res.status(401)
    throw new Error('Not authorized, token failed')
  }

  const user = await User.findById(decoded.id).select('-password')

  if (!user) {
    res.status(401)
    throw new Error('Not authorized, user not found')
  }

  req.user = user
  next()
})

// Use after protect: blocks non-staff users
const staffOnly = (req, res, next) => {
  if (!req.user || !req.user.isStaff) {
    res.status(403)
    throw new Error('Staff access only')
  }
  next()
}

module.exports = { protect, staffOnly }