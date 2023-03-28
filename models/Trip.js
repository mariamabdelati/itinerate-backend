const mongoose = require("mongoose");

// Create a new schema for the database
const tripSchema = new mongoose.Schema(
    {
        destinationName: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        continent: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        nationality: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        flightCost: {
            type: Number,
            required: true,
        },
        accommodationCost: {
            type: Number,
            required: true,
        },
        mealCost: {
            type: Number,
            required: true,
        },
        visaCost: {
            type: Number,
            required: true,
        },
        dailyCost: {
            type: Number,
            required: true,
        },
        currencyCode: {
            type: String,
            required: true,
        },
        transportationModes: {
            type: [String],
            required: true,
        },
        transportationCost: {
            type: Number,
            required: true,
        },
        visaIsRequired: {
            type: Boolean,
            required: true,
        },
        visaRequirements: {
            type: String,
            required: true,
        },
        timeZone: {
            type: String,
            required: true,
        },
        bestTimeToVisit: {
            type: String,
            required: true,
        },
        bestPlacesToVisit: {
            type: [String],
            required: true,
        }
    },
    { timestamps: true }
);

// Create a new model using the schema
const Trip = mongoose.model("Trip", tripSchema);

// Export the model
module.exports = Trip;