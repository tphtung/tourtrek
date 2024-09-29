$(document).ready(function () {
    // Giả sử bạn có một mảng các đối tượng tour được lấy từ server
    var tours = [
        { id: 1, name: 'Tour 1: Chuyến đi Đà Nẵng', description: 'Khám phá Đà Nẵng', location: 'Đà Nẵng', startDate: '2024-01-01', endDate: '2024-01-03', cost: 200 },
        { id: 2, name: 'Tour 2: Khám phá Hội An cổ kính', description: 'Trải nghiệm Hội An', location: 'Hội An', startDate: '2024-02-15', endDate: '2024-02-17', cost: 150 },
        { id: 3, name: 'Tour 3: Dạo quanh Bà Nà Hills', description: 'Tham quan Bà Nà Hills', location: 'Bà Nà Hills', startDate: '2024-03-20', endDate: '2024-03-22', cost: 250 },
        {
            id: 4, name: 'Tour 4: Du lịch Long An', description: 'Sáng: Xe và Hướng Dẫn Viên Công Ty Du Lịch Việt đón Quý khách tại điểm hẹn.Khởi hành đi Long An, trên đường Quý khách sẽ nghe thuyết minh về những địa danh nổi tiếng của vùng đất Long An như rượu đế Gò Đen, gạo nàng thơm Chợ Đào, Bến Lức, …Quý khách dừng chân dùng bữa sáng (chi phí tự túc) Đoàn ghé thăm Thiền Viện Trúc Lâm Chánh Giác – nằm sâu trong vùng trũng của xã Thanh Tân, Tân Phước Tiền Giang, được xem là một trong những thiền viện lớn nhất cả nước rộng hơn 30ha. Là công trình kiến trúc đầu tiên ở Việt Nam với 4 Thánh tích Phật giáo có nguồn gốc từ ấn Độ và Nepal với 25 hạng mục, đặc biệt là bức tượng Phật Thích Ca Mâu Ni được tạc bằng đá ngọc, trên tay cầm hoa sen, cao 4.5m, năng 30 tấn do các nghệ nhân Myanmar chế tác. Đến Làng Nổi Tân Lập – được xem là một trong những điểm du lịch sinh thái mới nhất tại Long An, với hệ thống rừng tràm nguyên sinh với những đầm hoa súng tạo nên phong cảnh tuyệt đẹp.Quý khách sẽ khám phá con đường bê tông xuyên rừng tràm, giữa những con đường là những đầm hoa súng, đầm sen khoe sắc, những bãi bèo tai chuột xanh mướt điểm xuyết đóa rong vàng li ti, thỉnh thoảng nghe âm thanh vui tai của tiếng chim hót đặc trưng của vùng này như cò, bìm bịp, cồng cộc,… Đặc biệt Quý khách còn có thể trải nghiệm ngắm nhìn toàn cảnh rừng tràm từ trên những đài quan sát trên cao phòng tầm mắt ra xa với bạt ngàn là màu xanh bao la hung vĩ. Trưa: Quý khách dùng bữa trưa với các đặc sản độc đáo của vùng nước nổi. Đoàn ngồi xuồng ba lá len lỏi vào rừng tràm, tận hưởng cảm giác lênh đênh trên sông nước, thưởng ngoạn không khí yên bình nơi đây. Đoàn khởi hành về TP.HCM, trên đường ghé Công Viên Kỳ Quan Thế Giới – được giới trẻ đặt cho là điểm “check-in vàng” vì ở tập trung những công trình kiến trúc nổi tiếng thế giới được thu nhỏ tinh xảo như thật.Quý khách sẽ có những trải nghiệm chụp hình các bức ảnh rất độc đáo tại đây. Đoàn khởi hành về TP.HCM.Kết thúc chuyến đi, chia tay đoàn và hẹn gặp lại Quý khách.', location: 'Làng Nổi Tân Lập ', startDate: '20 / 5 / 2024', endDate: '22 / 5 / 2024', cost: 1000000 }
    ];

    // Xử lý sự kiện khi nhấn vào một tour
    $('.list-group-item').click(function () {
        var tourId = $(this).data('tourid'); // Lấy ID tour từ attribute data-tourid
        var tour = tours.find(t => t.id === tourId); // Tìm tour trong mảng dữ liệu

        if (tour) {
            // Thiết lập nội dung modal
            $('#tourModal .modal-title').text(tour.name);
            $('#tourModal .modal-body').html(`
                <p><strong>Mô tả:</strong> ${tour.description}</p>
                <p><strong>Vị trí:</strong> ${tour.location}</p>
                <p><strong>Ngày bắt đầu:</strong> ${tour.startDate}</p>
                <p><strong>Ngày kết thúc:</strong> ${tour.endDate}</p>
                <p><strong>Chi phí:</strong> $${tour.cost}</p>
            `);

            // Hiển thị modal
            $('#tourModal').modal('show');
        }
    });
});
