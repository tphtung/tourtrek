const db = require('../config/db');

// SELECT Posts.*, PostImages.ImageURL
// FROM Posts
// LEFT JOIN PostImages ON Posts.PostID = PostImages.PostID
// ORDER BY Posts.CreateAt DESC

const Post = {
  create: function (newPost, callback) {
    const query = "INSERT INTO Posts (UserID, PostTitle, PostContent, PostType, CreateAt, UpdateAt) VALUES (?, ?, ?, ?, NOW(), NOW())";
    db.query(query, [newPost.UserID, newPost.PostTitle, newPost.PostContent, newPost.PostType], callback);
  },
  getAllPosts: function (callback) {
    const query = ` SELECT p.PostID, p.UserID, p.PostTitle, p.PostContent, p.PostType, p.CreateAt, p.UpdateAt,
    u.Name, u.ProfilePicture, PostImages.ImageURL
FROM Posts p
JOIN Users u ON p.UserID = u.UserID
LEFT JOIN PostImages ON p.PostID = PostImages.PostID
ORDER BY p.CreateAt DESC
`;
    db.query(query, function (err, results) {
      callback(err, results);
    });
  },


  getPostById: function (postId, callback) {
    const query = 'SELECT * FROM Posts WHERE PostID = ?';
    db.query(query, [postId], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results[0]); // Trả về bản ghi đầu tiên vì PostID là khóa chính, duy nhất
      }
    });
  },
  
  update: function (postId, userId, postData, callback) {
    const { PostTitle, PostContent, PostType } = postData;
    let query = "UPDATE Posts SET PostTitle = ?, PostContent = ?, PostType = ? WHERE PostID = ? AND UserID = ?";
    db.query(query, [PostTitle, PostContent, PostType, postId, userId], function (err, result) {
      if (err) {
        callback(err, null);
      } else {
        // Assuming images are being managed separately
        callback(null, result);
      }
    });
  },

  deleteComments: function (postId, callback) {
    const query = "DELETE FROM Comments WHERE PostID = ?";
    db.query(query, [postId], function (err, result) {
      callback(err, result);
    });
  },

  // Xóa bài viết
  deletePost: function (postId, userId, callback) {
    const query = "DELETE FROM Posts WHERE PostID = ? AND UserID = ?";
    db.query(query, [postId, userId], function (err, result) {
      callback(err, result);
    });
  },

  deleteMessagesRelatedToPost: function (postId, callback) {
    const query = "DELETE FROM Message WHERE PostID = ?";
    db.query(query, [postId], function (err, result) {
      callback(err, result);
    });
  },

  deleteItinerariesRelatedToPost: function (postId, callback) {
    const query = "DELETE FROM Itineraries WHERE PostID = ?";
    db.query(query, [postId], function (err, result) {
      callback(err, result);
    });
  },

  deletePostImages: function (postId, callback) {
    const query = "DELETE FROM PostImages WHERE PostID = ?";
    db.query(query, [postId], function (err, result) {
      callback(err, result);
    });
  },

  deleteRelatedTours: function (postId, callback) {
    const findTourIds = "SELECT TourID FROM Itineraries WHERE PostID = ?";
    db.query(findTourIds, [postId], function (err, results) {
      if (err) {
        callback(err, null);
      } else {
        const tourIds = results.map(row => row.TourID);
        if (tourIds.length > 0) {
          const deleteItineraries = "DELETE FROM Itineraries WHERE TourID IN (?)";
          db.query(deleteItineraries, [tourIds], function (err, result) {
            if (err) {
              callback(err, null);
            } else {
              const deleteTours = "DELETE FROM Tours WHERE TourID IN (?)";
              db.query(deleteTours, [tourIds], function (err, result) {
                callback(err, result);
              });
            }
          });
        } else {
          callback(null, { message: "No tours or itineraries to delete" });
        }
      }
    });
  },

  getLatestPosts: function (callback) {
    const query = `
    SELECT p.PostID, p.UserID, p.PostTitle, p.PostContent, p.PostType, p.CreateAt, p.UpdateAt,
    u.Name, u.ProfilePicture, PostImages.ImageURL
FROM Posts p
JOIN Users u ON p.UserID = u.UserID
LEFT JOIN PostImages ON p.PostID = PostImages.PostID
ORDER BY p.CreateAt DESC LIMIT 21;
    `;
    db.query(query, function (err, results) {
      callback(err, results);
    });
  },



};


const PostImage = {
  insert: function (postId, imageURLs, callback) {
    const query = "INSERT INTO PostImages (PostID, ImageURL) VALUES ?";
    const values = imageURLs.map(imageURL => [postId, imageURL]);
    db.query(query, [values], callback);
  }
};

module.exports = { Post, PostImage };
