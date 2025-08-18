// --- File: server/routes/auth.js ---
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/signup', [
  check('username', 'Username is required').not().isEmpty(),
  check('displayName', 'Display name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], signup);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], login);

module.exports = router;