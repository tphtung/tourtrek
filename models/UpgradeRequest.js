// models/UpgradeRequest.js
const db = require('../config/db'); // Giả sử bạn đã cấu hình kết nối cơ sở dữ liệu

const UpgradeRequest = {
    getPendingRequests: function (callback) {
        const query = `
            SELECT u.UserID, u.Name, u.Email, a.RequestDate
            FROM Users u
            JOIN AccountUpgradeRequests a ON u.UserID = a.UserID
            WHERE a.Status = 'pending'
        `;
        return db.query(query, callback);
    },

    getRequestDetails: function (userID, callback) {
        const query = `
            SELECT u.Name, u.Email, g.Expertise, g.Experience, g.Gender, g.Birthdate, g.ContactNumber, g.Languages, g.Certifications, g.Introduction
            FROM Users u
            JOIN Guides g ON u.UserID = g.UserID
            WHERE u.UserID = ?
        `;
        return db.query(query, [userID], callback);
    },
    approveUpgradeRequest: function (userId, callback) {
        // Cập nhật trạng thái trong AccountUpgradeRequests và cập nhật Role trong Users
        db.beginTransaction((err) => {
            if (err) { callback(err); return; }

            const upgradeQuery = `UPDATE AccountUpgradeRequests SET Status='approved' WHERE UserID=?`;
            db.query(upgradeQuery, [userId], (error, results) => {
                if (error) {
                    return db.rollback(() => {
                        callback(error);
                    });
                }

                const userRoleQuery = `UPDATE Users SET Role='guide' WHERE UserID=?`;
                db.query(userRoleQuery, [userId], (error, results) => {
                    if (error) {
                        return db.rollback(() => {
                            callback(error);
                        });
                    }
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        callback(null);
                    });
                });
            });
        });
    },
    rejectUpgradeRequest: function (userId, callback) {
        // Xóa thông tin từ AccountUpgradeRequests
        db.beginTransaction((err) => {
            if (err) { callback(err); return; }

            const deleteQuery = `DELETE FROM AccountUpgradeRequests WHERE UserID=?`;
            db.query(deleteQuery, [userId], (error, results) => {
                if (error) {
                    return db.rollback(() => {
                        callback(error);
                    });
                }

                const removeFromGuidesQuery = `DELETE FROM Guides WHERE UserID=?`;
                db.query(removeFromGuidesQuery, [userId], (error, results) => {
                    if (error) {
                        return db.rollback(() => {
                            callback(error);
                        });
                    }
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => {
                                callback(err);
                            });
                        }
                        callback(null);
                    });
                });
            });
        });
    },

};



module.exports = UpgradeRequest;
