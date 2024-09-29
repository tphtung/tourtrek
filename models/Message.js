const db = require('../config/db');

const Message = {
  create: (messageData, callback) => {
    // Thêm PostID vào câu truy vấn INSERT
    const query = `INSERT INTO Message (SenderID, ReceiverID, Content, PostID) VALUES (?, ?, ?, ? )`;
    // Thêm PostID vào danh sách các tham số
    db.query(
      query,
      [messageData.senderId, messageData.receiverId, messageData.content, messageData.postId],
      callback
    );
  },
  // Các phương thức khác nếu cần
  getAllMessagesByParticipants: (postId, senderId, receiverId, callback) => {
    const query = `SELECT m.*, u.Name, u.ProfilePicture
                   FROM Message m
                   JOIN Users u ON m.SenderID = u.UserID
                   WHERE m.PostID = ? AND ((m.SenderID = ? AND m.ReceiverID = ?) OR (m.SenderID = ? AND m.ReceiverID = ?))
                   ORDER BY m.CreateAt ASC`;
    db.query(query, [postId, senderId, receiverId, receiverId, senderId], callback);
  },

  // Tiếp tục trong `const Message = {...}`
  getMessageById: (messageId, callback) => {
    const query = `SELECT m.*, u.Name, u.ProfilePicture
                 FROM Message m
                 JOIN Users u ON m.SenderID = u.UserID
                 WHERE m.MessageID = ?`;
    db.query(query, [messageId], callback);
  },

};

module.exports = Message;
