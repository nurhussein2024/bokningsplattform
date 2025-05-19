const express = require('express');
const router = express.Router();

// Importera controller-funktioner för bokningar
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

// Importera autentiseringsmiddleware
const { authenticateToken } = require('../middleware/authMiddleware');

// 📌 OBS! Du använder redan authenticateToken i server.js för denna rutt,
// så det är egentligen överflödigt här – men om du vill ha det här för tydlighet är det okej.

// Skapa en ny bokning – endast inloggade användare
router.post('/', authenticateToken, createBooking);

// Hämta bokningar – användare får sina, admin får alla
router.get('/', authenticateToken, getBookings);

// Uppdatera en bokning – endast inloggade användare
router.put('/:id', authenticateToken, updateBooking);

// Radera en bokning – endast inloggade användare
router.delete('/:id', authenticateToken, deleteBooking);

// Exportera routern
module.exports = router;
