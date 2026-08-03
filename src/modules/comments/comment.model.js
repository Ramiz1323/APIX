const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Comment content is required'],
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author reference is required'],
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Target ID is required (Product or Post ID)'],
        },
        targetType: {
            type: String,
            required: [true, 'Target Type is required'],
            enum: ['Product', 'Post'],
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
