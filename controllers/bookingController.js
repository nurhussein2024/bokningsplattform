const Booking = require('../models/Booking');
const Room = require('../models/Room');
const mongoose = require('mongoose');

// 📌 Skapa en ny bokning
const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Obehörig: ingen användare' });
    }

    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera att roomId är giltigt
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Ogiltigt Room ID' });
    }

    // Kontrollera att rummet finns
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Rummet finns inte' });
    }

    // Kontrollera överlappande bokningar
    const overlappingBooking = await Booking.findOne({
      roomId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Skapa bokning
    const newBooking = new Booking({ roomId, userId, startTime, endTime });
    await newBooking.save();

    const io = req.app.get('io');
    io.emit('bookingCreated', newBooking);

    return res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    console.error('🔥 Bokningsfel:', error);
    return res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

// 📌 Hämta bokningar
const getBookings = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const query = role === 'Admin' ? {} : { userId };

    const bookings = await Booking.find(query)
      .populate('roomId')
      .populate('userId');

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('🔥 Fel vid hämtning:', error);
    return res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

// 📌 Uppdatera bokning
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Bokning hittades inte' });
    }

    if (req.user.role !== 'Admin' && booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Ingen behörighet att uppdatera denna bokning' });
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    const io = req.app.get('io');
    io.emit('bookingUpdated', booking);

    return res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    console.error('🔥 Fel vid uppdatering:', error);
    return res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// 📌 Ta bort bokning
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Bokning hittades inte' });
    }

    if (req.user.role !== 'Admin' && booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Ingen behörighet att ta bort denna bokning' });
    }

    await Booking.findByIdAndDelete(id);

    const io = req.app.get('io');
    io.emit('bookingDeleted', { id });

    return res.status(200).json({ message: 'Bokning borttagen' });
  } catch (error) {
    console.error('🔥 Fel vid borttagning:', error);
    return res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
