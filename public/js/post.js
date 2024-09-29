$(document).ready(function () {
    $('.detail-btn').click(function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ a
        var $this = $(this);
        var $content = $this.prev('.card-text');

        if ($this.text() == 'Xem chi tiết') {
            $content.removeClass('text-truncate'); // Mở rộng nội dung
            $this.text('Thu gọn'); // Thay đổi văn bản của nút
        } else {
            $content.addClass('text-truncate'); // Thu gọn nội dung
            $this.text('Xem chi tiết'); // Thay đổi văn bản của nút
        }
    });
});

function filterPosts(category) {
    console.log('Filter posts by:', category);
    $('.post .card').each(function () {
        const postCategory = $(this).data('category');
        if (postCategory === category || category === 'all') {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}


$('#postImage').change(function () {
    var file = $(this)[0].files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        // You can add logic here to update the UI with the selected image
        console.log('Image uploaded:', reader.result);
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        // Reset or remove the image from the UI if needed
    }
});

// Tái sử dụng hàm này để tải bình luận một cách dễ dàng
function loadComments(postId) {
    $.get(`/post/comments/load/${postId}`, function (data) {
        $('#commentModal').find('.comments-section').html(data);
    }).fail(function () {
        console.error("Không thể tải bình luận cho postId: " + postId);
    });
}

$(document).ready(function() {
    // Khi nút đăng bình luận được nhấn
    $('#button-addon2').click(function () {
        const postId = $('#commentModal').data('postid');
        const content = $('.input-group input').val();
        if (postId && content.trim() !== '') {
            // Gửi bình luận mới đến server
            $.post('/post/comments', { userId: userId, postId: postId, content: content }, function (data) {
                // Tải lại các bình luận để hiển thị bình luận mới
                loadComments(postId);
                $('.input-group input').val(''); // Xóa trường nhập liệu sau khi gửi
            }).fail(function () {
                console.error("Lỗi khi đăng bình luận cho postId: " + postId);
            });
        } else {
            alert("Bạn cần nhập nội dung bình luận.");
        }
    });

    // Sự kiện khi modal bình luận được mở
    $('#commentModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var postId = button.data('postid'); // Extract info from data-* attributes
        $(this).data('postid', postId); // Store postId in modal data
        loadComments(postId); // Tải bình luận ngay khi modal mở
    });


    // $('.dropdown-toggle').click(function() {
    //     let postId = $(this).closest('.card').data('post-id');
    //     let userId = $(this).closest('.card').data('user-id');
    //     let currentUser = 1; // Thay đổi này để phù hợp với ID người dùng hiện tại

    //     let dropdownMenu = $(this).next('.dropdown-menu');
    //     if (userId === currentUser) {
    //         dropdownMenu.find('.edit-post').show();
    //         dropdownMenu.find('.delete-post').show();
    //         dropdownMenu.find('.report-post').hide();
    //     } else {
    //         dropdownMenu.find('.edit-post').hide();
    //         dropdownMenu.find('.delete-post').hide();
    //         dropdownMenu.find('.report-post').show();
    //     }
    // });

    $('#editPostModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var postId = button.data('post-id');
        var postTitle = button.data('post-title');
        var postContent = button.data('post-content');
        var postType = button.data('post-type');
    
        var modal = $(this);
        modal.find('#editPostID').val(postId);
        modal.find('#editPostTitle').val(postTitle);
        modal.find('#editPostContent').val(postContent);
        modal.find('#editPostType').val(postType);
    });

    $('#editPostForm').on('submit', function () {
        console.log('Form is being submitted');
        // Form sẽ được gửi đi tự động theo thuộc tính `action` và `method` của form
    });

    $('.delete-post').click(function(e) {
        e.preventDefault();
        var postId = $(this).data('post-id'); // Kiểm tra xem giá trị này có được lấy chính xác không
    
        if (!postId) {
            console.error('Post ID is undefined.');
            return; // Thoát khỏi hàm nếu không có ID
        }
    
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            $.ajax({
                url: '/post/delete/' + postId,
                type: 'DELETE',
                success: function(result) {
                    alert('Bài viết đã được xóa.');
                    window.location.reload(); // Tải lại trang
                },
                error: function(err) {
                    alert('Lỗi khi xóa bài viết.');
                }
            });
        }
    });   
});
