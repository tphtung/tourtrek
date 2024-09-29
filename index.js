const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const chatRoutes = require('./routes/chat');
const chatSocket = require('./socket');
const mysql = require('mysql');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./config/passport-setup')(passport); // Import passport configuration
const database = require('./config/db'); // Your MySQL database connection file
const homeRoutes = require('./routes/home');
const guideRoutes = require('./routes/guide');
const upgradeRequestRoutes = require('./routes/upgradeRequest');
const userDetailsRoutes = require('./routes/userDetails');
const postRoutes = require('./routes/post');
const { Post } = require('./models/Post');
const postController =  require('./controllers/postController');
const itineraryRoutes = require('./routes/itineraries');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


// Cấu hình ejs middleware
// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the directory where the template files are located
app.set('views', path.join(__dirname, 'views'));

// Cấu hình thư mục tĩnh
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));

// Body parser for forms
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/auth', require('./routes/auth'));
app.use('/guide', guideRoutes);
app.use('/admin', upgradeRequestRoutes);
app.use('/upgrade-requests', upgradeRequestRoutes);
app.use('/users', userDetailsRoutes);
app.use('/post', postRoutes);
app.use('/chat', chatRoutes);
app.use('/api/itineraries', itineraryRoutes);

// app.get('/', (req, res, next) => {
//   if (req.isAuthenticated()) { // Đảm bảo rằng bạn đã cấu hình xác thực
//     res.render('home', { user: req.user }); // `req.user` là object người dùng sau khi đăng nhập
//   } else {
//     res.render('home', { user: { ProfilePicture: '/path/to/default/avatar.png' } }); // Đường dẫn đến ảnh mặc định
//     next();
//   }
// });

// Bất kỳ file nào, ví dụ như index.js
app.get('/', (req, res) => {
  database.query("SELECT UserID, Name, ProfilePicture FROM Users WHERE Role = 'guide'", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Lỗi máy chủ.");
    }
    Post.getLatestPosts((errPosts, resultsPosts) => {
      if (errPosts) {
        console.error(errPosts);
        return res.status(500).send({ message: "Error retrieving latest posts", error: errPosts });
      }
      if (req.isAuthenticated()) {
        // Người dùng đã đăng nhập, truyền cả thông tin người dùng và guides
        res.render('home', { user: req.user, guides: results || [], posts: resultsPosts || [] });
      } else {
        // Người dùng chưa đăng nhập, không truyền thông tin người dùng
        res.render('home', { user: null, guides: results || [], posts: resultsPosts || [] });
      }
    });
    });
  });


  // app.get('/admin', (req, res) => {
  //   return res.render('admin');
  // })


  // app.get('/chat', (req, res) => {
  //   if (!req.isAuthenticated()) {
  //     return res.redirect('/login');
  //   }
  //   const receiverId = req.query.receiverId;
  //   // Bạn cần lấy thông tin chi tiết của người nhận nếu cần
  //   // Và sau đó truyền nó xuống view cùng với user
  //   res.render('chat', { user: req.user, receiverId: receiverId });
  // });


  app.get('/guide', function (req, res) {
    if (!req.isAuthenticated()) {
      // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang đăng nhập
      return res.redirect('/login');
    }
    // Nếu người dùng đã đăng nhập, hiển thị trang 'travler' với thông tin người dùng
    res.render('guide', { user: req.user });
  });

  app.get('/login', (req, res) => {
    return res.render('login');
  })

  app.get('/post', function (req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
    Post.getAllPosts((err, posts) => {
      if (err) {
        // Xử lý lỗi, có thể log lỗi hoặc hiển thị thông báo lỗi
        console.error(err);
        return res.status(500).send("Lỗi khi lấy dữ liệu bài viết");
      }
      res.render('post', { user: req.user, posts: posts, userId: req.user.UserID });
    });
  });
  app.get('/travler', function (req, res) {
    if (!req.isAuthenticated()) {
      // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang đăng nhập
      return res.redirect('/login');
    }
    // Nếu người dùng đã đăng nhập, hiển thị trang 'travler' với thông tin người dùng
    res.render('travler', { user: req.user });
    // postController.showPostsById(req, res);
  });

  chatSocket(io); // Tích hợp Socket.IO với chat


  const PORT = process.env.PORT || 8080;
  server.listen(PORT, console.log(`Server started on port ${PORT}`));