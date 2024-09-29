const express = require('express');
const router = express.Router();
const userDetailsController = require('../controllers/userDetailsController');

router.get('/details', userDetailsController.getAllUsersDetails);
router.get('/count', userDetailsController.getUserCount);

module.exports = router;
