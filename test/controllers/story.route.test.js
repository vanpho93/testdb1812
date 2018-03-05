const assert = require('assert');
const request = require('supertest');

const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');

describe('Test POST /story', () => {
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

describe('Test DELETE /story', () => {
    let idUser1, idUser2, idStory, token1, token2;
    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'teo', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story = await Story.createStory(idUser1, 'abcd');
        idStory = story._id;
    });

    it('Can remove story by DELETE', async () => {
        const response = await request(app)
        .delete(`/story/${idStory}`)
        .set({ token: token1 });
        assert.equal(response.status, 200);
        assert.equal(response.body.success, true);
        const storyCount = await Story.count({});
        assert.equal(storyCount, 0);
        const user1 = await User.findById(idUser1);
        assert.equal(user1.stories.length, 0);        
    });

    it('Cannot remove story with wrong storyId', async () => {
        const response = await request(app)
        .delete(`/story/${idStory}1`)
        .set({ token: token1 });
        assert.equal(response.status, 404);
        assert.equal(response.body.code, 'CANNOT_FIND_STORY');
    });

    it('Cannot remove story with wrong token', async () => {
        const response = await request(app)
        .delete(`/story/${idStory}`)
        .set({ token: 'abcd' });
        assert.equal(response.body.success, false);
        assert.equal(response.body.message, 'Invalid token.');
    });

    it('Cannot remove story without token', async () => {
        const response = await request(app)
        .delete(`/story/${idStory}`)
        assert.equal(response.body.success, false);
        assert.equal(response.body.message, 'Invalid token.');
    });

    it('Cannot remove story with other\'s token', async () => {
        const response = await request(app)
        .delete(`/story/${idStory}`)
        .set({ token: token2 });
        assert.equal(response.body.success, false);
        assert.equal(response.body.code, 'CANNOT_FIND_STORY');
    });
});

describe('Test PUT /story', () => {
    let idUser1, idUser2, idStory, token1, token2;
    beforeEach('Create story for test', async () => {
        await User.signUp('a@gmail.com', '123', 'teo', '321');
        await User.signUp('b@gmail.com', '123', 'teo', '321');
        const user1 = await User.signIn('a@gmail.com', '123');
        const user2 = await User.signIn('b@gmail.com', '123');
        token1 = user1.token;
        token2 = user2.token;
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story = await Story.createStory(idUser1, 'abcd');
        idStory = story._id;
    });

    it('Can update story by PUT', async () => {
        const response = await request(app)
        .put(`/story/${idStory}`)
        .send({ content: 'dcba' })
        .set({ token: token1 });
        assert.equal(response.status, 200);
        assert.equal(response.body.story.content, 'dcba');
        const story = await Story.findOne({});
        assert.equal(story.content, 'dcba');
    });

    it('Cannot update story with wrong storyId', async () => {
        const response = await request(app)
        .put(`/story/${idStory}a`)
        .send({ content: 'dcba' })
        .set({ token: token1 });
        assert.equal(response.status, 404);
        assert.equal(response.body.code, 'CANNOT_FIND_STORY');
        const story = await Story.findOne({});
        assert.equal(story.content, 'abcd');
    });

    it('Cannot update story with wrong token', async () => {
        const response = await request(app)
        .put(`/story/${idStory}a`)
        .send({ content: 'dcba' })
        .set({ token: token1+'x' });
        assert.equal(response.status, 400);
        assert.equal(response.body.message, 'Invalid token.');
        const story = await Story.findOne({});
        assert.equal(story.content, 'abcd');
    });

    it('Cannot update story without token', async () => {
        const response = await request(app)
        .put(`/story/${idStory}a`)
        .send({ content: 'dcba' });
        assert.equal(response.status, 400);
        assert.equal(response.body.message, 'Invalid token.');
        const story = await Story.findOne({});
        assert.equal(story.content, 'abcd');
    });

    it('Cannot update story with other\'s token', async () => {
        const response = await request(app)
        .put(`/story/${idStory}a`)
        .send({ content: 'dcba' })
        .set({ token: token2 });
        assert.equal(response.status, 404);
        assert.equal(response.body.code, 'CANNOT_FIND_STORY');
        const story = await Story.findOne({});
        assert.equal(story.content, 'abcd');
    });
});
