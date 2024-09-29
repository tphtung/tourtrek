const express = require('express');
const router = express.Router();
const upgradeRequestController = require('../controllers/upgradeRequestController');

router.get('/', upgradeRequestController.showPendingRequests);
router.get('/details/:userId', upgradeRequestController.getRequestDetails);
router.post('/approve/:userId', upgradeRequestController.approveRequest);
router.delete('/reject/:userId', upgradeRequestController.rejectRequest);

module.exports = router;
