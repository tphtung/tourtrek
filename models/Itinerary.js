const db = require('../config/db');

const Itinerary = {
    findOrCreateItinerary: function (tourDetails, senderId, receiverId, callback) {
        // Sử dụng PostID nếu TourID là NULL
        const queryID = tourDetails.tourId || tourDetails.postId;

        const sqlFind = `SELECT * FROM Itineraries WHERE (TourID = ? OR PostID = ?) AND ((User1ID = ? AND User2ID = ?) OR (User1ID = ? AND User2ID = ?))`;
        db.query(sqlFind, [queryID, queryID, senderId, receiverId, receiverId, senderId], function (err, results) {
            if (err) return callback(err, null);

            if (results.length === 0) {
                const sqlInsert = `INSERT INTO Itineraries (TourID, PostID, User1ID, User2ID, Status) VALUES (?, ?, ?, ?, 'pending')`;
                db.query(sqlInsert, [tourDetails.tourId, tourDetails.postId, senderId, receiverId], function (insertErr, insertResult) {
                    if (insertErr) return callback(insertErr, null);
                    callback(null, { ItineraryID: insertResult.insertId, isNew: true, User1ID: senderId, User2ID: receiverId });
                });
            } else {
                callback(null, results[0]);
            }
        });
    },

    checkAndUpdateStatus: function (itineraryId, callback) {
        const sqlCheck = `SELECT * FROM Itineraries WHERE ItineraryID = ?`;
        db.query(sqlCheck, [itineraryId], function (err, results) {
            if (err) return callback(err, null);
            if (results[0].User1Confirmed && results[0].User2Confirmed) {
                const sqlUpdate = `UPDATE Itineraries SET Status = 'completed' WHERE ItineraryID = ?`;
                db.query(sqlUpdate, [itineraryId], function(updateErr) {
                    if (updateErr) return callback(updateErr);
                    callback(null, 'completed'); // Trả về 'completed' để xác nhận rằng trạng thái đã được cập nhật thành công
                });
            } else {
                callback(null, 'pending');
            }
        });
    },
    
    // updateConfirmation: function (itineraryId, userId, callback) {
    //     const sqlFindUser = `SELECT User1ID, User2ID FROM Itineraries WHERE ItineraryID = ?`;
    //     db.query(sqlFindUser, [itineraryId], function(err, results) {
    //         if (err) return callback(err);
    //         if (results.length === 0) return callback(new Error("Itinerary not found"));

    //         const itinerary = results[0];
    //         const isUser1 = itinerary.User1ID === userId;
    //         const isUser2 = itinerary.User2ID === userId;

    //         if (!isUser1 && !isUser2) {
    //             // Nếu không tìm thấy User1 hoặc User2 trong bản ghi
    //             return callback(new Error("User not part of the itinerary"));
    //         }

    //         const sqlUpdate = `
    //             UPDATE Itineraries 
    //             SET User1Confirmed = CASE WHEN User1ID = ? THEN TRUE ELSE User1Confirmed END,
    //                 User2Confirmed = CASE WHEN User2ID = ? THEN TRUE ELSE User2Confirmed END 
    //             WHERE ItineraryID = ?`;
    //         db.query(sqlUpdate, [userId, userId, itineraryId], callback);
    //     });
    // },
    updateConfirmation: function (itineraryId, userId, callback) {
        const sqlFindUser = `SELECT User1ID, User2ID, User1Confirmed, User2Confirmed FROM Itineraries WHERE ItineraryID = ?`;
        db.query(sqlFindUser, [itineraryId], function(err, results) {
            if (err) return callback(err);
            if (results.length === 0) return callback(new Error("Itinerary not found"));
    
            const itinerary = results[0];
            const isUser1 = itinerary.User1ID === userId && !itinerary.User1Confirmed;
            const isUser2 = itinerary.User2ID === userId && !itinerary.User2Confirmed;
    
            if (!isUser1 && !isUser2) {
                return callback(new Error("User not part of the itinerary or already confirmed"));
            }
    
            let sqlUpdate = `UPDATE Itineraries SET `;
            if (isUser1) {
                sqlUpdate += `User1Confirmed = TRUE `;
            } else if (isUser2) {
                sqlUpdate += `User2Confirmed = TRUE `;
            }
            sqlUpdate += `WHERE ItineraryID = ?`;
    
            db.query(sqlUpdate, [itineraryId], callback);
        });
    },
    
    updateTourId: function (itineraryId, tourId, callback) {
        const sql = `UPDATE Itineraries SET TourID = ? WHERE ItineraryID = ?`;
        db.query(sql, [tourId, itineraryId], callback);
    },

    getAllDetails: function(callback) {
        const query = `
            SELECT I.ItineraryID, T.Name AS TourName, U1.Name AS User1Name, U2.Name AS User2Name
            FROM Itineraries I
            JOIN Tours T ON I.TourID = T.TourID
            JOIN Users U1 ON I.User1ID = U1.UserID
            JOIN Users U2 ON I.User2ID = U2.UserID;
        `;
        db.query(query, callback);
    },

    getDetailsById: function(itineraryId, callback) {
        const query = `
            SELECT I.ItineraryID, T.*, U1.Name AS User1Name, U2.Name AS User2Name
            FROM Itineraries I
            JOIN Tours T ON I.TourID = T.TourID
            JOIN Users U1 ON I.User1ID = U1.UserID
            JOIN Users U2 ON I.User2ID = U2.UserID
            WHERE I.ItineraryID = ?;
        `;
        db.query(query, [itineraryId], callback);
    }

};

module.exports = Itinerary;
