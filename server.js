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

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store io instance in app for access inside controllers
app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ansluten till MongoDB Atlas'))
  .catch((error) => console.error('❌ Fel vid anslutning till MongoDB:', error));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('🔌 Användare ansluten:', socket.id);

  socket.on('disconnect', () => {
    console.log('❎ Användare frånkopplad:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/rooms', authenticateToken, roomRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Hej Nur! Servern körs på port ${PORT}`);
});
