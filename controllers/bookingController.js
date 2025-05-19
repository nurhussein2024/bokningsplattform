const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 📌 Skapa en ny bokning
const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera om rummet redan är bokat under samma tid
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Tid överlappar
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Skapa bokningen
    const newBooking = new Booking({ roomId, userId, startTime, endTime });
    await newBooking.save();

    res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

// 📌 Hämta bokningar – användare ser sina, admin ser alla
const getBookings = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const bookings = role === 'Admin'
      ? await Booking.find().populate('roomId') // Admin ser alla bokningar
      : await Booking.find({ userId }).populate('roomId'); // Vanlig användare ser sina bokningar

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

// 📌 Uppdatera en bokning
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    const { userId, role } = req.user;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Bokning inte funnen' });
    }

    // Endast ägare eller admin får uppdatera
    if (booking.userId.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ändra denna bokning' });
    }

    // Kontrollera om den nya tiden krockar med en annan bokning
    const conflictingBooking = await Booking.findOne({
      _id: { $ne: booking._id }, // Exkludera nuvarande bokning
      roomId: booking.roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Uppdatera tiden
    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// 📌 Ta bort en bokning
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Bokning inte funnen' });
    }

    // Endast ägare eller admin får ta bort
    if (booking.userId.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ta bort denna bokning' });
    }

    await booking.deleteOne(); // 💡 Bättre än .remove() som är föråldrat

    res.status(200).json({ message: 'Bokning borttagen' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
