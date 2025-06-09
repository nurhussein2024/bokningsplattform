const express = require('express');
const router = express.Router();

// Importera funktioner från kontrollern
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

// Middleware för autentisering
const { authenticateToken } = require('../middleware/authMiddleware');

// 📌 Skapa en ny bokning – endast för inloggade användare
router.post('/', authenticateToken, createBooking);

// 📌 Hämta bokningar – användare får sina egna, admin får alla
router.get('/', authenticateToken, getBookings);

// 📌 Uppdatera en bokning – endast skaparen eller admin
router.put('/:id', authenticateToken, updateBooking);

// 📌 Radera en bokning – endast skaparen eller admin
router.delete('/:id', authenticateToken, deleteBooking);

// Exportera router
module.exports = router;
