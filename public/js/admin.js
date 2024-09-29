let currentUserId = null;

function showDetails(userId) {
    currentUserId = userId;
    fetch(`/upgrade-requests/details/${userId}`)
        .then(response => {
            if (!response.ok) {
                // Nếu response không thành công (ví dụ, 404, 500, v.v.), ném một lỗi mới
                throw new Error(`Network response was not ok, status: ${response.status}`);
            }
            // Kiểm tra loại nội dung trả về để đảm bảo đó là JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("Response from server was not in JSON format.");
            }
            // Parse response body text as JSON
            return response.json();
        })
        .then(data => {
            // Xử lý dữ liệu JSON ở đây
            // Dữ liệu được giả định là một mảng các đối tượng. Nếu không phải, bạn cần điều chỉnh mã tương ứng.
            if (Array.isArray(data) && data.length > 0) {
                const detail = data[0];
                document.getElementById('approveExpertise').textContent = detail.Expertise;
                document.getElementById('approveExperience').textContent = detail.Experience;
                document.getElementById('approveGender').textContent = detail.Gender;
                document.getElementById('approveBirthdate').textContent = detail.Birthdate.slice(0, 10);
                document.getElementById('approveContactNumber').textContent = detail.ContactNumber;
                document.getElementById('approveLanguages').textContent = detail.Languages;
                document.getElementById('approveCertifications').textContent = detail.Certifications;
                document.getElementById('approveIntroduction').textContent = detail.Introduction;

                // Chuyển hiển thị từ bảng chi tiết sang form chi tiết
                document.getElementById('detailsTable').style.display = 'none';
                document.getElementById('approvalForm').style.display = 'block';
            } else {
                // Xử lý trường hợp dữ liệu trả về không phải mảng hoặc mảng trống
                throw new Error("Data from server was in an unexpected format.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Lỗi khi lấy thông tin chi tiết: ${error.message}`);
        });
}

function approveRequest() {
    if (!currentUserId) {
        alert('Không có thông tin người dùng.');
        return;
    }

    fetch(`/upgrade-requests/approve/${currentUserId}`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể xác nhận yêu cầu: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Yêu cầu nâng cấp tài khoản đã được xác nhận.');
            // Cập nhật UI hoặc làm mới trang nếu cần
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Lỗi khi xác nhận yêu cầu: ${error.message}`);
        });
}

function rejectRequest() {
    if (!currentUserId) {
        alert('Không có thông tin người dùng.');
        return;
    }

    fetch(`/upgrade-requests/reject/${currentUserId}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể hủy bỏ yêu cầu: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Yêu cầu nâng cấp tài khoản đã bị hủy bỏ.');
            // Cập nhật UI hoặc làm mới trang nếu cần
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Lỗi khi hủy bỏ yêu cầu: ${error.message}`);
        });
}


// Hàm toggleModal và các hàm khác giữ nguyên

function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    const backdrop = document.querySelector('.modal-backdrop');
    if (show) {
        modal.style.display = 'block';
        backdrop.style.display = 'block';
    } else {
        modal.style.display = 'none';
        backdrop.style.display = 'none';
    }
}

// function submitApproval() {
//     console.log("Yêu cầu nâng cấp tài khoản đã được gửi.");
//     toggleModal('approveModal', false);
//     document.getElementById('detailsTable').style.display = 'block';
//     document.getElementById('approvalForm').style.display = 'none';
// }

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-modal').forEach(button => {
        button.addEventListener('click', function () {
            const targetModal = this.getAttribute('data-target').replace('#', '');
            toggleModal(targetModal, true);
        });
    });
    // This code block can be removed since showDetails is now globally available
    document.querySelectorAll('.modal-content .btn-back').forEach(button => {
        button.addEventListener('click', function () {
            const modalToClose = this.closest('.modal-content').id;
            toggleModal(modalToClose, false);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const showUserDetailsBtn = document.getElementById('showUserDetailsBtn');
    if (showUserDetailsBtn) {
        showUserDetailsBtn.addEventListener('click', fetchUserDetails);
    } else {
        console.log('Không tìm thấy nút hiển thị chi tiết người dùng');
    }
});

function fetchUserDetails() {
    console.log("fetchUserDetails is called");
    fetch('/users/details')
        .then(response => response.json())
        .then(data => {
            const userDetailsList = document.getElementById('userDetailsList');
            userDetailsList.innerHTML = data.map(user => `
                <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${user.Name}</h5>
                        <small>Vai Trò: ${user.Role}</small>
                    </div>
                    <p class="mb-1">Email: ${user.Email}</p>
                    <small>Ngày tạo: ${new Date(user.CreateAt).toLocaleString()}</small>
                    <button type="button" class="btn btn-secondary" onclick="toggleModal(false)">Xóa</button>
                </a>
            `).join('');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Lỗi khi lấy thông tin người dùng: ' + error.message);
        });
}
// File: public/js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    fetchUserCount();

    // Khởi tạo sự kiện click cho nút xem chi tiết người dùng nếu bạn chưa làm
});

function fetchUserCount() {
    fetch('/users/count')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const userCountElement = document.querySelector('.card-text-user');
            if (userCountElement) {
                userCountElement.textContent = `Tổng số người dùng: ${data.userCount}`;
            }
        })
        .catch(error => console.error('Error:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    const showScheduleDetailsBtn = document.getElementById('showScheduleDetailsBtn');
    if (showScheduleDetailsBtn) {
        showScheduleDetailsBtn.addEventListener('click', function () {
            fetch('/api/itineraries/details')
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    const itineraryList = document.getElementById('itineraryList');
                    itineraryList.innerHTML = '';
                    data.forEach(itinerary => {
                        const item = document.createElement('a');
                        item.classList.add('list-group-item', 'list-group-item-action');
                        item.href = '#';
                        item.innerHTML = `${itinerary.User1Name} và ${itinerary.User2Name} - ${itinerary.TourName}`;
                        item.onclick = function () { displayItineraryDetails(itinerary.ItineraryID); };
                        itineraryList.appendChild(item);
                    });
                    $('#scheduleDetailsModal').modal('show');
                })
                .catch(error => console.error('Error loading itineraries:', error));
        });
    }
});


function displayItineraryDetails(itineraryId) {
    fetch(`/api/itineraries/details/${itineraryId}`)
        .then(response => response.json())
        .then(data => {
            alert(`Details: ${JSON.stringify(data)}`); // Replace this with a more detailed display logic
        })
        .catch(error => console.error('Error fetching itinerary details:', error));
}
