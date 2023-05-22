const express = require('express');
const tripRouter = express.Router();
const { createTrip, retrieveAllTrips, retrieveTripById, updateTripById, deleteTripById, retrieveTripUsingSearch } = require('../controllers/tripController.js');
const { protect, restrictTo } = require('../controllers/authController.js');


// All trips routes
tripRouter
    .route('/')
    .post(protect, restrictTo("admin"), createTrip)
    .get(retrieveAllTrips)

tripRouter
    .route('/search')
    .get(retrieveTripUsingSearch)

// Single trip routes using the id parameter
tripRouter
    .route('/:id')
    .get(retrieveTripById)
    .put(protect, restrictTo("admin"), updateTripById)
    .delete(protect, restrictTo("admin"), deleteTripById);


// Export the router
module.exports = tripRouter;