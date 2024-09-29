const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/ItineraryController');

router.get('/details', itineraryController.getItineraries);
router.get('/details/:id', itineraryController.getItineraryById);

module.exports = router;
