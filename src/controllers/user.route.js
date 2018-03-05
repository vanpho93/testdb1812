const express = require('express');
const userRouter = express.Router();
const parser = require('body-parser').json();

const User = require('../models/user.model');

userRouter.post('/signup', parser, (req, res) => {
    const { email, password, phone, name } = req.body;
    User.signUp(email, password, name, phone)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

userRouter.post('/signin', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

module.exports = { userRouter };
