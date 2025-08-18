const User = require('../models/User');
const Post = require('../models/Post');

exports.search = async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
  
    try {
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { displayName: { $regex: query, $options: 'i' } }
        ]
      }).select('-passwordHash').limit(10);
  
      const posts = await Post.find({ $text: { $search: query } })
        .populate('author', ['displayName', 'username', 'profilePic'])
        .limit(10);
  
      res.json({ success: true, users, posts });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
};