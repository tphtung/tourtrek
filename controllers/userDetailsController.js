const User = require('../models/User');

exports.getAllUsersDetails = function(req, res) {
    User.getAll(function(err, results) {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
};

exports.getUserCount = (req, res) => {
    User.getUserCount((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        } else {
            res.send({ userCount: results[0].userCount });
        }
    });
};


