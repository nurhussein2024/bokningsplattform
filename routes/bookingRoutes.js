const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/bookings – Skapa en ny bokning
router.post('/', authenticateToken, createBooking);

// GET /api/bookings – Hämta bokningar (Användare ser sina, Admin ser alla)
router.get('/', authenticateToken, getBookings);

// PUT /api/bookings/:id – Uppdatera en bokning
router.put('/:id', authenticateToken, updateBooking);

// DELETE /api/bookings/:id – Ta bort en bokning
router.delete('/:id', authenticateToken, deleteBooking);

module.exports = router;
