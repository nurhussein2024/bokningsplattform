const mongoose = require('mongoose');

// Skapa ett schema för användare
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Användarnamn måste vara unikt
    trim: true, // Tar bort onödiga mellanslag
    minlength: 3 // Minsta antal tecken
  },
  password: {
    type: String,
    required: true // Obligatoriskt lösenord
  },
  role: {
    type: String,
    enum: ['User', 'Admin'], // Endast dessa två roller tillåtna
    default: 'User' // Standardrollen är "User"
  }
}, {
  timestamps: true // Skapar createdAt och updatedAt automatiskt
});

// Exportera modellen
module.exports = mongoose.model('User', userSchema);
