const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 📌 Skapar en bokning
const createBooking = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Obehörig begäran: ingen användare identifierad' });
    }

    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera att rummet finns
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Rummet hittades inte' });
    }

    // Kontrollera om rummet redan är bokat
    const overlappingBooking = await Booking.findOne({
      roomId,
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Rummet är upptaget under vald tid' });
    }

    // Skapa ny bokning
    const newBooking = new Booking({
      roomId,
      userId,
      startTime,
      endTime
    });

    await newBooking.save();

    return res.status(201).json({
      message: 'Bokning skapad',
      booking: newBooking
    });

  } catch (error) {
    console.error('❌ Fel i createBooking:', error);
    return res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

// 📌 Hämtar alla bokningar för admin eller användarens egna bokningar
const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const query = role === 'Admin' ? {} : { userId };
    const bookings = await Booking.find(query).populate('roomId').populate('userId');

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('❌ Fel i getBookings:', error);
    return res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

// 📌 Uppdaterar en befintlig bokning
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

    return res.status(200).json({ message: 'Bokning uppdaterad', booking });

  } catch (error) {
    console.error('❌ Fel i updateBooking:', error);
    return res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// 📌 Raderar en bokning
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

    return res.status(200).json({ message: 'Bokning borttagen' });

  } catch (error) {
    console.error('❌ Fel i deleteBooking:', error);
    return res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
