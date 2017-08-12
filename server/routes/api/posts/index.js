const router = require('express').Router();
const controller = require('./posts.controller');
const authMiddleware = require('../../../middlewares/auth');

router.get('/', authMiddleware, controller.getPosts);
router.post('/', authMiddleware, controller.createPost);
router.put('/:pid', authMiddleware, controller.modifyPost);
router.delete('/:pid', authMiddleware, controller.deletePost);

module.exports = router;