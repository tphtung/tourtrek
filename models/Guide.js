// models/Guide.js
const db = require('../config/db'); // Đảm bảo bạn đã cấu hình kết nối cơ sở dữ liệu trong file này

const Guide = {
  createGuide: function (userData, callback) {
    // Chắc chắn rằng bạn đã bao gồm userID trong câu lệnh SQL
    const sql = `INSERT INTO Guides (UserID, Expertise, Experience, Gender, Birthdate, ContactNumber, Languages, Certifications, Introduction, Status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'inactive')`;
    db.query(sql, [
      userData.userID, // Đây là userID từ thông tin người dùng
      userData.expertise,
      userData.experience,
      userData.gender,
      userData.birthdate,
      userData.contactNumber,
      userData.languages,
      userData.certifications,
      userData.introduction
    ], callback);
  },
  createAccountUpgradeRequest: function (userID, callback) {
    // Sử dụng userID để tạo một yêu cầu nâng cấp
    const sql = `INSERT INTO AccountUpgradeRequests (UserID, RequestedRole, Status)
                 VALUES (?, 'guide', 'pending')`;
    db.query(sql, [userID], callback);
  },

  getGuideDetailsByUserId: function (userID, callback) {
    const sql = `
      SELECT g.*, u.Email, u.Name, u.ProfilePicture, u.Role
      FROM Guides g
      JOIN Users u ON g.UserID = u.UserID
      WHERE u.UserID = ? AND u.Role = 'guide';
    `;
    db.query(sql, [userID], function (err, results) {
      if (err) {
        return callback(err, null);
      }
      callback(null, results); // Trả về tất cả kết quả, xem xét giới hạn nếu cần
    });
  }
};

// Trong file models/Guide.js
Guide.checkUpgradeStatus = function (userID, callback) {
  const sql = `SELECT Status FROM AccountUpgradeRequests WHERE UserID = ? ORDER BY RequestDate DESC LIMIT 1`;
  db.query(sql, [userID], function (err, results) {
    if (err) {
      return callback(err, null);
    }
    // Trả về trạng thái mới nhất
    if (results.length > 0) {
      callback(null, results[0].Status);
    } else {
      callback(null, 'none'); // Không có yêu cầu nào được tìm thấy
    }
  });
};



module.exports = Guide;
