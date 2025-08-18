

// --- File: server/controllers/postController.js ---
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const newPost = new Post({ content: req.body.content, author: req.user.id });
    const post = await newPost.save();
    await post.populate('author', ['displayName', 'username', 'profilePic']);
    res.status(201).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const followingIds = [...currentUser.following, req.user.id];

    const posts = await Post.find({ author: { $in: followingIds } })
      .populate('author', ['displayName', 'username', 'profilePic'])
      .populate('comments')
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    const posts = await Post.find({ createdAt: { $gte: sevenDaysAgo } })
      .populate('author', ['displayName', 'username', 'profilePic'])
      .populate('comments')
      .sort({ likes: -1 })
      .limit(20);
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      await post.updateOne({ $pull: { likes: req.user.id } });
      res.json({ success: true, message: 'Post unliked' });
    } else {
      await post.updateOne({ $push: { likes: req.user.id } });
      res.json({ success: true, message: 'Post liked' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'User not authorized' });

    post = await Post.findByIdAndUpdate(req.params.id, { $set: { content: req.body.content } }, { new: true });
    await post.populate('author', ['displayName', 'username', 'profilePic']);
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'User not authorized' });

    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getCommentsForPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', ['username', 'profilePic'])
            .sort({ createdAt: 'asc' });
        res.json({ success: true, comments });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createCommentForPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

        const newComment = new Comment({
            content: req.body.content,
            author: req.user.id,
            post: req.params.id
        });

        const comment = await newComment.save();
        post.comments.push(comment._id);
        await post.save();

        await comment.populate('author', ['username', 'profilePic']);
        res.status(201).json({ success: true, comment });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};