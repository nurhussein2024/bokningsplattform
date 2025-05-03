const jwt = require('jsonwebtoken');

// Middleware för att kontrollera JWT-token
const authenticateToken = (req, res, next) => {
  // Hämta token från headern
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Ingen token angiven' });
  }

  try {
    // Verifiera token och lagra användardata i req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lagra användardata i req.user
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Ogiltig token' });
  }
};

// Middleware för att tillåta endast admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Endast admin har tillgång' });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin
};
