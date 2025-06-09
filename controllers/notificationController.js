const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 📌 Skapa en ny bokning och skicka notis via socket.io-servern
const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera att rummet finns
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Rummet hittades inte' });
    }

    // Kontrollera om tiden är ledig
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Skapa bokningen
    const newBooking = new Booking({ roomId, userId, startTime, endTime });
    await newBooking.save();

    // Skicka realtidsnotifiering till alla via socket.io
    const io = req.app.get('io');
    if (io) {
      io.emit('bookingNotification', {
        roomId,
        userId,
        message: `Ny bokning skapad: ${room.name} (${startTime} - ${endTime})`
      });
    }

    res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

module.exports = { createBooking };
