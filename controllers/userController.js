const User = require('../models/User');
const APIQueryUtils = require("../utils/apiQueryUtils");


// Function to filter out unwanted fields that are not allowed to be updated
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });

    return newObj;
}

// Allow user to update their profile
const updateProfile = async (req, res, next) => {
    try {
        // Create error if user tries to update password data
        if (req.body.password || req.body.passwordConfirm) {
            const error = new Error("This route is not for password updates. Please use /updatePassword.");
            error.statusCode = 400;
            return next(error);
        }

        // Filter out unwanted fields that are not allowed to be updated
        const filteredBody = filterObj(req.body, "name", "email");

        // Update user document
        const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });


    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Create a new user with the data from the request body
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        // Send the newly created user to the client
        res.status(201).json({
            status: "success", message: "User created successfully", data: user,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(400).json({
            status: "error",
            error: error.message
        });
    }
}

// Retrieve all users from the database
const retrieveAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        // Send the retrieved users to the client
        res.status(200).json({
            status: "success", message: "Users retrieved successfully", results: users.length, data: users,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Retrieve a single user from the database using the id parameter
const retrieveUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Send the retrieved user to the client
        res.status(200).json({
            status: "success", message: "User retrieved successfully", data: user,
        });

    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

// Update a single user using the id parameter and the data from the request body
const updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        // Send the updated user to the client
        res.status(200).json({
            status: "success", message: "User updated successfully", data: user,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });

    }
}

// Delete a single user using the id parameter
const deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        // Send the updated user to the client
        res.status(204).json({
            status: "success", message: "User deleted successfully", data: null,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(404).json({
            status: "error", error: error.message
        });
    }
}

module.exports = {
    createUser,
    retrieveAllUsers,
    retrieveUserById,
    updateUserById,
    deleteUserById,
}