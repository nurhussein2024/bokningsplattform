const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register – Registrera användare
router.post('/register', register);

// POST /api/auth/login – Logga in
router.post('/login', login);

module.exports = router;
