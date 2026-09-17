const express = require('express')

const router =
  express.Router()

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeTicket,
  deleteTicket,
} = require('../controllers/ticketController')

const {
  protect,
} = require('../middleware/authMiddleware')

const noteRouter = require(
  './noteRoutes'
)

// ==========================================
// NOTES
// /api/tickets/:ticketId/notes
// ==========================================

router.use(
  '/:ticketId/notes',
  noteRouter
)

// ==========================================
// TICKETS
// ==========================================

router
  .route('/')
  .get(
    protect,
    getTickets
  )
  .post(
    protect,
    createTicket
  )

router
  .route('/:id')
  .get(
    protect,
    getTicket
  )
  .put(
    protect,
    updateTicket
  )
  .delete(
    protect,
    deleteTicket
  )

// ==========================================
// CLOSE
// ==========================================

router.put(
  '/:id/close',
  protect,
  closeTicket
)

module.exports = router