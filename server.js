// server.js

// Ladda miljövariabler från .env-filen
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // 📁 För att hantera filsökvägar

const bookingRoutes = require('./routes/bookingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes'); // Lägg till autentisering rutter
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Tillåt förfrågningar från andra domäner
app.use(cors());
app.use(express.json());

// Servera statiska filer från mappen "public"
app.use(express.static(path.join(__dirname, 'public')));

// Anslut till MongoDB-databasen
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ansluten till databasen'))
  .catch((error) => console.log('❌ Fel vid databasanslutning:', error));

// Hantera WebSocket-anslutningar
io.on('connection', (socket) => {
  console.log('🔌 Användare ansluten:', socket.id);

  // När användaren kopplas från
  socket.on('disconnect', () => {
    console.log('❎ Användare frånkopplad:', socket.id);
  });
});

// API-rutter
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);
app.use('/api/auth', authRoutes); // Rutt för inloggning/registrering

// Starta servern
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Hej Nur hur mår du idag! Servern körs på port ${PORT}`);
});
