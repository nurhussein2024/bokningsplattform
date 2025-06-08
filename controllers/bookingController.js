const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');

//  Skapa en ny bokning
const createBooking = async (req, res) => {
  if (!req.user || !req.user.userId) {
    console.error("Missing user in request. JWT may be invalid or missing.");
    return res.status(401).json({ message: 'Obehörig begäran: ingen användare identifierad' });
  }

  const { roomId, startTime, endTime } = req.body;
  const userId = req.user.userId;

  try {
    // Kontrollera om det finns en överlappande bokning
    const existingBooking = await Booking.findOne({
      roomId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    const newBooking = new Booking({ roomId, userId, startTime, endTime });
    await newBooking.save();

    const io = req.app.get('io');
    io.emit('bookingCreated', newBooking);

    res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    console.error("Fel i createBooking:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

//  Hämta bokningar
const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    const query = role === 'Admin' ? {} : { userId };
    const bookings = await Booking.find(query)
      .populate('roomId')
      .populate('userId');

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error.message);
    res.status(500).json({ message: 'Serverfel vid hämtning av bokningar' });
  }
};

//  Uppdatera bokning
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
    io.emit('bookingUpdated', booking);

    res.status(200).json({ message: 'Bokning uppdaterad', booking });
  } catch (error) {
    console.error("Fel vid uppdatering av bokning:", error.message);
    res.status(500).json({ message: 'Serverfel vid uppdatering av bokning' });
  }
};

//  Ta bort bokning
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
    io.emit('bookingDeleted', { bookingId });

    res.status(200).json({ message: 'Bokning borttagen' });
  } catch (error) {
    console.error("Fel vid borttagning av bokning:", error.message);
    res.status(500).json({ message: 'Serverfel vid borttagning av bokning' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
};