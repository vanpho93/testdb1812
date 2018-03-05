const express = require('express');
const User = require('./models/user.model');
// const parser = require('body-parser').urlencoded({ extended: false });
const parser = require('body-parser').json();
const { storyRouter } = require('./controllers/story.route');
const { userRouter } = require('./controllers/user.route');

const app = express();

app.use('/user', userRouter);
app.use('/story', storyRouter);

module.exports = app;
