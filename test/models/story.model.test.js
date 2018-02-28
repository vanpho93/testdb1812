const assert = require('assert');
const { compare } = require('bcrypt');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');

describe.only('Can create story for user', () => {
    let _id;
    beforeEach('Create new user for test.', async () => {
        const user = await User.signUp('a@gmail.com', '123', 'teo', '321');
        _id = user._id; 
    });

    it('Can create new story', async () => {
        const story = new Story({ content: 'abcd', author: _id });
        await story.save();
        const newStory = await Story.findById(story._id).populate('author');
        assert.equal(newStory.content, 'abcd');
        const { name, phone, email } = newStory.author;
        assert.equal(name, 'teo');
        assert.equal(phone, '321');
        assert.equal(email, 'a@gmail.com');
    });

    it('Can create new story in stories array', async () => {
        const story = new Story({ content: 'abcd', author: _id });
        await story.save();
        // const user = await User.findById(_id);
        // user.stories.push(story._id);
        // await user.save();
        await User.findByIdAndUpdate(_id, { $addToSet: { stories: story._id } });
        const newStory = await Story.findById(story._id).populate('author');
        assert.equal(newStory.content, 'abcd');
        const { name, phone, email } = newStory.author;
        assert.equal(name, 'teo');
        assert.equal(phone, '321');
        assert.equal(email, 'a@gmail.com');
        const user = await User.findById(_id).populate('stories');
        assert.equal(user.stories[0].content, 'abcd');
    });

    it('Can add new story with static method', async () => {
        await Story.createStory(_id, 'abx');
        const story = await Story.findOne({}).populate('author');
        assert.equal(story.author.name, 'teo');
        const user = await User.findById(_id).populate('stories');
        assert.equal(user.stories[0].content, 'abx');
    });

    it('Cannot add new story with wrong idUser', async () => {
        try {
            await Story.createStory('5a96bb41ceba757ac658d02e', 'abx');
        } catch (error) {
            assert.equal(error.code, 'CANNOT_FIND_USER');
        }
    });
});
