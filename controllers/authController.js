// authController.js
const bcrypt = require('bcryptjs');
const passport = require('passport');
const database = require('../config/db');

exports.saveReferer = (req, res, next) => {
    req.session.oauthReferer = req.headers.referer || '/';
    next();
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!password || password.length === 0) {
        return res.status(400).send("Mật khẩu không được để trống.");
    }
    const role = 'tourist';

    try {
        const results = await new Promise((resolve, reject) => {
            database.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        if (results.length > 0) {
            return res.status(409).send("Tài khoản đã tồn tại. Vui lòng sử dụng email khác.");
        } else {
            const hash = await bcrypt.hash(password, 10);
            await new Promise((resolve, reject) => {
                database.query('INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)', [name, email, hash, role], (insertError, result) => {
                    if (insertError) reject(insertError);
                    resolve(result);
                });
            });

            // Đăng nhập tự động sau khi đăng ký
            const newUserResults = await new Promise((resolve, reject) => {
                database.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
                    if (err) reject(err);
                    resolve(results); // Just pass the results array forward.
                });
            })

            const newUserDetails = newUserResults[0];
            if (!newUserDetails) {
                return res.status(500).send("Không thể lấy thông tin người dùng sau khi đăng ký.");
            }

            req.login(newUserDetails, (loginError) => {
                if (loginError) {
                    console.error(loginError);
                    return res.status(500).send("Lỗi đăng nhập tự động sau khi đăng ký.");
                }
                const redirectUrl = req.session.oauthReferer || '/';
                delete req.session.oauthReferer;
                res.redirect(redirectUrl); // Trở về trang trước sau khi đăng ký thành công
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Lỗi máy chủ khi kiểm tra email hoặc chèn người dùng mới.");
    }
};

// exports.login = (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (err) return next(err);
//         if (!user) {
//             return res.redirect('/login');
//         }
//         req.logIn(user, (err) => {
//             if (err) return next(err);
//             const redirectUrl = req.session.oauthReferer || '/';
//             delete req.session.oauthReferer;
//             res.redirect(redirectUrl); // Quay trở lại trang trước sau khi đăng nhập thành công
//         });
//     })(req, res, next);
// };

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.redirect('/login'); // Chuyển hướng đến trang đăng nhập nếu xác thực thất bại
        }
        req.logIn(user, (err) => {
            if (err) return next(err);

            // Khởi tạo biến redirectUrl
            let redirectUrl = req.session.oauthReferer || '/';
            try {
                // Thử tạo một đối tượng URL từ oauthReferer
                const parsedUrl = new URL(redirectUrl, 'http://localhost:8080'); // Điều chỉnh URL cơ bản nếu cần
                // Thêm vai trò của người dùng vào URL dưới dạng tham số truy vấn
                parsedUrl.searchParams.set('role', user.Role);
                redirectUrl = parsedUrl.toString(); // Cập nhật redirectUrl với URL đã được chỉnh sửa
            } catch (error) {
                // Nếu có lỗi, giữ nguyên redirectUrl mặc định
                console.error('Lỗi khi xử lý URL:', error);
            }

            delete req.session.oauthReferer; // Xóa oauthReferer khỏi session
            res.redirect(redirectUrl); // Chuyển hướng dựa trên vai trò
        });
    })(req, res, next);
};


exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        // Điều chỉnh URL chuyển hướng sau đăng xuất nếu cần
        const redirectUrl = req.headers.referer || '/login';
        res.redirect(redirectUrl);
    });
};

exports.googleRedirect = (req, res) => {
    // Logic giữ nguyên
    if (req.user) {
        let targetUrl = req.session.oauthReferer || '/';
        if (req.user.Role === 'admin') {
            targetUrl = '/admin';
        } else {
            const parsedUrl = new URL(targetUrl, 'http://localhost:8080');
            parsedUrl.searchParams.set('role', req.user.Role);
            targetUrl = parsedUrl.toString();
        }
        delete req.session.oauthReferer;
        res.redirect(targetUrl);
    } else {
        res.redirect('/login');
    }
};

