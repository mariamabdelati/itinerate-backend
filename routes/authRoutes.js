const express = require('express');
const { signUp, login, updatePassword, protect, restrictTo } = require('../controllers/authController.js');

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.put('/updatePassword', protect, restrictTo("user"), updatePassword);

module.exports = authRouter;