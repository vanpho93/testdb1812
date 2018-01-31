const assert = require('assert');
const { compare } = require('bcrypt');
const User = require('../../src/models/user.model');

xdescribe('Test user sign up', () => {
    it('Can sign up with full info', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        const users = await User.find({ });
        assert.equal(users.length, 1);
        const { email, password, name, phone } = users[0];
        assert.equal(email, 'pho100@gmail.com');
        assert.equal(name, 'Pho');
        assert.equal(phone, '012398219434');
        const same = await compare('123', password);
        assert.equal(same, true);
    });

    it ('Cannot sign up without email', async () => {
        try {
            await User.signUp('', '123', 'Pho', '012398219434');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.name, 'ValidationError');
        }
    });

    it ('Cannot sign up with existed email', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        try {
            await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
            throw new Error('Wrong');
        } catch (error) {
            assert.equal(error.code, 11000);
        }
    });
});

describe('Test user sign in', () => {
    it('Can sign in with email and password', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        const user = await User.signIn('pho100@gmail.com', '123');
        assert.equal(user.phone, '012398219434');
        assert.equal(user.name, 'Pho');
        assert.equal(user.email, 'pho100@gmail.com');
    });

    it('Cannot sign in with wrong email', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        try {
            await User.signIn('abcd@gmail.com', '123');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Cannot find user.');
        }
    });

    it('Cannot sign in with wrong password', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        try {
            await User.signIn('pho100@gmail.com', '321');
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Invalid password.');
        }
    });

    it('Cannot sign in without password', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        try {
            await User.signIn('pho100@gmail.com', undefined);
            throw new Error('Wrong');
        } catch (err) {
            assert.equal(err.message, 'Invalid password.');
        }
    });
});
