$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip(); // Khởi tạo tooltips
    // Thêm hiệu ứng jQuery tùy chỉnh nếu cần
});

$(document).ready(function () {
    $('.navbar-toggler').click(function () {
        $('.collapse').collapse('toggle');
    });
    $('[data-toggle="tooltip"]').tooltip(); // Khởi tạo tooltips
    // Hiệu ứng jQuery tùy chỉnh
});


$(document).ready(function () {
    // Giả sử 'isLoggedIn' là biến kiểm tra trạng thái đăng nhập của người dùng
    var isLoggedIn = false; // Thay đổi giá trị này dựa vào trạng thái đăng nhập của người dùng thực tế

    if (isLoggedIn) {
        $("#userIcon").hide(); // Ẩn icon người dùng nếu đã đăng nhập
        $("#userAvatar").show(); // Hiển thị avatar người dùng nếu đã đăng nhập
    } else {
        $("#userIcon").show(); // Hiển thị icon người dùng nếu chưa đăng nhập
        $("#userAvatar").hide(); // Ẩn avatar người dùng nếu chưa đăng nhập
    }
});
