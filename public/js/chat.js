$(document).ready(function () {
    var socket = io();

    // Kiểm tra khi có kết nối Socket.IO được thiết lập
    socket.on('connect', function () {
        console.log('Connected to Socket.IO server');
        // Gửi userId để đăng ký socket.id tương ứng
        socket.emit('register', user.UserID.toString());
        socket.emit('load old messages', { postId: postId, senderId: user.UserID.toString(), receiverId: receiverId.toString() });
    });

    socket.on('old messages', function (messages) {
        if (messages.length === 0) {
            console.log('Không có tin nhắn cũ để hiển thị.');
        }
        messages.forEach(function (msg) {
            appendMessage(msg);
        });
        $('#messageHistory').scrollTop($('#messageHistory')[0].scrollHeight);
    });

    $('#sendButton').click(function () {
        console.log('nút gửi được nhấn');
        var messageContent = $('#messageInput').val();
        if (messageContent) {
            var messageData = {
                senderId: user.UserID.toString(),
                receiverId: receiverId.toString(),
                content: messageContent,
                postId: postId.toString()
            };
            socket.emit('chat message', messageData);
            $('#messageInput').val('');
        }
    });

    // Nhận tin nhắn và thêm vào lịch sử chat
    // Đảm bảo rằng bạn đã lấy user.UserID, user.ProfilePicture, và user.Name từ server
    // Đoạn mã jQuery trong chat.js
    socket.on('chat message', function (msg) {
        console.log("Received message data:", msg);
        if (!msg || typeof msg !== 'object' || Object.keys(msg).length === 0) {
            console.log("No data received or data format is incorrect.");
            return;
        }

        var profilePictureUrl = msg.ProfilePicture || '/public/images/user_1144760.png';
        var senderName = msg.Name || 'Unknown';
        var messageContent = msg.Content || '';
        var messageTime = msg.CreateAt ? new Date(msg.CreateAt).toLocaleTimeString() : 'Unknown time';

        var messageElement = $('<div class="message ' + (msg.SenderID === user.UserID ? 'sent' : 'received') + '">' +
            '<img src="' + profilePictureUrl + '" alt="Avatar" class="avatar">' +
            '<div class="message-info">' +
            '<div class="sender-name">' + senderName + '</div>' +
            '<div class="message-content">' + messageContent + '</div>' +
            '<div class="message-time">' + messageTime + '</div>' +
            '</div>' +
            '</div>');

        $('#messageHistory').append(messageElement);
        $('#messageHistory').scrollTop($('#messageHistory')[0].scrollHeight);

    });

    function appendMessage(msg) {
        var profilePictureUrl = msg.ProfilePicture || '/public/images/user_1144760.png';
        var senderName = msg.Name || 'Unknown';
        var messageContent = msg.Content || '';
        var messageTime = msg.CreateAt ? new Date(msg.CreateAt).toLocaleTimeString() : 'Unknown time';
        var messageElement = $('<div class="message ' + (msg.SenderID === user.UserID ? 'sent' : 'received') + '">' +
            '<img src="' + profilePictureUrl + '" alt="Avatar" class="avatar">' +
            '<div class="message-info">' +
            '<div class="sender-name">' + senderName + '</div>' +
            '<div class="message-content">' + messageContent + '</div>' +
            '<div class="message-time">' + messageTime + '</div>' +
            '</div>' +
            '</div>');
        $('#messageHistory').append(messageElement);
    }

    $('#updateTour').click(function () {
        var tourData = {
            senderId: user.UserID, // Giả định user.UserID là ID của người gửi
            receiverId: receiverId, // Đã lấy từ script tag phía trên
            tourName: $('#tourName').val(),
            description: $('#description').val(),
            location: $('#location').val(),
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val(),
            // duration: $('#duration').val(),
            cost: $('#cost').val()
        };
        console.log('Sending tour data:', tourData); 
        socket.emit('update tour', tourData); // Gửi dữ liệu tour đã cập nhật lên server
    });


    // Xử lý dữ liệu tour cập nhật nhận về từ server
    socket.on('tour updated', function (tourData) {
        console.log('Received updated tour data:', tourData);
        $('#tourName').val(tourData.tourName);
        $('#description').val(tourData.description);
        $('#location').val(tourData.location);
        // $('#duration').val(tourData.duration);
        $('#startDate').val(tourData.startDate);
        $('#endDate').val(tourData.endDate);
        $('#cost').val(tourData.cost);
    });

    $('#confirmTour').click(function () {
        // Điền dữ liệu vào modal
        $('#modalTourName').text($('#tourName').val());
        $('#modalDescription').text($('#description').val());
        $('#modalLocation').text($('#location').val());
        // $('#modalDuration').text($('#duration').val());
        $('#modalStartDate').text($('#startDate').val());
        $('#modalEndDate').text($('#endDate').val());
        $('#modalCost').text($('#cost').val());

        // Hiển thị modal
        $('#confirmModal').modal('show');
    });

    
    $('#finalConfirm').click(function () {
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        
        // Kiểm tra định dạng ngày tháng
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            alert("Vui lòng nhập ngày tháng hợp lệ.");
            return;
        }
    
        // Kiểm tra chi phí không vượt quá giới hạn
        var cost = parseFloat($('#modalCost').text().replace('$', ''));
        if (cost > 10000000) { // Giả sử giới hạn là 10 triệu
            alert("Chi phí không được vượt quá 10 triệu.");
            return;
        }
    
        var tourDetails = {
            postId: postId,  
            name: $('#modalTourName').text(),
            description: $('#modalDescription').text(),
            location: $('#modalLocation').text(),
            startDate: startDate,
            endDate: endDate,
            cost: cost,
            duration: '1'
        };
    
        console.log('Tour details:', tourDetails);
        socket.emit('finalConfirm', tourDetails, user.UserID, receiverId);
    });
    
    function isValidDate(dateStr) {
        var date = new Date(dateStr);
        return date.toString() !== 'Invalid Date';
    }

    // Handling notifications
    socket.on('error', function (data) {
        displayModalNotification('Error', data.message);
    });

    socket.on('success', function (data) {
        displayModalNotification('Success', data.message);
    });

    socket.on('confirmation', function (data) {
        displayToastNotification(data.message);
    });

    function displayModalNotification(title, message) {
        $('#notificationModalLabel').text(title);
        $('#notificationModal .modal-body').text(message);
        $('#notificationModal').modal('show');
    }

    function displayToastNotification(message) {
        var toastHTML = '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">' +
            '<div class="toast-header">' +
            '<strong class="mr-auto">Thông báo</strong>' +
            '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="toast-body">' + message + '</div>' +
            '</div>';
        $('.toast-container').append(toastHTML);
        $('.toast').toast('show');
    }
});

