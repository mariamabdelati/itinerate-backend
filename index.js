const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const tripRouter = require('./routes/tripRoutes.js');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Use middleware to parse JSON data from request bodies
app.use(express.json());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/trips', tripRouter);

module.exports = {
  app,
};