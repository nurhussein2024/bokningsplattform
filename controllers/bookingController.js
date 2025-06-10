const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Skapa en ny bokning
const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera om rummet är tillgängligt (inga överlappande bokningar)
    const existingBooking = await Booking.findOne({
      room: roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Skapa bokningen
    const newBooking = new Booking({
      room: roomId,
      user: userId,
      startTime,
      endTime
    });

    await newBooking.save();

    res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    console.error('Fel vid skapande av bokning:', error);
    res.status(500).json({ message: 'Serverfel vid skapande av bokning', error: error.message });
  }
};

// Hämta alla bokningar för användaren eller alla bokningar för admin
const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const bookings = role === 'Admin'
      ? await Booking.find().populate('room user')
      : await Booking.find({ user: userId }).populate('room');

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fel vid hämtning av bokningar:', error);
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

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Bokning inte funnen' });
    }

    if (booking.user.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ändra denna bokning' });
    }

    const existingBooking = await Booking.findOne({
      room: booking.room,
      _id: { $ne: id }, // Undanta nuvarande bokning
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    console.error('Fel vid uppdatering:', error);
    res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

// Ta bort en bokning
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const role = req.user.role;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Bokning inte funnen' });
    }

    if (booking.user.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ta bort denna bokning' });
    }

    await booking.remove();

    res.status(200).json({ message: 'Bokning borttagen' });
  } catch (error) {
    console.error('Fel vid borttagning:', error);
    res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};
