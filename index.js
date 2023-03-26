const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Connect to MongoDB database
const initializeDbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database');
  } catch (error) {
    console.error(error);
  }
}

// Use middleware to parse JSON data from request bodies
app.use(express.json());

// Start listening on the specified port and initialize the database connection
app.listen(process.env.PORT, () => {
  initializeDbConnection();
  console.log(`Server is running on port ${process.env.PORT}`);
});