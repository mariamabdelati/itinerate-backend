const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// token creation
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

// Create a new user with the data from the request body
const signUp = async (req, res, next) => {
    try {
        const user = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                photo: req.body.photo,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
            }
        );

        // Create a JWT for the newly created user
        const token = signToken(user._id);

        // Send the newly created user to the client
        res.status(201).json({
            status: "success", message: "User created successfully", token: token, data: user,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(400).json({
            status: "error",
            error: error.message
        });
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        // 1) Check if email and password are provided
        if (!email || !password) {
            return next(new Error('Please provide an email and password'));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({email}).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            const error = new Error('Incorrect email or password');
            error.statusCode = 401;
            return next(error);
        }

        // 3) If everything ok, send token to client
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token: token,
        });
    } catch (error) {
        // If an error occurs, send it to the client
        res.status(400).json({
            status: "error",
            error: error.message
        });
    }
}

module.exports = {
    signUp,
    login,
    protect,
    restrictTo,
}