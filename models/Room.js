const mongoose = require('mongoose');

// Skapa ett schema för rum
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Rummets namn krävs
  },
  capacity: {
    type: Number,
    required: true // Hur många personer rummet rymmer
  },
  type: {
    type: String,
    enum: ['workspace', 'conference'], // Endast dessa typer tillåtna
    required: true
  }
}, {
  timestamps: true // Skapa createdAt och updatedAt automatiskt
});

module.exports = mongoose.model('Room', roomSchema);
