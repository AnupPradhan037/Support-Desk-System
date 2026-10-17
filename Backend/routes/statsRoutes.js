const express = require('express')
const router = express.Router()

const { getStats } = require('../controllers/statsController')
const { protect, staffOnly } = require('../middleware/authMiddleware')

router.get('/', protect, staffOnly, getStats)

module.exports = router