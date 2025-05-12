const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// 📌 POST /api/auth/register – Skapa ett nytt användarkonto
router.post('/register', register);

// 📌 POST /api/auth/login – Autentisera en användare och returnera JWT
router.post('/login', login);

module.exports = router;
