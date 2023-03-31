const express = require('express');
const { createUser, retrieveAllUsers, retrieveUserById, updateUserById, deleteUserById } = require('../controllers/userController.js');
const { signUp, login, forgotPassword, resetPassword} = require('../controllers/authController.js');

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter
    .route('/')
    .get(retrieveAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(retrieveUserById)
    .put(updateUserById)
    .delete(deleteUserById);

module.exports = userRouter;