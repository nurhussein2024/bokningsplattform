// server.js

// Ladda miljövariabler från .env
require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const bookingRoutes = require('./routes/bookingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Tillåter förfrågningar från alla ursprung (kan justeras vid behov)
    methods: ['GET', 'POST']
  }
});

// Middleware för att hantera CORS och JSON-förfrågningar
app.use(cors());
app.use(express.json());

// Servera statiska filer från 'public' mappen
app.use(express.static(path.join(__dirname, 'public')));

// Anslut till MongoDB Atlas utan de föråldrade alternativen
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ansluten till MongoDB Atlas')) // Bekräfta att anslutningen lyckades
  .catch((error) => console.error('❌ Fel vid anslutning till MongoDB Atlas:', error)); // Hantera fel vid anslutning

// Hantera WebSocket-anslutningar
io.on('connection', (socket) => {
  console.log('🔌 Användare ansluten:', socket.id); // Logga när en användare ansluter

  socket.on('disconnect', () => {
    console.log('❎ Användare frånkopplad:', socket.id); // Logga när en användare frånkopplas
  });
});

// Registrera API-rutter för bokningar, rum och autentisering
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);
app.use('/api/auth', authRoutes);

// Starta servern på den angivna porten eller port 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servern körs på port ${PORT}`); // Bekräfta att servern är igång
});
