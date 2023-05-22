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

// Protect routes
const protect = async (req, res, next) => {
    try {
        // 1) Get token and check if it exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const error = new Error('You are not logged in! Please log in to get access.');
            error.statusCode = 401;
            return next(error);
        }

        // 2) Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            const error = new Error('The user belonging to this token no longer exists.');
            error.statusCode = 401;
            return next(error);
        }

        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            const error = new Error('User recently changed password! Please log in again.');
            error.statusCode = 401;
            return next(error);
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();


    } catch (error) {
        // If an error occurs, send it to the client
        res.status(400).json({
            status: "error",
            error: error.message
        });
    }
}

// Restrict access to certain routes based on the user's role
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array ['admin', 'user']. role='user'
        if (!roles.includes(req.user.role)) {
            const error = new Error('You do not have permission to perform this action');
            error.statusCode = 403;
            return next(error);
        }

        next();
    }
}

// Update the password of the currently logged in user
const updatePassword = async (req, res, next) => {
    try {
        // 1. Get user from collection
        const user = await User.findById(req.user.id).select('+password');

        // 2. Check if current password is correct
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            const error = new Error('Your current password is wrong.');
            error.statusCode = 401;
            return next(error);
        }

        // 3. If so, update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        // 4. Log user in, send JWT
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
    updatePassword
}