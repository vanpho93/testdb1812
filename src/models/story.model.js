const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true }
});

const StoryModel = mongoose.model('Story', storySchema);

class Story extends StoryModel {
    static createStory(idUser, content) {
        const story = new Story({ content, author: idUser });
        const user = await User.findByIdAndUpdate(idUser, { $addToSet: { stories: story._id } });
        if (!user) throw new Error('Cannot find user.');
        return await story.save();
    }
}

module.exports = Story;
