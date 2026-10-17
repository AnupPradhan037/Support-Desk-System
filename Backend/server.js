require('dotenv').config() // must be first
require('colors')

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

// Fail fast if required env vars are missing
const required = ['MONGO_URI', 'JWT_SECRET']
const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  console.error(`Missing env variables: ${missing.join(', ')}`.red.bold)
  process.exit(1)
}

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api/stats', require('./routes/statsRoutes'))

app.get('/', (req, res) => {
  res.send('Support Ticket API is running...')
})

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))

app.use(notFound) // after routes
app.use(errorHandler) // last

// Connect to the DB first, then start listening
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`.yellow.bold)
  })
})