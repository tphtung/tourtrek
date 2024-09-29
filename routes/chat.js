const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route cho trang chat
router.get('/', chatController.getChat);

module.exports = router;
