const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

const loadTicketForUser = async (req, res) => {
  const { ticketId } = req.params

  if (!mongoose.isValidObjectId(ticketId)) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const ticket = await Ticket.findById(ticketId)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const isOwner = ticket.user.toString() === req.user._id.toString()
  if (!isOwner && !req.user.isStaff) {
    res.status(401)
    throw new Error('User not authorized')
  }

  return ticket
}

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private (owner or staff)
const getNotes = asyncHandler(async (req, res) => {
  const ticket = await loadTicketForUser(req, res)

  const notes = await Note.find({ ticket: ticket._id })
    .populate('user', 'name email isStaff')
    .sort({ createdAt: 1 })

  res.status(200).json(notes)
})

// @desc    Create note
// @route   POST /api/tickets/:ticketId/notes
// @access  Private (owner or staff)
const createNote = asyncHandler(async (req, res) => {
  const ticket = await loadTicketForUser(req, res)

  if (ticket.status === 'closed') {
    res.status(400)
    throw new Error('Cannot add notes to a closed ticket')
  }

  const { text } = req.body
  if (!text || !text.trim()) {
    res.status(400)
    throw new Error('Please enter a note')
  }

  const note = await Note.create({
    ticket: ticket._id,
    user: req.user._id,
    text: text.trim(),
    isStaff: req.user.isStaff,
  })

  // Move a new ticket to "open" once staff respond
  if (req.user.isStaff && ticket.status === 'new') {
    ticket.status = 'open'
    await ticket.save()
  }

  const populatedNote = await Note.findById(note._id).populate(
    'user',
    'name email isStaff'
  )

  res.status(201).json(populatedNote)
})

module.exports = { getNotes, createNote }