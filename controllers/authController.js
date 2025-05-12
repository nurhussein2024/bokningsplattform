const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Använder bcryptjs för lösenordskryptering
const jwt = require('jsonwebtoken');

// Registrera en ny användare
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kontrollera att alla fält är ifyllda
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Alla fält är obligatoriska' });
    }

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
    console.error(error); // För felsökning
    res.status(500).json({ message: 'Serverfel vid registrering' });
  }
};

// Logga in en användare
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kontrollera att användarnamn och lösenord är ifyllda
    if (!username || !password) {
      return res.status(400).json({ message: 'Användarnamn och lösenord krävs' });
    }

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

    res.status(200).json({
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error); // För felsökning
    res.status(500).json({ message: 'Serverfel vid inloggning' });
  }
};

module.exports = {
  register,
  login
};
