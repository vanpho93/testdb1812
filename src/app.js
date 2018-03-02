const express = require('express');
const User = require('./models/user.model');
const Story = require('./models/story.model');
// const parser = require('body-parser').urlencoded({ extended: false });
const parser = require('body-parser').json();
const { verify } = require('./lib/jwt');

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

function mustBeUser(req, res, next) {
    const { token } = req.headers;
    if (!token) return res.status(400).send({ success: false, message: 'Invalid token.' });
    verify(token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(() => res.status(400).send({ success: false, message: 'Invalid token.' }))
}

app.post('/story', mustBeUser, parser, (req, res) => {
    Story.createStory(req.idUser, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(error => {
        res.send({ success: false, code: error.code, message: error.message });
    });
});

app.delete('/story/id', mustBeUser, (req, res) => {

});

module.exports = app;
