
require('dotenv').config() // Load environment variables first
require('colors')

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
const {
  errorHandler,
  notFound,
} = require('./middleware/errorMiddleware')

// Validate required environment variables
const required = ['MONGO_URI', 'JWT_SECRET']
const missing = required.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.error(
    `Missing environment variables: ${missing.join(', ')}`.red.bold
  )
  process.exit(1)
}

// Initialize Express
const app = express()
const port = process.env.PORT || 5000

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://support-desk-system-gamma.vercel.app',
  'https://support-desk-system-git-main-anuppradhan9292-6725.vercel.app',
  'https://support-desk-system-lqr27io62-anuppradhan9292-6725.vercel.app',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean),
]

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true)
      }

      // Remove trailing slash if present
      const cleanedOrigin = origin.replace(/\/+$/, '')

      if (allowedOrigins.includes(cleanedOrigin)) {
        return callback(null, true)
      }

      console.warn(`CORS blocked origin: ${origin}`)

      return callback(
        new Error(`Not allowed by CORS: ${origin}`)
      )
    },
    credentials: true,
  })
)

// Handle preflight requests
app.options(/.*/, cors())

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Root route
app.get('/', (req, res) => {
  res.status(200).send('Support Ticket API is running...')
})

// API routes
app.use('/api/stats', require('./routes/statsRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

// Handle unknown routes
app.use(notFound)

// Global error handler (must remain last)
app.use(errorHandler)

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB()

    app.listen(port, () => {
      console.log(
        `Server started on port ${port}`.yellow.bold
      )
    })
  } catch (error) {
    console.error(
      `Database connection failed: ${error.message}`.red.bold
    )
    process.exit(1)
  }
}

startServer()