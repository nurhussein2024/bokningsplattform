// Importera mongoose-biblioteket för att ansluta till MongoDB
const mongoose = require('mongoose');

// Funktion för att ansluta till MongoDB
const connectDB = async () => {
  try {
    // Anslut till MongoDB med hjälp av miljövariabel
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Ansluten till MongoDB');
  } catch (error) {
    console.error('❌ Fel vid anslutning till MongoDB:', error.message);
    process.exit(1); // Avsluta processen vid fel
  }
};

module.exports = connectDB;
