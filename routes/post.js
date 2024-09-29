const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

router.post('/comments', commentController.postComment);
router.get('/comments/load/:postId', commentController.loadComments);

router.post('/createPost', postController.createPost);
router.get('/allPost', postController.showPosts);
router.post('/updatePost', postController.updatePost);
router.delete('/delete/:id', postController.deletePost);

module.exports = router;
