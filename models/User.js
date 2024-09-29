const db = require('../config/db'); // Giả sử db là một module để kết nối cơ sở dữ liệu

const User = {
    getAll: function(callback) {
        const query = 'SELECT UserID, Email, Name, Role, CreateAt FROM Users';
        db.query(query, callback);
    }, 

    getUserCount: function(callback) {
        db.query('SELECT COUNT(*) AS userCount FROM Users', callback);
    }
};



module.exports = User;
