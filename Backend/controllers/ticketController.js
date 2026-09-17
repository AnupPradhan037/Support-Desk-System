const asyncHandler = require('express-async-handler')

const Ticket = require('../models/ticketModel')

// ==========================================
// CREATE TICKET
// POST /api/tickets
// Private
// ==========================================

const createTicket = asyncHandler(
  async (req, res) => {
    const {
      product,
      description,
    } = req.body

    if (!product || !description) {
      res.status(400)

      throw new Error(
        'Please provide all required fields'
      )
    }

    const ticket =
      await Ticket.create({
        product,
        description,
        status: 'new',
        user: req.user._id,
      })

    res.status(201).json(ticket)
  }
)

// ==========================================
// GET ALL USER TICKETS
// GET /api/tickets
// Private
// ==========================================

const getTickets = asyncHandler(
  async (req, res) => {
    const tickets =
      await Ticket.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      })

    res.status(200).json(tickets)
  }
)

// ==========================================
// GET SINGLE TICKET
// GET /api/tickets/:id
// Private
// ==========================================

const getTicket = asyncHandler(
  async (req, res) => {
    const ticket =
      await Ticket.findById(
        req.params.id
      )

    if (!ticket) {
      res.status(404)

      throw new Error(
        'Ticket not found'
      )
    }

    // Ticket owner OR staff
    if (
      ticket.user.toString() !==
        req.user._id.toString() &&
      !req.user.isStaff
    ) {
      res.status(401)

      throw new Error(
        'User not authorized'
      )
    }

    res.status(200).json(ticket)
  }
)

// ==========================================
// UPDATE TICKET
// PUT /api/tickets/:id
// Private
// ==========================================

const updateTicket = asyncHandler(
  async (req, res) => {
    const ticket =
      await Ticket.findById(
        req.params.id
      )

    if (!ticket) {
      res.status(404)

      throw new Error(
        'Ticket not found'
      )
    }

    // Owner OR staff
    if (
      ticket.user.toString() !==
        req.user._id.toString() &&
      !req.user.isStaff
    ) {
      res.status(401)

      throw new Error(
        'User not authorized'
      )
    }

    const updatedTicket =
      await Ticket.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )

    res.status(200).json(
      updatedTicket
    )
  }
)

// ==========================================
// CLOSE TICKET
// PUT /api/tickets/:id/close
// Private
// ==========================================

const closeTicket = asyncHandler(
  async (req, res) => {
    const ticket =
      await Ticket.findById(
        req.params.id
      )

    if (!ticket) {
      res.status(404)

      throw new Error(
        'Ticket not found'
      )
    }

    // Owner OR staff
    if (
      ticket.user.toString() !==
        req.user._id.toString() &&
      !req.user.isStaff
    ) {
      res.status(401)

      throw new Error(
        'User not authorized'
      )
    }

    ticket.status = 'closed'

    const updatedTicket =
      await ticket.save()

    res.status(200).json(
      updatedTicket
    )
  }
)

// ==========================================
// DELETE TICKET
// DELETE /api/tickets/:id
// Private
// ==========================================

const deleteTicket = asyncHandler(
  async (req, res) => {
    const ticket =
      await Ticket.findById(
        req.params.id
      )

    if (!ticket) {
      res.status(404)

      throw new Error(
        'Ticket not found'
      )
    }

    // Only owner can delete
    if (
      ticket.user.toString() !==
      req.user._id.toString()
    ) {
      res.status(401)

      throw new Error(
        'User not authorized'
      )
    }

    await ticket.deleteOne()

    res.status(200).json({
      success: true,
      message:
        'Ticket deleted successfully',
      id: req.params.id,
    })
  }
)

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeTicket,
  deleteTicket,
}