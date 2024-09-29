const Message = require('../models/Message');
const { Post } = require('../models/Post');

const db = require('../config/db');


exports.getChat = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  const postId = req.query.postId;
  const participantId = req.query.userId; // ID của người dùng mà bạn muốn chat

  // Giả định rằng bạn đã truy vấn cơ sở dữ liệu để lấy ID của người đăng bài
  Post.getPostById(postId, (err, post) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Lỗi khi truy vấn bài viết");
    }

    let receiverId, senderId;
    if (req.user.UserID === post.UserID) {
      // Người dùng hiện tại là người đăng bài
      senderId = req.user.UserID;
      receiverId = participantId; // người nhận là người đã bình luận
    } else {
      // Người dùng hiện tại là người bình luận
      senderId = req.user.UserID;
      receiverId = post.UserID; // người nhận là người đăng bài
    }



    // Truy vấn tin nhắn từ database trước khi render view
    Message.getAllMessagesByParticipants(postId, senderId, receiverId, (err, messages) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Lỗi khi truy vấn tin nhắn");
      }


      // Chuyển dữ liệu tin nhắn lấy được vào view
      res.render('chat', {
        user: req.user,
        messages: messages,
        receiverId: receiverId,
        postId: postId
      });
    });
  });
};


exports.saveMessage = (messageData, callback) => {
  // Giả định cấu trúc của messageData là { senderId, receiverId, content }
  Message.create(messageData, (err, result) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    callback(null, result);
  });
};

exports.getMessagesByPostId = (req, res) => {
  const { postId } = req.params;
  Message.getAllMessagesByPostId(postId, (err, messages) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(messages);
    }
  });

};
