const assert = require('assert');
const { compare } = require('bcrypt');
const User = require('../../src/models/user.model');

describe('Test user model', () => {
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
});
