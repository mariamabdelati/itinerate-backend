const express = require('express');
const { createUser, retrieveAllUsers, retrieveUserById, updateUserById, deleteUserById } = require('../controllers/userController.js');
const { protect, restrictTo } = require('../controllers/authController.js');

const userRouter = express.Router();

userRouter
    .route('/')
    .get(protect, restrictTo("admin"), retrieveAllUsers)
    .post(protect, restrictTo("admin"), createUser);

userRouter
    .route('/:id')
    .get(protect, restrictTo("admin"), retrieveUserById)
    .put(protect, restrictTo("admin"), updateUserById)
    .delete(protect, restrictTo("admin"), deleteUserById);

module.exports = userRouter;