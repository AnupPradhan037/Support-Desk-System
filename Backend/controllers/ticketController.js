const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const Note = require('../models/noteModel')

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const STATUSES = ['new', 'open', 'closed']

const POPULATE = [
  { path: 'user', select: 'name email' },
  { path: 'assignedTo', select: 'name email' },
]

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const loadTicket = async (req, res, { ownerOnly = false } = {}) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const isOwner = ticket.user.toString() === req.user._id.toString()
  const allowed = ownerOnly ? isOwner : isOwner || req.user.isStaff

  if (!allowed) {
    res.status(401)
    throw new Error('User not authorized')
  }

  return ticket
}

// Populate customer + assignee, then send
const sendTicket = async (res, ticket, status = 200) => {
  await ticket.populate(POPULATE)
  res.status(status).json(ticket)
}

// @route POST /api/tickets
const createTicket = asyncHandler(async (req, res) => {
  const { product, description, category, priority } = req.body

  if (!product || !description) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  const ticket = await Ticket.create({
    product,
    description,
    category,
    priority,
    status: 'new',
    user: req.user._id,
  })

  await sendTicket(res, ticket, 201)
})

// @route GET /api/tickets?page=1&limit=10&status=&priority=&search=&assigned=me|unassigned
const getTickets = asyncHandler(async (req, res) => {
  const { status, priority, search, assigned } = req.query

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50)

  const match = req.user.isStaff ? {} : { user: req.user._id }

  if (typeof status === 'string' && STATUSES.includes(status)) {
    match.status = status
  }
  if (typeof priority === 'string' && PRIORITIES.includes(priority)) {
    match.priority = priority
  }
  if (req.user.isStaff) {
    if (assigned === 'me') match.assignedTo = req.user._id
    else if (assigned === 'unassigned') match.assignedTo = null
  }
  if (typeof search === 'string' && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i')
    match.$or = [{ description: rx }, { product: rx }, { category: rx }]
  }

  // Sorting and paging happen in the database: urgent first, then newest
  const [result] = await Ticket.aggregate([
    { $match: match },
    {
      $addFields: {
        priorityRank: {
          $switch: {
            branches: [
              { case: { $eq: ['$priority', 'urgent'] }, then: 4 },
              { case: { $eq: ['$priority', 'high'] }, then: 3 },
              { case: { $eq: ['$priority', 'medium'] }, then: 2 },
              { case: { $eq: ['$priority', 'low'] }, then: 1 },
            ],
            default: 2, // old tickets with no priority count as medium
          },
        },
      },
    },
    { $sort: { priorityRank: -1, createdAt: -1 } },
    {
      $facet: {
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    },
  ])

  const total = result.total[0]?.count || 0
  const tickets = await Ticket.populate(result.data, POPULATE)

  res.status(200).json({
    tickets,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    total,
  })
})

// @route GET /api/tickets/:id
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res)
  await sendTicket(res, ticket)
})

// @route PUT /api/tickets/:id
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res)

  const { product, description, status, category, priority } = req.body

  if (product !== undefined) ticket.product = product
  if (description !== undefined) ticket.description = description
  if (category !== undefined) ticket.category = category
  if (priority !== undefined) ticket.priority = priority

  if (status !== undefined) {
    if (!req.user.isStaff) {
      res.status(403)
      throw new Error('Only staff can change ticket status')
    }
    ticket.status = status
  }

  await ticket.save()
  await sendTicket(res, ticket)
})

// @route PUT /api/tickets/:id/close
const closeTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res)
  ticket.status = 'closed'
  await ticket.save()
  await sendTicket(res, ticket)
})

// @route PUT /api/tickets/:id/reopen
const reopenTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res)

  if (ticket.status !== 'closed') {
    res.status(400)
    throw new Error('Only closed tickets can be reopened')
  }

  ticket.status = 'open'
  await ticket.save()
  await sendTicket(res, ticket)
})

// @route PUT /api/tickets/:id/assign   (staff only: assigns to the caller)
const assignTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res)

  if (ticket.status === 'closed') {
    res.status(400)
    throw new Error('Reopen the ticket before assigning it')
  }

  ticket.assignedTo = req.user._id
  if (ticket.status === 'new') ticket.status = 'open'

  await ticket.save()
  await sendTicket(res, ticket)
})

// @route PUT /api/tickets/:id/unassign   (staff only)
const unassignTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res)
  ticket.assignedTo = null
  await ticket.save()
  await sendTicket(res, ticket)
})

// @route DELETE /api/tickets/:id  (owner only)
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await loadTicket(req, res, { ownerOnly: true })

  await Note.deleteMany({ ticket: ticket._id })
  await ticket.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Ticket deleted successfully',
    id: req.params.id,
  })
})

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeTicket,
  reopenTicket,
  assignTicket,
  unassignTicket,
  deleteTicket,
}