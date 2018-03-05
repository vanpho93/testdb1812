const express = require('express');
const User = require('./models/user.model');
// const parser = require('body-parser').urlencoded({ extended: false });
const parser = require('body-parser').json();
const { storyRouter } = require('./controllers/story.route');

const app = express();

app.post('/signup', parser, (req, res) => {
    const { email, password, phone, name } = req.body;
    User.signUp(email, password, name, phone)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

app.post('/signin', parser, (req, res) => {
    const { email, password } = req.body;
    User.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(error => res.status(error.statusCode).send({ success: false, message: error.message, code: error.code }));
});

app.use('/story', storyRouter);

module.exports = app;
