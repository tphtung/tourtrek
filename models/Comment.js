const db = require('../config/db');

// // Hàm để thêm một bình luận mới vào cơ sở dữ liệu
// exports.addComment = (userId, postId, content, callback) => {
//     const sql = `INSERT INTO Comments (UserID, PostID, Content) VALUES (?, ?, ?)`;
//     db.query(sql, [userId, postId, content], (err, result) => {
//         if (err) return callback(err);
//         callback(null, { id: result.insertId, content: content });
//     });
// };

// // Hàm để lấy các bình luận của một bài đăng
// exports.getCommentsByPostId = (postId, callback) => {
//     const sql = `
//         SELECT Comments.*, Users.Name, Users.ProfilePicture,
//                TIMESTAMPDIFF(MINUTE, Comments.CreateAt, NOW()) AS TimeAgo
//         FROM Comments
//         JOIN Users ON Comments.UserID = Users.UserID
//         WHERE Comments.PostID = ?
//         ORDER BY Comments.CreateAt DESC`;
//     db.query(sql, [postId], (err, results) => {
//         if (err) return callback(err);
//         callback(null, results);
//     });
// };


// Hàm để lấy các bình luận của một bài đăng cùng với UserID của người đăng bài
exports.getCommentsByPostId = (postId, callback) => {
    const sql = `
        SELECT Comments.*, Users.Name, Users.ProfilePicture,
               TIMESTAMPDIFF(MINUTE, Comments.CreateAt, NOW()) AS TimeAgo, Posts.UserID AS PostUserID
        FROM Comments
        JOIN Users ON Comments.UserID = Users.UserID
        JOIN Posts ON Comments.PostID = Posts.PostID
        WHERE Comments.PostID = ?
        ORDER BY Comments.CreateAt DESC`;
    db.query(sql, [postId], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// Hàm để thêm một bình luận mới vào cơ sở dữ liệu
exports.addComment = (userId, postId, content, callback) => {
    const sql = `INSERT INTO Comments (UserID, PostID, Content) VALUES (?, ?, ?)`;
    db.query(sql, [userId, postId, content], (err, result) => {
        if (err) return callback(err);
        callback(null, { id: result.insertId, content: content });
    });
};