function fetchItineraryDetails(itineraryId) {
    fetch(`/api/itineraries/details/${itineraryId}`)
        .then(response => response.json())
        .then(data => {
            const modal = document.getElementById('scheduleDetailsModal');
            modal.querySelector('.modal-title').textContent = 'Chi Tiết Lịch Trình';
            const listGroup = modal.querySelector('.list-group');
            listGroup.innerHTML = `
                <div class="list-group-item">${data.User1Name} và ${data.User2Name}</div>
                <div class="list-group-item">${data.TourName}</div>
            `;
            listGroup.addEventListener('click', () => {
                alert(`Thông tin đầy đủ: ${JSON.stringify(data)}`); // Hoặc hiển thị trong một form chi tiết
            });
            toggleModal('scheduleDetailsModal', true);
        })
        .catch(error => {
            console.error('Fetch itinerary details error:', error);
            alert('Lỗi khi lấy thông tin lịch trình: ' + error.message);
        });
}

document.querySelectorAll('.btn-modal').forEach(button => {
    button.addEventListener('click', function () {
        const targetModal = this.getAttribute('data-target').replace('#', '');
        const itineraryId = this.getAttribute('data-id'); // Giả sử bạn đã thêm attribute này
        if (targetModal === 'scheduleDetailsModal') {
            fetchItineraryDetails(itineraryId);
        } else {
            toggleModal(targetModal, true);
        }
    });
});

