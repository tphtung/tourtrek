const { Post, PostImage } = require('../models/Post');
const upload = require('../routes/uploadConfig');

exports.createPost = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).send({ message: "Error uploading files.", error: err });
        }

        const userID = req.user.UserID;
        const { postType, postTitle, postContent } = req.body;
        const imagePaths = req.files.map(file => file.path);

        Post.create({ UserID: userID, PostTitle: postTitle, PostContent: postContent, PostType: postType }, (error, result) => {
            if (error) {
                return res.status(500).send({ message: "Error creating post", error });
            }

            const postId = result.insertId;
            if (imagePaths.length > 0) {
                PostImage.insert(postId, imagePaths, (err, imgResult) => {
                    if (err) {
                        return res.status(500).send({ message: "Error saving post images", error: err });
                    }
                    res.redirect('/post'); // Hoặc trả về kết quả thành công qua JSON
                });
            } else {
                res.redirect('/post'); // Hoặc trả về kết quả thành công qua JSON
            }
        });
    });
};

exports.showPosts = (req, res) => {
    // Chỉ lấy phần số ID từ query parameter, đảm bảo không có thêm ký tự nào khác
    Post.getAllPosts((err, posts) => {
        if (err) {
            res.status(500).send({ message: "Lỗi khi lấy danh sách bài viết" });
        } else {
            res.render('post', { user: req.user, posts: posts, scrollToPostId: scrollToPostId });
        }
    });
};


exports.deletePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.user.UserID; // Lấy ID người dùng từ session hoặc token
    Post.deleteRelatedTours(postId, (err, result) => {
        if (err) {
            console.error("Error deleting related tours and itineraries: ", err);
            return res.status(500).send({ message: "Error deleting related tours and itineraries", error: err });
        }
        Post.deleteItinerariesRelatedToPost(postId, (err, result) => {
            if (err) {
                console.error("Error deleting itineraries: ", err);
                return res.status(500).send({ message: "Error deleting related itineraries", error: err });
            }

            Post.deleteMessagesRelatedToPost(postId, (err, result) => {
                if (err) {
                    console.error("Error deleting messages: ", err);
                    return res.status(500).send({ message: "Error deleting related messages", error: err });
                }
                // Bước 1: Xóa các bình luận liên quan
                Post.deleteComments(postId, (err, result) => {
                    if (err) {
                        console.error("Error deleting comments: ", err);
                        return res.status(500).send({ message: "Error deleting related comments", error: err });
                    }

                    Post.deletePostImages(postId, (err, result) => {
                        if (err) {
                            console.error("Error deleting post images: ", err);
                            return res.status(500).send({ message: "Error deleting related post images", error: err });
                        }
                        // Bước 2: Xóa bài viết
                        Post.deletePost(postId, userId, (err, result) => {
                            if (err) {
                                console.error("Error deleting post: ", err);
                                return res.status(500).send({ message: "Error deleting post", error: err });
                            }
                            res.send({ message: "Post and related comments deleted successfully" });
                        });
                    });
                });
            });
        });
    });
};



exports.updatePost = (req, res) => {
    const { postID, postTitle, postContent, postType } = req.body;
    const userID = req.user.UserID;

    Post.update(postID, userID, { PostTitle: postTitle, PostContent: postContent, PostType: postType }, (updateError, updateResults) => {
        if (updateError) {
            return res.status(500).send({ message: "Error updating post", error: updateError });
        } else {
            res.redirect('/post'); // Điều hướng người dùng trở lại danh sách bài viết sau khi cập nhật thành công
        }
    });
};

