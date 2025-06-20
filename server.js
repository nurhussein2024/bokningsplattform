// server.js

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Import routes and middleware
const bookingRoutes = require('./routes/bookingRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);

// Skapa en Socket.IO-instans med CORS-inställningar
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Spara io-instansen i app för att kunna använda den i controllers
app.set('io', io);

app.use(cors());
app.use(express.json());

// ✅ Nytt: Servera statiska filer från roten av projektet (t.ex. client.html)
app.use(express.static(__dirname));

// Servera statiska filer från /public (t.ex. bilder eller CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Anslut till MongoDB med konfiguration från .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ansluten till MongoDB Atlas'))
  .catch((error) => console.error('❌ Fel vid anslutning till MongoDB:', error));

// Hantera WebSocket-anslutningar
io.on('connection', (socket) => {
  console.log('🔌 Användare ansluten:', socket.id);

  socket.on('disconnect', () => {
    console.log('❎ Användare frånkopplad:', socket.id);
  });
});

// API-rutter
app.use('/api/auth', authRoutes); // Auth-rutter kräver ingen token
app.use('/api/bookings', authenticateToken, bookingRoutes); // Skyddade rutter
app.use('/api/rooms', authenticateToken, roomRoutes);       // Skyddade rutter

// Starta servern på angiven port
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Hej Nur! Servern körs på port ${PORT}`);
});
