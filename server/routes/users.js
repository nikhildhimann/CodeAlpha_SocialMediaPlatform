// --- File: server/routes/users.js ---
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMe, getUserProfile, followUser, unfollowUser, updateProfile } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.get('/profile/:username', auth, getUserProfile);
router.post('/:userId/follow', auth, followUser);
router.delete('/:userId/follow', auth, unfollowUser);
router.put('/profile', auth, updateProfile);

module.exports = router;

// --- File: server/controllers/userController.js ---
const User = require('../models/User');
const Post = require('../models/Post');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).populate('author', ['displayName', 'username', 'profilePic']);
    res.json({ success: true, user, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) return res.status(404).json({ success: false, message: 'User not found' });
    if (req.user.id === req.params.userId) return res.status(400).json({ success: false, message: 'You cannot follow yourself' });

    if (!currentUser.following.includes(req.params.userId)) {
      await currentUser.updateOne({ $push: { following: req.params.userId } });
      await userToFollow.updateOne({ $push: { followers: req.user.id } });
      res.json({ success: true, message: 'User followed' });
    } else {
      res.status(400).json({ success: false, message: 'You are already following this user' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) return res.status(404).json({ success: false, message: 'User not found' });

    if (currentUser.following.includes(req.params.userId)) {
      await currentUser.updateOne({ $pull: { following: req.params.userId } });
      await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
      res.json({ success: true, message: 'User unfollowed' });
    } else {
      res.status(400).json({ success: false, message: 'You are not following this user' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};