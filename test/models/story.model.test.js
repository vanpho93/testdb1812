const assert = require('assert');
const { compare } = require('bcrypt');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');

describe('Can create story for user', () => {
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
});
