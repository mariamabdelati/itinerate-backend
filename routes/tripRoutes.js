const express = require('express');
const tripRouter = express.Router();
const { createTrip, retrieveAllTrips, retrieveTripById, updateTripById, deleteTripById } = require('../controllers/tripController.js');

// All trips routes
tripRouter
    .route('/')
    .post(createTrip)
    .get(retrieveAllTrips);

// Single trip routes using the id parameter
tripRouter
    .route('/:id')
    .get(retrieveTripById)
    .put(updateTripById)
    .delete(deleteTripById);


// Export the router
module.exports = tripRouter;