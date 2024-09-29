const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/comments/post', commentController.postComment);
router.get('/comments/load/:postId', commentController.loadComments);

module.exports = router;
