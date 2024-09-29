const commentModel = require('../models/Comment');

exports.postComment = (req, res) => {
    const { userId, postId, content } = req.body;
    commentModel.addComment(userId, postId, content, (err, result) => {
        if (err) {
            res.status(500).send("Lỗi khi đăng bình luận.");
        } else {
            res.redirect('/post'); // Hoặc bất kỳ view nào khác để hiển thị bình luận
        }
    });
};

// exports.loadComments = (req, res) => {
//     const postId = req.params.postId;
//     commentModel.getCommentsByPostId(postId, (err, comments) => {
//         if (err) {
//             res.status(500).send("Error loading comments.");
//             return;
//         }
//         const commentsHtml = comments.map(comment => {
//             return `
//                 <div class="comment-card">
//                     <img src="${comment.ProfilePicture || 'https://via.placeholder.com/25'}" alt="User avatar">
//                     <div class="comment-content">
//                         <strong>${comment.Name}:</strong>
//                         <p>${comment.Content}</p>
//                         <span class="text-muted">${comment.TimeAgo} trước</span>
//                     </div>
//                     <button type="button" class="btn btn-primary btn-sm" onclick="window.location.href='/chat?userId=${comment.UserID}&&postId=${comment.PostID}'">
//                         <i class="fas fa-comment-dots"></i>
//                     </button>
//                 </div>`;
//         }).join('');
//         res.send(commentsHtml);
//     });
// };


exports.loadComments = (req, res) => {
    const postId = req.params.postId;
    const currentUserId = req.user.UserID; // Giả sử bạn có thể truy cập UserID thông qua session
    
    commentModel.getCommentsByPostId(postId, (err, comments) => {
        if (err) {
            res.status(500).send("Error loading comments.");
            return;
        }
        const commentsHtml = comments.map(comment => {
            let showChatIcon = comment.UserID === currentUserId || comment.PostUserID === currentUserId;
            return `
                <div class="comment-card">
                    <img src="${comment.ProfilePicture || 'https://via.placeholder.com/25'}" alt="User avatar">
                    <div class="comment-content">
                        <strong>${comment.Name}:</strong>
                        <p>${comment.Content}</p>
                        <span class="text-muted">${comment.TimeAgo} trước</span>
                        ${showChatIcon ? `<button type="button" class="btn btn-primary btn-sm" onclick="window.location.href='/chat?userId=${comment.UserID}&postId=${postId}'">
                            <i class="fas fa-comment-dots"></i>
                        </button>` : ''}
                    </div>
                </div>`;
        }).join('');
        res.send(commentsHtml);
    });
};
