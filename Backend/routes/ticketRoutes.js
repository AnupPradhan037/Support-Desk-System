const express = require('express')
const router = express.Router()

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeTicket,
  reopenTicket,
  assignTicket,
  unassignTicket,
  deleteTicket,
} = require('../controllers/ticketController')
const { protect, staffOnly } = require('../middleware/authMiddleware')

router.use('/:ticketId/notes', require('./noteRoutes'))

router.route('/').get(protect, getTickets).post(protect, createTicket)

router
  .route('/:id')
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket)

router.put('/:id/close', protect, closeTicket)
router.put('/:id/reopen', protect, reopenTicket)
router.put('/:id/assign', protect, staffOnly, assignTicket)
router.put('/:id/unassign', protect, staffOnly, unassignTicket)

module.exports = router