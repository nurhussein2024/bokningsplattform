const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 📌 Endpoints för bokningar – alla skyddade
router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.put('/:id', authenticateToken, updateBooking);
router.delete('/:id', authenticateToken, deleteBooking);

module.exports = router;
