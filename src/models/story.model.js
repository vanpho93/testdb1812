const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storySchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, trim: true }
});

const StoryModel = mongoose.model('Story', storySchema);

class Story extends StoryModel {}

module.exports = Story;
