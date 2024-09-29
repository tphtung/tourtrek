const Guide = require('../models/Guide');

exports.submitUpgradeRequest = function (req, res) {
    // Giả định rằng bạn đã xác thực và có thông tin người dùng trong req.user
    const userID = req.user.UserID; // Lấy ID người dùng từ session hoặc JWT

    // Đầu tiên kiểm tra trạng thái nâng cấp của người dùng
    Guide.checkUpgradeStatus(userID, function (err, status) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Có lỗi khi kiểm tra trạng thái nâng cấp tài khoản.' });
        }

        // Nếu người dùng đã được nâng cấp
        if (status === 'approved') {
            return res.json({ success: false, message: 'Tài khoản của bạn đã được nâng cấp.' });
        } else {
            // Xây dựng đối tượng userData từ dữ liệu form
            const {expertise, experience, gender, birthdate, contactNumber, languages, certifications, introduction } = req.body;
            const userData = {
                userID,
                expertise,
                experience,
                gender,
                birthdate,
                contactNumber,
                languages,
                certifications,
                introduction
            };

            // Sử dụng model Guide để lưu thông tin hướng dẫn viên vào cơ sở dữ liệu
            Guide.createGuide(userData, function (err, guideResults) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Có lỗi khi lưu thông tin hướng dẫn viên.' });
                }

                // Tạo yêu cầu nâng cấp tài khoản
                Guide.createAccountUpgradeRequest(userID, function (err, requestResults) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Có lỗi khi tạo yêu cầu nâng cấp tài khoản.' });
                    }

                    // Nếu không có lỗi, gửi phản hồi thành công
                    res.json({ success: true, message: 'Yêu cầu nâng cấp tài khoản đã được gửi thành công.' });
                });
            });
        }
    });
};

exports.getGuideProfile = function(req, res) {
    const userID = req.params.UserID; // Ensure you're obtaining the userId correctly

    Guide.getGuideDetailsByUserId(userID, function(err, guideDetails) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Có lỗi khi lấy thông tin hướng dẫn viên.' });
        }
        console.log(guideDetails);
        if (guideDetails.length > 0) {
            // Make sure to pass an object named 'guide'
            res.render('guide', { guide: guideDetails[0], isOwnProfile: false }); // Assuming you want to pass the first result
        } else {
            res.status(404).send('Guide not found');
        }
    });
};

exports.getMyProfile = function(req, res) {
    const userID = req.user.UserID; // Lấy UserID từ thông tin người dùng đã đăng nhập
    Guide.getGuideDetailsByUserId(userID, function(err, guideDetails) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Có lỗi khi lấy thông tin hướng dẫn viên.' });
        }
        if (guideDetails.length > 0) {
            // Hiển thị trang hồ sơ với thông tin của người dùng hiện tại
            res.render('guide', { guide: guideDetails[0], isOwnProfile: true });
        } else {
            res.status(404).send('Hồ sơ không tìm thấy');
        }
    });
};

