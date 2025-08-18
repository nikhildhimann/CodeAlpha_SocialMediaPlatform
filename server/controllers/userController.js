exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
const User = require('../models/User');
const Post = require('../models/Post');

// Get the currently logged-in user's profile data
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get any user's profile by their username
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 }).populate('author', ['displayName', 'username', 'profilePic']);
    res.json({ success: true, user, posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Follow another user
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
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Unfollow another user
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
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update the current user's profile (displayName, bio)
exports.updateProfile = async (req, res) => {
    const { displayName, bio } = req.body;
    const profileFields = {};
    if (displayName) profileFields.displayName = displayName;
    if (bio || bio === '') profileFields.bio = bio; // Allow setting an empty bio

    try {
        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true } // Return the updated document
        ).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
