const assert = require('assert');
const request = require('supertest');
const { compare } = require('bcrypt');

const app = require('../../src/app');
const User = require('../../src/models/user.model');

describe('Test POST /user/signin', () => {
    beforeEach('Sign up a user for test', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
    });

    it('Can sign in with email and password', async () => {
        const userInfo = { email: 'pho100@gmail.com', password: '123' };
        const response = await request(app).post('/user/signin').send(userInfo);
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
    });

    it('Cannot sign in with wrong email', async () => {
        const userInfo = { email: 'ax@gmail.com', password: '123' };
        const response = await request(app).post('/user/signin').send(userInfo);
        assert.equal(response.status, 404);
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, 'CANNOT_FIND_USER');
    });

    it('Cannot sign in with wrong password', async () => {
        const userInfo = { email: 'pho100@gmail.com', password: '1234' };
        const response = await request(app).post('/user/signin').send(userInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign in without password', async () => {
        const userInfo = { email: 'pho100@gmail.com' };
        const response = await request(app).post('/user/signin').send(userInfo);
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });

    it('Cannot sign in without email', async () => {
        const userInfo = { };
        const response = await request(app).post('/user/signin').send(userInfo);
        assert.equal(response.status, 404);
        assert.equal(response.body.success, false);
    });
});

// User -> Story -> Comment
