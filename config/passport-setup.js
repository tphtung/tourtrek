const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const database = require('./db'); // Điều chỉnh đường dẫn này tới file cấu hình DB của bạn

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        // Chiến lược xác thực cục bộ
        database.query('SELECT * FROM Users WHERE Email = ?', [email], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                const user = result[0];
                // So sánh mật khẩu
                bcrypt.compare(password, user.Password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Mật khẩu không chính xác' });
                    }
                });
            } else {
                return done(null, false, { message: 'Email không tồn tại' });
            }
        });
    }));

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        // Chiến lược xác thực qua Google
        database.query('SELECT * FROM Users WHERE GoogleID = ?', [profile.id], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                // Người dùng đã tồn tại
                return done(null, result[0]);
            } else {
                // Tạo người dùng mới
                const newUser = {
                    GoogleID: profile.id,
                    Email: profile.emails[0].value,
                    Name: profile.displayName,
                    ProfilePicture: profile.photos[0].value,
                    Role: 'tourist', // Giả sử mặc định là tourist
                    OAuthProvider: 'google' // Đặt nhà cung cấp OAuth là 'google'
                };
                database.query('INSERT INTO Users SET ?', newUser, (err, result) => {
                    if (err) throw err;
                    newUser.UserID = result.insertId;
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.UserID); // Hoặc một trường định danh duy nhất khác của người dùng
    });

    passport.deserializeUser((id, done) => {
        database.query('SELECT * FROM Users WHERE UserID = ?', [id], (err, results) => {
            if (err) {
                return done(err);
            }
            done(null, results[0]);
        });
    });

};
