const chatController = require('./controllers/chatController');
const ItineraryController = require('./controllers/ItineraryController');
const Message = require('./models/Message');



let userSockets = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Người dùng đã kết nối, Socket ID:', socket.id);

        socket.on('register', userId => {
            userSockets[userId] = socket.id;
            console.log(`Đã đăng ký người dùng ${userId} với Socket ID ${socket.id}`);
        });

        socket.on('load old messages', data => {
            Message.getAllMessagesByParticipants(data.postId, data.senderId, data.receiverId, (err, messages) => {
                if (err) {
                    console.error("Lỗi lấy tin nhắn cũ:", err);
                    return;
                }
                io.to(socket.id).emit('old messages', messages);
            });
        });

        socket.on('chat message', (msg) => {
            console.log('Nhận tin nhắn:', msg);
            if (msg.senderId === msg.receiverId) {
                console.log('Lỗi: Người gửi và người nhận không thể giống nhau.');
                return;
            }

            const senderSocketId = userSockets[msg.senderId];
            const receiverSocketId = userSockets[msg.receiverId];

            if (!senderSocketId || !receiverSocketId) {
                console.log('Không tìm thấy một trong các Socket ID:', `Sender: ${senderSocketId}, Receiver: ${receiverSocketId}`);
                return;
            }

            // Lưu tin nhắn vào cơ sở dữ liệu
            Message.create(msg, (err, result) => {
                if (err) {
                    console.error("Lỗi lưu tin nhắn:", err);
                    return;
                }
                console.log("Lưu tin nhắn thành công, ID tin nhắn:", result.insertId);

                // Lấy tin nhắn đầy đủ từ cơ sở dữ liệu để gửi đi
                // Lấy tin nhắn đầy đủ từ cơ sở dữ liệu để gửi đi
                Message.getMessageById(result.insertId, (err, fullMessages) => {
                    if (err) {
                        console.error("Lỗi lấy thông tin tin nhắn:", err);
                        return;
                    }

                    if (!fullMessages || fullMessages.length === 0) {
                        console.log('Không có tin nhắn để gửi');
                        return;
                    }

                    const fullMessage = fullMessages[0]; // Lấy phần tử đầu tiên nếu là mảng
                    console.log('Tin nhắn đầy đủ: ', fullMessage);

                    // Gửi tin nhắn đã chuẩn bị
                    io.to(senderSocketId).to(receiverSocketId).emit('chat message', {
                        MessageID: fullMessage.MessageID,
                        SenderID: fullMessage.SenderID,
                        ReceiverID: fullMessage.ReceiverID,
                        Content: fullMessage.Content,
                        CreateAt: fullMessage.CreateAt,
                        PostID: fullMessage.PostID,
                        Name: fullMessage.Name,
                        ProfilePicture: fullMessage.ProfilePicture || '/public/images/user_1144760.png'
                    });
                });

            });
        });

        socket.on('update tour', (tourData) => {
            // Giả sử bạn đã lấy senderSocketId và receiverSocketId từ mapping user ID sang socket ID
            const senderSocketId = userSockets[tourData.senderId];
            const receiverSocketId = userSockets[tourData.receiverId];
            console.log('tourData: ', tourData);
            // Gửi dữ liệu tour đã cập nhật tới cả người gửi và người nhận
            io.to(senderSocketId).emit('tour updated', tourData);
            io.to(receiverSocketId).emit('tour updated', tourData);
        });

        // socket.js
        socket.on('finalConfirm', (tourDetails, senderId, receiverId) => {
            console.log(`Received finalConfirm from ${senderId} to ${receiverId} with details:`, tourDetails);
            ItineraryController.finalConfirm(socket, tourDetails, senderId, receiverId);
        });


        socket.on('disconnect', () => {
            console.log('Người dùng ngắt kết nối', socket.id);
            Object.keys(userSockets).forEach(userId => {
                if (userSockets[userId] === socket.id) {
                    delete userSockets[userId];
                    console.log(`Bỏ đăng ký người dùng ${userId}`);
                }
            });
        });


    });
};

