const express = require('express')
const router = express.Router({ mergeParams: true }) // required to read :ticketId

const { getNotes, createNote } = require('../controllers/noteController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getNotes).post(protect, createNote)

module.exports = router