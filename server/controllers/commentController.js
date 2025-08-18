// --- File: server/controllers/commentController.js ---
const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
        if (comment.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'User not authorized' });

        await Post.updateOne({ _id: comment.post }, { $pull: { comments: comment._id } });
        await Comment.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Comment removed' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
