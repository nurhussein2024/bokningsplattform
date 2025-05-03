// Middleware för att kontrollera om användaren är en admin
const { authorizeAdmin } = require('./authMiddleware');

// Kontrollera om användaren är admin
const checkAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Endast admin har tillgång till denna funktion' });
  }
  next();
};

module.exports = { checkAdmin };
