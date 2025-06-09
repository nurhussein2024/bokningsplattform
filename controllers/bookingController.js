const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 📌 Skapa en ny bokning och spara den i databasen
const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { roomId, startTime, endTime } = req.body;

    if (!roomId || !startTime || !endTime) {
      return res.status(400).json({ message: 'roomId, startTime och endTime krävs' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Rummet hittades inte' });
    }

    const overlapping = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Rummet är redan bokat för denna tid' });
    }

    const booking = new Booking({
      roomId,
      userId,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    });

    await booking.save();

    return res.status(201).json({ message: 'Bokning skapad', booking });
  } catch (error) {
    console.error('Fel vid bokning:', error);
    return res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

// 📌 Hämta bokningar för inloggad användare eller admin
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
    console.error('Fel vid hämtning av bokningar:', error);
    return res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

// 📌 Uppdatera en befintlig bokning
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

    booking.startTime = new Date(startTime);
    booking.endTime = new Date(endTime);
    await booking.save();

    return res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    console.error('Fel vid uppdatering:', error);
    return res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// 📌 Radera en bokning
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
    console.error('Fel vid borttagning:', error);
    return res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

// 📌 Exportera alla funktioner
module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
