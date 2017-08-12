const router = require('express').Router();
const auth = require('./auth');
const posts = require('./posts');
const authMiddleware = require('../../middlewares/auth');

router.use('/auth', auth);
router.use('/post', authMiddleware, posts);
module.exports = router;