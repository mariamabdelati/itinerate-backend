const mongoose = require("mongoose");

// Create a new schema for the database
const tripSchema = new mongoose.Schema(
    {
        destinationName: {
            type: String,
            required: [true, "A destination (city) name is required"],
            trim: true,
            lowercase: true,
        },
        location: {
            type: String,
            required: [true, "A location (country) name is required"],
            trim: true,
            lowercase: true,
        },
        continent: {
            type: String,
            required: [true, "A continent name is required"],
            trim: true,
            lowercase: true,
            enum: {
                values: [
                    "africa",
                    "antarctica",
                    "asia",
                    "australia",
                    "europe",
                    "north america",
                    "south america",
                ],
                message: "Continent must be one of the following: africa, antarctica, asia, australia, europe, north america, south america",
            }
        },
        language: {
            type: String,
            required: [true, "Destination language is required"],
            trim: true,
            lowercase: true,
        },
        nationality: {
            type: String,
            required: [true, "Nationality is required"],
            trim: true,
            lowercase: true,
        },
        images: {
            type: [String],
            required: [true, "At least one image is required for the destination"],
        },
        description: {
            type: String,
            required: [true, "A description is required"],
            trim: true,
        },
        flightCost: {
            type: Number,
            required: [true, "Flight cost is required for the destination"],
        },
        accommodationCost: {
            type: Number,
            required: [true, "Accommodation cost is required for the destination"],
        },
        mealCost: {
            type: Number,
            required: [true, "Meal cost is required for the destination"],
        },
        visaCost: {
            type: Number,
            required: [true, "Visa cost is required for the destination"],
        },
        dailyCost: {
            type: Number,
        },
        currencyCode: {
            type: String,
            required: [true, "Currency code is required for the destination"],
            trim: true,
        },
        transportationModes: {
            type: [String],
            required: [true, "At least one transportation mode is required for the destination"],
            lowercase: true,
        },
        transportationCost: {
            type: Number,
            required: [true, "Transportation cost is required for the destination"],
        },
        visaIsRequired: {
            type: Boolean,
            required: [true, "Indicate whether a visa is required for the destination"],
        },
        visaRequirements: {
            type: String,
            required: [true, "Visa requirements are required for the destination"],
            trim: true,
        },
        timeZone: {
            type: String,
            required: [true, "Time zone is required for the destination"],
            trim: true,
        },
        bestTimeToVisit: {
            type: String,
            required: [true, "Best time to visit is required for the destination"],
            trim: true,
            lowercase: true,
        },
        bestPlacesToVisit: {
            type: [String],
            required: [true, "At least one best place to visit is required for the destination"],
            lowercase: true,
        }
    },
    {
        timestamps: true,
    },

);

// Calculate the daily cost of the trip, middleware function
tripSchema.pre('save', function(next) {
    this.dailyCost = this.flightCost + this.accommodationCost + this.mealCost + this.visaCost + this.transportationCost;
    next();
});

// Create a new model using the schema
const Trip = mongoose.model("Trip", tripSchema);

// Export the model
module.exports = Trip;