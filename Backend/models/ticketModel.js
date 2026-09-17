const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    product: {
      type: String,
      required: [true, 'Please select a Product'],
      enum: [
        'iphone',
        'MacBook Pro',
        'iMac',
        'iPad',
        'Dell',
        'Asus',
        'Msi',
        'Hp',
        'Android',
      ],
    },

    description: {
      type: String,
      required: [
        true,
        'Please Enter the description of the issue...',
      ],
    },

    status: {
      type: String,
      required: true,
      enum: ['new', 'open', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model(
  'Ticket',
  ticketSchema
)