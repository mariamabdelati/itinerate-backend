// Description: Handles all the logic for the trip routes
const Trip = require('../models/Trip.js');
const APIQueryUtils = require("../utils/apiQueryUtils");

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
            status: "error",
            error: error.message});
    }
}

// Retrieve all trips from the database
const retrieveAllTrips = async (req, res) => {
    try {
        // Retrieve the query parameters from the request URL
        const queryFeatures = new APIQueryUtils(Trip.find(), req.query).filter().sort().limitFields();
        const trips = await queryFeatures.query;

        // const trips = await Trip.find();

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

        // Send the retrieved trip to the client
        res.status(200).json({
            status: "success", message: "Trip retrieved successfully", data: trip,
        });

    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Update a single trip using the id parameter and the data from the request body
const updateTripById = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {new: true,
            runValidators: true,});

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
    createTrip, retrieveAllTrips, retrieveTripById, updateTripById, deleteTripById,
}