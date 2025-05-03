const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Skapa en ny bokning
const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera om rummet är tillgängligt
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } } // Överlappande bokningar
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
    res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

// Hämta alla bokningar för användaren eller alla bokningar för admin
const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    // Hämta bokningar antingen för användaren eller alla om admin
    const bookings = role === 'Admin' 
      ? await Booking.find().populate('roomId') // Admin ser alla bokningar
      : await Booking.find({ userId }).populate('roomId'); // Användare ser endast sina bokningar

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

// Uppdatera en bokning
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    const userId = req.user.userId;
    const role = req.user.role;

    // Hämta bokningen
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Bokning inte funnen' });
    }

    // Kontrollera om användaren är bokningens skapare eller admin
    if (booking.userId.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ändra denna bokning' });
    }

    // Kontrollera om rummet är tillgängligt vid den nya tiden
    const existingBooking = await Booking.findOne({
      roomId: booking.roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Uppdatera bokningen
    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// Ta bort en bokning
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const role = req.user.role;

    // Hämta bokningen
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Bokning inte funnen' });
    }

    // Kontrollera om användaren är bokningens skapare eller admin
    if (booking.userId.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ta bort denna bokning' });
    }

    // Ta bort bokningen
    await booking.remove();

    res.status(200).json({ message: 'Bokning borttagen' });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
