// controllers/upgradeRequestController.js
const UpgradeRequest = require('../models/UpgradeRequest');

exports.showPendingRequests = function(req, res) {
    UpgradeRequest.getPendingRequests(function(err, result) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.render('admin', { pendingRequests: result });
        }
    })
};

exports.getRequestDetails = function(req, res) {
    const userId = req.params.userId;
    UpgradeRequest.getRequestDetails(userId, function(err, result) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.json(result);
        }
    });
};

exports.approveRequest = function(req, res) {
    const userId = req.params.userId;
    UpgradeRequest.approveUpgradeRequest(userId, (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.send({ message: 'Request approved successfully.' });
        }
    });
};

exports.rejectRequest = function(req, res) {
    const userId = req.params.userId;
    UpgradeRequest.rejectUpgradeRequest(userId, (err) => {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.send({ message: 'Request rejected successfully.' });
        }
    });
};