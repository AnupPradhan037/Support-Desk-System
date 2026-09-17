const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');

const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

const port = process.env.PORT || 8080;

console.log('1. Server file loaded');

// Connect to Database
connectDB();

console.log('2. After connectDB');

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home Route
app.get('/', (req, res) => {
  res.send('Support Ticket API is running...');
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Error Handler
app.use(errorHandler);

console.log('3. Before app.listen');

app.listen(port, () => {
  console.log(`Server started on port ${port}`.yellow.bold);
});