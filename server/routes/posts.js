// --- File: server/routes/posts.js ---
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const { createPost, getFeed, getTrending, likePost, updatePost, deletePost, getCommentsForPost, createCommentForPost } = require('../controllers/postController');

router.post('/', [auth, [check('content', 'Content is required').not().isEmpty()]], createPost);
router.get('/feed', auth, getFeed);
router.get('/trending', auth, getTrending);
router.post('/:id/like', auth, likePost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.get('/:id/comments', auth, getCommentsForPost);
router.post('/:id/comments', [auth, [check('content', 'Content is required').not().isEmpty()]], createCommentForPost);

module.exports = router;