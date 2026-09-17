const asyncHandler =
  require(
    'express-async-handler'
  )

const Note =
  require('../models/noteModel')

const Ticket =
  require('../models/ticketModel')

// ==========================================
// GET NOTES
// GET /api/tickets/:ticketId/notes
// Private
// ==========================================

const getNotes =
  asyncHandler(
    async (req, res) => {
      const ticket =
        await Ticket.findById(
          req.params.ticketId
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

      const notes =
        await Note.find({
          ticket:
            req.params.ticketId,
        })
          .populate(
            'user',
            'name email isStaff'
          )
          .sort({
            createdAt: 1,
          })

      res.status(200).json(
        notes
      )
    }
  )

// ==========================================
// CREATE NOTE
// POST /api/tickets/:ticketId/notes
// Staff Only
// ==========================================

const createNote =
  asyncHandler(
    async (req, res) => {
      // Staff only
      if (!req.user.isStaff) {
        res.status(403)

        throw new Error(
          'Only staff members can create notes'
        )
      }

      const ticket =
        await Ticket.findById(
          req.params.ticketId
        )

      if (!ticket) {
        res.status(404)

        throw new Error(
          'Ticket not found'
        )
      }

      const { text } =
        req.body

      if (
        !text ||
        text.trim() === ''
      ) {
        res.status(400)

        throw new Error(
          'Please enter a note'
        )
      }

      const note =
        await Note.create({
          ticket:
            req.params.ticketId,
          user: req.user._id,
          text: text.trim(),
        })

      const populatedNote =
        await Note.findById(
          note._id
        ).populate(
          'user',
          'name email isStaff'
        )

      res.status(201).json(
        populatedNote
      )
    }
  )

module.exports = {
  getNotes,
  createNote,
}