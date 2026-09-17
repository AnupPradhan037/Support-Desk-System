const express = require('express')

const router =
  express.Router()

const {
  getNotes,
  createNote,
} = require(
  '../controllers/noteController'
)

const {
  protect,
} = require(
  '../middleware/authMiddleware'
)

// GET NOTES
router.get(
  '/',
  protect,
  getNotes
)

// CREATE NOTE
router.post(
  '/',
  protect,
  createNote
)

module.exports = router