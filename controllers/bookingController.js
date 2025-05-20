const Booking = require('../models/Booking');
const Room = require('../models/Room');

// 📌 Skapa en ny bokning
const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    const newBooking = new Booking({ roomId, userId, startTime, endTime });
    await newBooking.save();

    // ⏱️ Real-time notification
    const io = req.app.get('io');
    io.emit('bookingCreated', newBooking);

    res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};

// 📌 Hämta bokningar
const getBookings = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const bookings = role === 'Admin'
      ? await Booking.find().populate('roomId')
      : await Booking.find({ userId }).populate('roomId');

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

    if (booking.userId.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ändra denna bokning' });
    }

    const conflictingBooking = await Booking.findOne({
      _id: { $ne: booking._id },
      roomId: booking.roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    // ⏱️ Real-time notification
    const io = req.app.get('io');
    io.emit('bookingUpdated', booking);

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

    if (booking.userId.toString() !== userId && role !== 'Admin') {
      return res.status(403).json({ message: 'Du har inte rätt att ta bort denna bokning' });
    }

    await booking.deleteOne();

    // ⏱️ Real-time notification
    const io = req.app.get('io');
    io.emit('bookingDeleted', id);

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
