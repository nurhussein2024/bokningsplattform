const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 📌 Skapa en ny bokning (förenklad version som alltid lyckas)
const createBooking = async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'Obehörig begäran: ingen användare identifierad' });
  }

  const { roomId, startTime, endTime } = req.body;
  const userId = req.user.userId;

  // Här simulerar vi en lyckad bokning utan att spara något i databasen
  return res.status(201).json({
    message: 'Bokning skapad',
    booking: {
      roomId,
      userId,
      startTime,
      endTime
    }
  });
};

// 📌 Hämta bokningar
const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const query = role === 'Admin' ? {} : { userId };
    const bookings = await Booking.find(query)
      .populate('roomId')
      .populate('userId');

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

// 📌 Uppdatera bokning
const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { startTime, endTime } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Bokning hittades inte' });
    }

    if (req.user.role !== 'Admin' && booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Du har inte behörighet att uppdatera denna bokning' });
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('bookingUpdated', booking);
    }

    return res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    return res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// 📌 Ta bort bokning
const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Bokning hittades inte' });
    }

    if (req.user.role !== 'Admin' && booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Du har inte behörighet att ta bort denna bokning' });
    }

    await Booking.findByIdAndDelete(bookingId);

    const io = req.app.get('io');
    if (io) {
      io.emit('bookingDeleted', { bookingId });
    }

    return res.status(200).json({ message: 'Bokning borttagen' });
  } catch (error) {
    return res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
