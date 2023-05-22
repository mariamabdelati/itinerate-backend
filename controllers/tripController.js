// Description: Handles all the logic for the trip routes
const Trip = require('../models/Trip.js');
const APIQueryUtils = require("../utils/apiQueryUtils");
const {getWeather, getCurrency, getFood} = require("../utils/thirdPartyApis");

// Create a new trip with the data from the request body
const createTrip = async (req, res) => {
    try {
        const trip = await Trip.create(req.body);
        // Send the newly created trip to the client
        res.status(201).json({
            status: "success", message: "Trip created successfully", data: trip,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(400).json({
            status: "error", error: error.message
        });
    }
}

// Retrieve all trips from the database
const retrieveAllTrips = async (req, res) => {
    try {
        // Retrieve the query parameters from the request URL
        const queryFeatures = new APIQueryUtils(Trip, Trip.find(), req.query).filter().sort().limitFields();
        const trips = await queryFeatures.query;

        //const trips = await Trip.find();

        // Send the retrieved trips to the client
        res.status(200).json({
            status: "success", message: "Trips retrieved successfully", results: trips.length, data: trips,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Retrieve a single trip from the database using the id parameter
const retrieveTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        // Get startDate and endDate from request query
        const startDate = new Date(req.query.startDate).setHours(0, 0, 0, 0);
        const endDate = new Date(req.query.endDate).setHours(0, 0, 0, 0);

        // Get the weather data for the trip
        const weatherData = await getWeather(trip.destinationName, startDate, endDate);
        // Get the currency data for the trip
        const currencyData = await getCurrency("EGP", trip.currencyCode);
        // Get the food data for the trip
        const foodData = await getFood(trip.nationality);

        // Add the weather, currency and food data to the trip
        const tripData = {
            ...trip.toObject(),
            weatherData,
            currencyData,
            foodData
        };

        // Send the retrieved trip to the client
        res.status(200).json({
            status: "success", message: "Trip retrieved successfully", data: tripData,
        });

    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Retrieve trips using the search parameters from the request query
const retrieveTripUsingSearch = async (req, res) => {
    // Get the city name and budget from the request query
    const destination = new RegExp(req.query.destinationName, "i");
    const budget = parseInt(req.query.dailyCost);

    try {
        let query = {};
        // if the destination and budget are provided, search for trips with the destination and
        // budget less than or equal to the provided budget
        if (destination && budget) {
            query = {destinationName: destination, dailyCost: {$lte: budget}};

        // if the destination is provided, search for trips with the destination
        } else if (destination) {
            query = {destinationName: destination};

        // if the budget is provided, search for trips with the budget less than or equal to the provided budget
        } else if (budget) {
            query = {dailyCost: {$lte: budget}};
        }

        const trips = await Trip.find(query);

        res.status(200).json({
            success: "success", message: "Trips were retrieved successfully", results: trips.length, data: trips,
        });
    } catch (err) {
        res.status(404).json({
            success: "error", message: "Not found",
        });
    }
}

// Update a single trip using the id parameter and the data from the request body
const updateTripById = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });

        // Send the updated trip to the client
        res.status(200).json({
            status: "success", message: "Trip updated successfully", data: trip,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Delete a single trip using the id parameter
const deleteTripById = async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);

        // Send the updated trip to the client
        res.status(204).json({
            status: "success", message: "Trip deleted successfully"
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Export the controller functions
module.exports = {
    createTrip, retrieveAllTrips, retrieveTripById, updateTripById, deleteTripById, retrieveTripUsingSearch
}