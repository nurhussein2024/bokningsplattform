const express = require('express');
const router = express.Router();
const { createRoom, getAllRooms, updateRoom, deleteRoom } = require('../controllers/roomController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/roomMiddleware');

// POST /api/rooms – Skapa ett nytt rum (Endast admin)
router.post('/', authenticateToken, checkAdmin, createRoom);

// GET /api/rooms – Hämta alla rum
router.get('/', authenticateToken, getAllRooms);

// PUT /api/rooms/:id – Uppdatera rum (Endast admin)
router.put('/:id', authenticateToken, checkAdmin, updateRoom);

// DELETE /api/rooms/:id – Ta bort rum (Endast admin)
router.delete('/:id', authenticateToken, checkAdmin, deleteRoom);

module.exports = router;
