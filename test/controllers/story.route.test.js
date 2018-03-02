const assert = require('assert');
const request = require('supertest');

const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');

describe.only('Test POST /story', () => {
    let token;
    beforeEach('Create user for test', async () => {
        await User.signUp('pho100@gmail.com', '123', 'Pho', '012398219434');
        const user = await User.signIn('pho100@gmail.com', '123');
        token = user.token;
    });

    it('Can create new story by POST /story', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'abcd' })
        .set({ token });
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        assert.equal(response.body.story.content, 'abcd');
        const story = await Story.findOne().populate('author');
        assert.equal(story.author.name, 'Pho');
        const user = await User.findOne().populate('stories');
        assert.equal(user.stories[0].content, 'abcd');
    });

    it('Cannot create new story without token', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'abcd' })
        assert.equal(response.status, 400);
        assert.equal(response.body.success, false);
    });
});
