const db = require('../config/db');

const Tour = {
    save: function (tourData, callback) {
        console.log("Preparing to execute SQL for saving tour");
        const sql = `INSERT INTO Tours (Name, Description, Location, StartDate, EndDate, Cost, Duration) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [
            tourData.name, 
            tourData.description, 
            tourData.location, 
            tourData.startDate, 
            tourData.endDate, 
            tourData.cost, 
            tourData.duration
        ], function(err, result) {
            if (err) {
                console.error("Error saving tour:", err);
                return callback(err);
            }
            console.log("Tour saved with ID:", result.insertId);
            callback(null, result.insertId); // Trả về ID của tour mới để có thể cập nhật cho Itinerary nếu cần
        });
    }
};

module.exports = Tour;