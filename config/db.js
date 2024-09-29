require('dotenv').config();
const mysql = require('mysql');

// Tạo một kết nối đến cơ sở dữ liệu
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Kết nối đến cơ sở dữ liệu
db.connect(err => {
    if (err) {
        console.error('Lỗi kết nối đến cơ sở dữ liệu: ' + err.stack);
        return;
    }
    console.log('Kết nối thành công đến cơ sở dữ liệu.');
});

module.exports = db;
