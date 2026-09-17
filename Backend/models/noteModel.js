const mongoose = require('mongoose')

const noteSchema =
  mongoose.Schema(
    {
      ticket: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Ticket',
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },

      text: {
        type: String,
        required: [
          true,
          'Please enter note text',
        ],
      },
    },
    {
      timestamps: true,
    }
  )

module.exports =
  mongoose.model(
    'Note',
    noteSchema
  )