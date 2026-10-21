require('dotenv').config() // Must be first
require('colors')

const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

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

// Allowed frontend URLs (comma-separated in CLIENT_URL, trailing slashes removed)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))

// The Create React App dev proxy sends the backend's own address as the Origin
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push(`http://localhost:${port}`)
}

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Postman and server-to-server calls have no Origin header
      if (!origin) return callback(null, true)

      const cleaned = origin.replace(/\/+$/, '') // drop trailing slash

      if (allowedOrigins.includes(cleaned)) return callback(null, true)

      console.warn(`CORS blocked origin: ${origin}`)
      const error = new Error(`Not allowed by CORS: ${origin}`)
      error.status = 403
      return callback(error)
    },
    credentials: true,
  })
)

// Body parsing
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

// Unknown routes, then the global error handler (must be last)
app.use(notFound)
app.use(errorHandler)

// Start the server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDB()

    app.listen(port, () => {
      console.log(`Server started on port ${port}`.yellow.bold)
    })
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`.red.bold)
    process.exit(1)
  }
}

startServer()