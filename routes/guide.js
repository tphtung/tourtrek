// routes/guide.js
const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

// Định nghĩa route để xử lý form gửi lên
router.post('/submit-upgrade', guideController.submitUpgradeRequest);
router.get('/me', guideController.getMyProfile);
router.get('/:UserID', guideController.getGuideProfile);


module.exports = router;
