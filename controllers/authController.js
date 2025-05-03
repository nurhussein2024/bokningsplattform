const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Använder bcryptjs för lösenordskryptering
const jwt = require('jsonwebtoken');

// Registrera en ny användare
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kontrollera om användarnamnet redan finns
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Användarnamn finns redan' });
    }

    // Kryptera lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Skapa en ny användare och spara i databasen
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'Användare registrerad' });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid registrering' });
  }
};

// Logga in en användare
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hämta användaren från databasen
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Ogiltigt användarnamn eller lösenord' });
    }

    // Jämför det angivna lösenordet med det hashade lösenordet i databasen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ogiltigt användarnamn eller lösenord' });
    }

    // Skapa en JWT-token för autentisering
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Tokenen är giltig i 1 dag
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid inloggning' });
  }
};

module.exports = {
  register,
  login
};
