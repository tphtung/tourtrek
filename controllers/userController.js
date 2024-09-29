// userController.js
const database = require('../config/db');

const userController = {
    getUserProfile: (req, res) => {
        if (req.isAuthenticated()) {
            const userID = req.user.UserID;
            database.query('SELECT * FROM Users WHERE UserID = ?', [userID], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Lỗi máy chủ.");
                }
                const user = result[0];
                
                // Lấy view từ tham số truy vấn, nếu không có, mặc định là 'traveler'
                const view = req.query.view || 'traveler'; 
    
                // Sử dụng switch-case để xử lý nhiều trường hợp views khác nhau
                switch(view) {
                    case 'post':
                        res.render('post', { user: user });
                        break;
                    case 'guide':
                        res.render('guide', { user: user });
                        break;
                    case 'admin':
                        res.render('admin', { user: user });
                        break;
                    // Thêm các trường hợp khác nếu cần
                    default:
                        res.render('traveler', { user: user }); // View mặc định
                }
            });
        } else {
            res.redirect('/login');
        }
    },

    // getGuidesList: (req, res) => {
    //     database.query("SELECT Name, ProfilePicture FROM Users WHERE Role = 'guide'", (err, results) => {
    //         if (err) {
    //             console.error(err);
    //             return res.status(500).send("Lỗi máy chủ.");
    //         }
    //         // Log để kiểm tra kết quả
    //         console.log(results);

    //         // Nếu results không có phần tử nào, log lại và kiểm tra
    //         if (!results || results.length === 0) {
    //             console.log('Không tìm thấy guides nào.');
    //             res.render('home', { guides: [] }); // Đảm bảo luôn truyền một mảng
    //         } else {
    //             res.render('home', { guides: results });
    //         }
    //     });
    // }
};



module.exports = userController;
