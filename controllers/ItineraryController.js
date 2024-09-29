const Itinerary = require('../models/Itinerary');
const Tour = require('../models/Tour');

exports.finalConfirm = function (socket, tourDetails, senderId, receiverId) {
    Itinerary.findOrCreateItinerary(tourDetails, senderId, receiverId, (err, itinerary) => {
        if (err) {
            socket.emit('error', { message: 'Lỗi cơ sở dữ liệu' });
            return;
        }
        
        Itinerary.updateConfirmation(itinerary.ItineraryID, senderId, (updateErr) => {
            if (updateErr) {
                socket.emit('error', { message: 'Cập nhật xác nhận thất bại' });
                return;
            }
            Itinerary.checkAndUpdateStatus(itinerary.ItineraryID, (checkErr, status) => {
                if (checkErr) {
                    socket.emit('error', { message: 'Không thể hoàn tất xác nhận' });
                    return;
                }
                if (status === 'completed') {
                    Tour.save(tourDetails, (saveErr, newTourId) => {
                        if (saveErr) {
                            console.error("Error saving tour:", saveErr);
                            socket.emit('error', { message: 'Không thể lưu tour' });
                            return;
                        }
                        Itinerary.updateTourId(itinerary.ItineraryID, newTourId, (updateTourErr) => {
                            if (updateTourErr) {
                                socket.emit('error', { message: 'Không thể cập nhật Itinerary với TourID mới' });
                                return;
                            }
                            socket.emit('success', { message: 'Tour đã được xác nhận và lưu với TourID mới' });
                        });
                    });
                } else {
                    socket.emit('confirmation', { message: 'Đang chờ xác nhận từ người dùng khác' });
                }
            });
        });
    });
};

exports.getItineraries = function(req, res) {
    console.log("Fetching all itineraries...");
    Itinerary.getAllDetails(function(err, results) {
        if (err) {
            console.error("Error fetching itineraries: ", err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
};

exports.getItineraryById = function(req, res) {
    const { id } = req.params;
    Itinerary.getDetailsById(id, function(err, result) {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(result);
        }
    });
};
