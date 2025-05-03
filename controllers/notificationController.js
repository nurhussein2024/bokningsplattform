const io = require('socket.io-client');
const Booking = require('../models/Booking');

// Skicka notifiering till alla användare när en bokning sker
const sendNotification = (message) => {
  // Sänder ett meddelande till alla anslutna användare via WebSocket
  io.emit('bookingNotification', message);  // Meddelandet som skickas till alla anslutna användare
};

// Skapa en ny bokning och skicka notifiering
const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Kontrollera om rummet är bokat för samma tid
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Rummet är redan bokat för den här tiden' });
    }

    // Skapa en ny bokning
    const newBooking = new Booking({ roomId, userId, startTime, endTime });
    await newBooking.save();

    // Skicka notifiering till alla användare om den nya bokningen
    sendNotification(`Ny bokning skapad för rum ${newBooking.roomId} från ${startTime} till ${endTime}`);

    res.status(201).json({ message: 'Bokning skapad', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid skapande av bokning' });
  }
};
