const express = require('express');
const User = require('./models/user.model');
// const parser = require('body-parser').urlencoded({ extended: false });
const parser = require('body-parser').json();
const app = express();

app.post('/signup', parser, (req, res) => {
    const { email, password, phone, name } = req.body;
    User.signUp(email, password, name, phone)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.send({ success: false, message: error.message }));
});

app.post('/signin', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.send({ success: false, message: error.message }));
});

module.exports = app;
