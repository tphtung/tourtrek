// Toggle forms for adding new travel history and reviews
$('.add-new-travel').click(function () {
    $('.add-travel-form').toggleClass('form-hidden');
});
$('.add-new-review').click(function () {
    $('.add-review-form').toggleClass('form-hidden');
});
// Back button to hide forms
$('.back-icon').click(function () {
    $(this).parent().addClass('form-hidden');
});

function toggleModal(show) {
    if (show) {
        $('.modal-backdrop, .modal-content').fadeIn();
    } else {
        $('.modal-backdrop, .modal-content').fadeOut();
    }
}

$('.btn-upgrade').click(function () {
    toggleModal(true);
});

$(document).ready(function () {
    $('#upgradeForm').on('submit', function (e) {
        console.log("Form submitting");
        e.preventDefault();

        // Lấy dữ liệu từ form
        var formData = $(this).serialize();

        // Gửi request POST đến server
        $.post('/guide/submit-upgrade', formData)
            .done(function (response) {
                if (response.success) {
                    alert(response.message); // Thông báo cho người dùng
                } else {
                    alert('Có lỗi xảy ra: ' + response.message);
                }
            })
            .fail(function () {
                alert('Có lỗi xảy ra khi gửi yêu cầu.');
            });
    });
    toggleModal(false);
});


$(document).ready(function () {
    // Mảng các tour
    var tours = [
        { id: 1, name: 'Tour 1: Chuyến đi Đà Nẵng', description: 'Khám phá Đà Nẵng', location: 'Đà Nẵng', startDate: '2024-01-01', endDate: '2024-01-03', cost: 200 },
        { id: 2, name: 'Tour 2: Khám phá Hội An cổ kính', description: 'Trải nghiệm Hội An', location: 'Hội An', startDate: '2024-02-15', endDate: '2024-02-17', cost: 150 },
        { id: 3, name: 'Tour 3: Dạo quanh Bà Nà Hills', description: 'Tham quan Bà Nà Hills', location: 'Bà Nà Hills', startDate: '2024-03-20', endDate: '2024-03-22', cost: 250 }
    ];

    console.log("Document is ready, and script is loaded.");

    $('.list-group-item').on('click', function() {
        console.log("Item clicked");
        var tourId = $(this).data('tourid');
        var tour = tours.find(t => t.id === tourId);
        if (tour) {
            $('#tourModal .modal-title').text(tour.name);
            $('#tourModal .modal-body').html(`
                <p><strong>Mô tả:</strong> ${tour.description}</p>
                <p><strong>Vị trí:</strong> ${tour.location}</p>
                <p><strong>Ngày bắt đầu:</strong> ${tour.startDate}</p>
                <p><strong>Ngày kết thúc:</strong> ${tour.endDate}</p>
                <p><strong>Chi phí:</strong> $${tour.cost}</p>
            `);
            $('#tourModal').modal('show');
        } else {
            console.error("Tour not found with the given ID.");
        }
    });
});
