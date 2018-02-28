const mongoose = require('mongoose');
const User = require('./user.model');
const MyError = require('../lib/MyError');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true }
});

const StoryModel = mongoose.model('Story', storySchema);

class Story extends StoryModel {
    static async createStory(idUser, content) {
        const story = new Story({ content, author: idUser });
        const user = await User.findByIdAndUpdate(idUser, { $addToSet: { stories: story._id } })
        .catch(error => { throw new Error('Cannot find user.'); });
        if (!user) throw new MyError('Cannot find user.', 'CANNOT_FIND_USER', 404);
        return await story.save();
    }
}

module.exports = Story;
