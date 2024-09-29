// home.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

// Route này giờ được xử lý bởi userController.getUserProfile
router.get('/profile', userController.getUserProfile);
// router.get('/', userController.getGuidesList);
// router.get('/post/details/:postId', postController.showPostDetails);
module.exports = router;
